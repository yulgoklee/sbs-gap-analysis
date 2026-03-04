// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let apiKey        = '';
let selectedGoal  = '';
let selectedTrack = '';
let jobSpecificity = '';   // 'specific' | 'general'
let aiToolLevel   = 0;
let skillLevels   = {};
let analysisResult = null;

// ═══════════════════════════════════════════════════════
//  API KEY
// ═══════════════════════════════════════════════════════
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('API 키를 입력해주세요.'); return; }
  apiKey = key;
  document.getElementById('apiModal').style.display = 'none';
}

// ═══════════════════════════════════════════════════════
//  STEP NAVIGATION
// ═══════════════════════════════════════════════════════
function showSection(n) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec' + n).classList.add('active');
  document.getElementById('loading').style.display = 'none';
  document.getElementById('result').style.display = 'none';
  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById('step' + i);
    step.classList.remove('active', 'done');
    if (i < n) step.classList.add('done');
    else if (i === n) step.classList.add('active');
    if (i < 4) {
      document.getElementById('line' + i).classList.toggle('done', i < n);
    }
  }
}

function goToStep1() { showSection(1); }

function goToStep2() {
  const name   = document.getElementById('name').value.trim();
  const age    = document.getElementById('age').value;
  const bg     = document.getElementById('background').value;
  const status = document.getElementById('currentStatus').value;
  if (!name || !age || !bg || !status) {
    alert('이름, 나이, 배경, 현재 상태를 모두 입력해주세요.');
    return;
  }
  showSection(2);
}

function goToStep3() {
  if (!selectedGoal)  { alert('목표 유형을 선택해주세요.'); return; }
  if (!selectedTrack) { alert('희망 트랙을 선택해주세요.'); return; }
  if (selectedGoal === 'employment' && !jobSpecificity) {
    alert('취업 목표를 선택해주세요. (특정 직업 / 해당 직군)');
    return;
  }
  if (selectedGoal === 'certification') {
    const cert = document.getElementById('targetCert')?.value.trim();
    if (!cert) { alert('목표 자격증을 입력해주세요.'); return; }
  }
  buildSkillCheck();
  showSection(3);
}

// ═══════════════════════════════════════════════════════
//  GOAL & TRACK SELECT
// ═══════════════════════════════════════════════════════
function selectGoal(g) {
  selectedGoal = g;
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('goal_' + g).classList.add('selected');
  document.getElementById('jobField').style.display  = (g === 'employment')    ? 'block' : 'none';
  document.getElementById('certField').style.display = (g === 'certification') ? 'block' : 'none';
  // 목표 전환 시 직업 구체성 초기화
  if (g !== 'employment') {
    jobSpecificity = '';
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('specificJobInput').style.display = 'none';
  }
}

function selectTrack(t) {
  selectedTrack = t;
  document.querySelectorAll('.track-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('track_' + t).classList.add('selected');
}

// ═══════════════════════════════════════════════════════
//  JOB SPECIFICITY SELECT
// ═══════════════════════════════════════════════════════
function selectJobSpecificity(type) {
  jobSpecificity = type;
  document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('radioCard_' + type).classList.add('selected');
  document.getElementById('specificJobInput').style.display = (type === 'specific') ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════
//  SKILL CHECK BUILD
// ═══════════════════════════════════════════════════════
function buildSkillCheck() {
  const tools = TRACK_TOOLS[selectedTrack] || [];
  const area  = document.getElementById('skillCheckArea');
  skillLevels  = {};
  aiToolLevel  = 0;

  // 레벨 설명 범례
  const legendHtml = `
    <div class="level-legend">
      ${LEVEL_LABELS.map((label, i) => `
        <div class="legend-item">
          <span class="legend-label">${label}</span>
          <span class="legend-desc">${LEVEL_DESCS[i]}</span>
        </div>`).join('')}
    </div>`;

  // 툴별 수준 체크
  const toolsHtml = tools.map(tool => `
    <div class="skill-row">
      <div class="skill-name">${tool}</div>
      <div class="skill-levels" id="levels_${tool.replace(/[^a-zA-Z0-9가-힣]/g,'_')}">
        ${LEVEL_LABELS.map((label, i) => `
          <button class="level-btn ${i===0?'selected':''}"
            onclick="selectLevel('${tool.replace(/[^a-zA-Z0-9가-힣]/g,'_')}', '${tool}', ${i}, this)">
            ${label}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  // AI 도구 활용 경험 (별도 섹션)
  const aiToolHtml = `
    <div class="ai-tool-section">
      <div class="ai-tool-title">🤖 AI 도구 활용 경험</div>
      <div class="ai-tool-desc">현재 AI 도구를 어느 수준으로 활용하고 있나요?</div>
      <div class="ai-tool-levels" id="aiToolLevels">
        ${AI_TOOL_LEVELS.map((label, i) => `
          <button class="level-btn ${i===0?'selected':''}"
            onclick="selectAIToolLevel(${i}, this)"
            title="${AI_TOOL_DESCS[i]}">
            ${label}
          </button>
        `).join('')}
      </div>
    </div>`;

  area.innerHTML = legendHtml + toolsHtml + aiToolHtml;
  tools.forEach(t => { skillLevels[t] = 0; });
}

function selectLevel(id, tool, val, el) {
  document.querySelectorAll(`#levels_${id} .level-btn`).forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  skillLevels[tool] = val;
}

function selectAIToolLevel(val, el) {
  document.querySelectorAll('#aiToolLevels .level-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  aiToolLevel = val;
}

// ═══════════════════════════════════════════════════════
//  RUN ANALYSIS
// ═══════════════════════════════════════════════════════
async function runAnalysis() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('result').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step3').classList.add('done');
  document.getElementById('line3').classList.add('done');
  document.getElementById('step4').classList.add('active');

  const userInput = buildUserInput();
  try {
    const raw = await callGemini(userInput);
    analysisResult = parseResult(raw);
    renderResult(analysisResult);
  } catch(e) {
    document.getElementById('loading').style.display = 'none';
    alert('분석 중 오류가 발생했습니다: ' + e.message);
    showSection(3);
  }
}

// ═══════════════════════════════════════════════════════
//  BUILD USER INPUT
// ═══════════════════════════════════════════════════════
function buildUserInput() {
  const statusMap = { student: '학생', employed: '재직 중', unemployed: '구직 중', other: '기타' };
  const statusVal = document.getElementById('currentStatus').value;

  const timelineMap = { '3': '3개월 내', '6': '6개월 내', '12': '1년 내', '0': '기간 무관' };
  const timelineVal = document.getElementById('targetTimeline')?.value || '';

  const jobSpecStr = selectedGoal === 'employment'
    ? (jobSpecificity === 'specific'
        ? `특정 직업 목표: ${document.getElementById('desiredJob')?.value?.trim() || '미입력'}`
        : '취업 방향: 해당 직군 취업 희망 (구체적 직업은 미정)')
    : '해당 없음';

  const skillStr = Object.entries(skillLevels)
    .map(([tool, val]) => `- ${tool}: ${LEVEL_LABELS[val]}(${val}/4)`)
    .join('\n');

  const radarConfig = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const goalLabel   = selectedGoal === 'employment' ? '취업 준비' : '자격증 취득';
  const targetVals  = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;

  return `[고객 정보]
- 이름: ${document.getElementById('name').value}
- 나이: ${document.getElementById('age').value}세
- 현재 상태: ${statusMap[statusVal] || '미선택'}
- 배경: ${document.getElementById('background').value === 'major' ? '전공자/관련학과' : '비전공자'}
- 목표 유형: ${goalLabel}
- 희망 트랙: ${selectedTrack}
- ${jobSpecStr}
- 목표 자격증: ${document.getElementById('targetCert')?.value || '없음'}
- 목표 달성 희망 시기: ${timelineMap[timelineVal] || '미선택'}
- 투자 가능 기간: ${document.getElementById('availableMonths').value || '미정'}개월
- 주당 투자 시간: ${document.getElementById('hoursPerWeek').value || '미정'}시간
- AI 도구 활용 경험: ${AI_TOOL_LEVELS[aiToolLevel]} — ${AI_TOOL_DESCS[aiToolLevel]}

[현재 툴 수준 (0=없음 / 1=독학 / 2=학원수강 / 3=자격증 / 4=실무경험)]
${skillStr}

[레이더 차트 분석 요청]
다음 6개 축(0~5점)의 현재 수준을 스킬 입력과 고객 배경을 고려해 계산 후 radar_current 배열로 반환하세요.
축: ${JSON.stringify(radarConfig.axes)}
목표 수준(${goalLabel}): ${JSON.stringify(targetVals)}
변환 기준: 없음=0, 독학=1, 학원수강=2, 자격증=3, 실무=4~5 (전공자면 +0.5 보정)

[월별 플래너 요청]
추천 수업을 순서대로 월별로 배치해 monthly_planner 배열로 반환하세요.
month_offset=1이 다음 달 기준 첫 번째 달입니다.
각 month당 수업명(courses 배열)과 이달 목표(milestone 문자열)를 포함하세요.`.trim();
}

// ═══════════════════════════════════════════════════════
//  BUILD SYSTEM PROMPT
//  ※ 유지보수: 프롬프트 규칙·커리큘럼·JSON 형식은 여기서 관리합니다.
// ═══════════════════════════════════════════════════════
function buildSystemPrompt() {
  const radarConfig = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const goalLabel   = selectedGoal === 'employment' ? '취업 준비' : '자격증 취득';
  const targetVals  = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;

  // 선택 트랙 데이터만 삽입 (토큰 절약)
  const curriculum  = TRACK_CURRICULUM_TEXT[selectedTrack]  || '';
  const jobMarket   = TRACK_JOB_MARKET_TEXT[selectedTrack]  || '';
  const certInfo    = TRACK_CERT_TEXT[selectedTrack]         || '';

  return `SBS아카데미 컴퓨터아트학원 수원점 상담 AI입니다. 아래 데이터 기반으로 GAP분석 결과를 순수 JSON으로만 반환하세요.

[규칙]
1. 학원 커리큘럼 안에서만 수업 추천
2. current_level_summary는 정확히 3줄: 줄1=현재수준 / 줄2=가장큰결핍 / 줄3=달성가능성(솔직하게)
3. 특정직업 명시 → 해당 직업 스펙 기준 GAP분석 / 직군취업희망 → 트랙 신입 공통 스펙 기준
4. 기간산정: 희망기간 무관하게 실제필요기간으로 산정, 단축금지, 재직/학생은 주당시간 반영
5. 취업목표 → job_market 필수 / 자격증목표 → job_market: null
6. 순수 JSON만 반환 (마크다운 코드블록 없이), 한국어

[레이더차트]
트랙:${selectedTrack} | 목표:${goalLabel}
축:${JSON.stringify(radarConfig.axes)}
목표수준:${JSON.stringify(targetVals)}
변환:없음=0,독학=1,학원수강=2,자격증=3,실무=4~5 (전공자+0.5)

[커리큘럼]
${curriculum}

${selectedGoal === 'employment' ? `[취업시장 2025~2026]\n${jobMarket}` : ''}
[자격증정보]
${certInfo}

[출력JSON]
{"customer_summary":{"name":"","goal":"","background":"","status":""},"current_level_summary":"줄1\\n줄2\\n줄3","radar_current":[0,0,0,0,0,0],"gap_analysis":{"strong_points":["",""],"weak_points":["",""],"gap_description":""},"job_market":{"required_skills":[""],"preferred_skills":[""],"ai_requirement":"","portfolio_platform":"","avg_salary":"","market_trend":""},"recommended_courses":[{"order":1,"course_name":"","duration_months":1,"reason":""}],"total_duration":{"min_months":0,"max_months":0},"monthly_planner":[{"month_offset":1,"courses":[""],"milestone":""}],"academy_coverage":{"coverable":[""],"not_coverable":[""],"recommendation":""}}`.trim();
}

// ═══════════════════════════════════════════════════════
//  GEMINI API CALL
// ═══════════════════════════════════════════════════════
// ※ 유지보수: 모델명 변경 시 GEMINI_MODEL 상수만 수정하세요.
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

async function callGemini(userInput) {
  const systemPrompt = buildSystemPrompt();
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + '\n\n' + userInput }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    }
  );
  if (!resp.ok) {
    if (resp.status === 400) throw new Error('요청 형식 오류(400). API 키를 다시 확인하거나 페이지를 새로고침 후 재시도해주세요.');
    if (resp.status === 403) throw new Error('API 키가 유효하지 않습니다(403). API 키를 확인해주세요.');
    if (resp.status === 404) throw new Error('모델을 찾을 수 없습니다(404). 관리자에게 문의해주세요.');
    if (resp.status === 429) throw new Error('요청 한도 초과(429). 1~2분 후 다시 시도해주세요.');
    throw new Error('API 호출 실패: ' + resp.status);
  }
  const data = await resp.json();
  return data.candidates[0].content.parts[0].text;
}

// ═══════════════════════════════════════════════════════
//  PARSE RESULT
// ═══════════════════════════════════════════════════════
function parseResult(raw) {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(raw);
  } catch(e) {
    throw new Error('결과 파싱 실패. 다시 시도해주세요.');
  }
}

// ═══════════════════════════════════════════════════════
//  RENDER RESULT
// ═══════════════════════════════════════════════════════
function renderResult(r) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  // 헤더
  document.getElementById('resultTitle').textContent = `${r.customer_summary.name}님 GAP 분석 결과`;
  document.getElementById('resultSubtitle').textContent =
    `${r.customer_summary.goal} · ${r.customer_summary.background} · ${new Date().toLocaleDateString('ko-KR')} 기준`;

  // 1. 현재 수준 진단 (3줄)
  document.getElementById('currentLevelSummary').textContent = r.current_level_summary;

  // 2. 레이더 차트
  const radarConfig   = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const targetValues  = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;
  const currentValues = Array.isArray(r.radar_current)
    ? r.radar_current.map(v => Math.min(Math.max(Number(v)||0, 0), 5))
    : Array(6).fill(0);
  document.getElementById('radarLegendTarget').textContent =
    selectedGoal === 'employment' ? '취업 목표 수준' : '자격증 목표 수준';
  drawRadarChart('radarChartContainer', radarConfig.axes, targetValues, currentValues);

  // GAP 설명 + 태그
  document.getElementById('gapDescription').textContent = r.gap_analysis.gap_description;
  document.getElementById('strongPoints').innerHTML =
    (r.gap_analysis.strong_points || []).map(p => `<span class="tag tag-strong">✅ ${p}</span>`).join('');
  document.getElementById('weakPoints').innerHTML =
    (r.gap_analysis.weak_points || []).map(p => `<span class="tag tag-weak">⚠️ ${p}</span>`).join('');

  // 3. 직군 요구 스펙 (취업 목표 시)
  const jm = r.job_market;
  if (jm && selectedGoal === 'employment') {
    document.getElementById('jobMarketSection').style.display = 'block';
    document.getElementById('jobSpecGrid').innerHTML = `
      <div class="job-spec-card required">
        <div class="job-spec-label">✅ 필수 스킬</div>
        ${(jm.required_skills || []).map(s => `<div class="job-spec-item">${s}</div>`).join('')}
      </div>
      <div class="job-spec-card preferred">
        <div class="job-spec-label">⭐ 우대 스킬</div>
        ${(jm.preferred_skills || []).map(s => `<div class="job-spec-item">${s}</div>`).join('')}
      </div>
      <div class="job-spec-card info">
        <div class="job-spec-label">🤖 AI 활용 요구</div>
        <div class="job-spec-item">${jm.ai_requirement || '-'}</div>
      </div>
      <div class="job-spec-card info">
        <div class="job-spec-label">💰 신입 평균 연봉</div>
        <div class="job-spec-item salary">${jm.avg_salary || '-'}</div>
      </div>
      <div class="job-spec-card trend">
        <div class="job-spec-label">📈 채용 트렌드</div>
        <div class="job-spec-item">${jm.market_trend || '-'}</div>
      </div>
      ${jm.portfolio_platform ? `
      <div class="job-spec-card info">
        <div class="job-spec-label">📁 포트폴리오 플랫폼</div>
        <div class="job-spec-item">${jm.portfolio_platform}</div>
      </div>` : ''}
    `;
  } else {
    document.getElementById('jobMarketSection').style.display = 'none';
  }

  // 4. 추천 수업 로드맵
  document.getElementById('courseTimeline').innerHTML =
    (r.recommended_courses || []).map(c => `
      <div class="course-item">
        <div class="course-order">${c.order}</div>
        <div class="course-info">
          <div class="course-name">${c.course_name}</div>
          <div class="course-reason">${c.reason}</div>
        </div>
        <div class="course-duration">${c.duration_months}개월</div>
      </div>
    `).join('');

  // 5. 예상 기간
  document.getElementById('durationMin').textContent = r.total_duration.min_months;
  document.getElementById('durationMax').textContent = r.total_duration.max_months;
  const avail = parseInt(document.getElementById('availableMonths').value) || 0;
  if (avail > 0 && r.total_duration.min_months > avail) {
    document.getElementById('durationNote').textContent =
      `⚠️ 희망 기간(${avail}개월)보다 실제 필요 기간이 깁니다. 목표 달성을 위해 기간 조정이 필요합니다.`;
  } else {
    document.getElementById('durationNote').textContent = '';
  }

  // 6. 월별 플래너
  renderMonthlyPlanner(r.monthly_planner || []);

  // 7. 학원 수강 안내
  document.getElementById('coverableList').innerHTML =
    (r.academy_coverage.coverable || []).map(i => `<li>${i}</li>`).join('');
  document.getElementById('notCoverableList').innerHTML =
    (r.academy_coverage.not_coverable || []).map(i => `<li>${i}</li>`).join('');
  document.getElementById('recommendationBox').textContent = r.academy_coverage.recommendation;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════
//  DRAW RADAR CHART (SVG)
// ═══════════════════════════════════════════════════════
function drawRadarChart(containerId, axes, target, current) {
  const W = 480, H = 420;
  const cx = W / 2, cy = H / 2 - 15;
  const R = 130;
  const n = axes.length; // 6
  const MAX = 5;
  const labelDist = 36;

  function angle(i) { return (Math.PI * 2 * i / n) - Math.PI / 2; }

  function pt(val, i) {
    const a = angle(i);
    const r = (Math.min(Math.max(val, 0), MAX) / MAX) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  // 배경 육각형 (레벨 1~5)
  let bg = '';
  for (let lv = 1; lv <= 5; lv++) {
    const pts = Array.from({length: n}, (_, i) => {
      const a = angle(i);
      const r = (lv / MAX) * R;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    const fills = ['#FDFDFF','#F8F9FF','#F2F5FF','#EBF0FF','#E3ECFF'];
    bg += `<polygon points="${pts}" fill="${fills[lv-1]}" stroke="#DFE1E6" stroke-width="0.8"/>`;
  }

  // 축선 + 레이블
  let axLines = '', labels = '';
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    const [ox, oy] = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    axLines += `<line x1="${cx}" y1="${cy}" x2="${ox}" y2="${oy}" stroke="#DFE1E6" stroke-width="1"/>`;

    const lx = cx + (R + labelDist) * Math.cos(a);
    const ly = cy + (R + labelDist) * Math.sin(a);
    const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
    const dyAdj  = ly < cy - 8 ? '-0.3em' : ly > cy + 8 ? '1em' : '0.35em';
    labels += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dy="${dyAdj}"
      font-size="10.5" font-family="'Noto Sans KR',sans-serif" fill="#5E6C84" font-weight="500">${axes[i]}</text>`;
  }

  // 레벨 숫자 (첫 번째 축 위)
  let lvLabels = '';
  for (let lv = 1; lv <= 5; lv++) {
    const a = angle(0);
    const r = (lv / MAX) * R;
    lvLabels += `<text x="${cx + r * Math.cos(a) + 4}" y="${cy + r * Math.sin(a)}"
      font-size="8" fill="#B3BAC5" font-family="'Noto Sans KR',sans-serif" dominant-baseline="central">${lv}</text>`;
  }

  // 목표 다각형 (빨간 점선)
  const tPts = target.map((v, i) => pt(v, i).join(',')).join(' ');
  const tPoly = `<polygon points="${tPts}" fill="rgba(255,86,48,0.1)" stroke="#FF5630" stroke-width="1.8" stroke-dasharray="5,3"/>`;

  // 현재 다각형 (파란 실선)
  const cPts = current.map((v, i) => pt(v, i).join(',')).join(' ');
  const cPoly = `<polygon points="${cPts}" fill="rgba(0,82,204,0.15)" stroke="#0052CC" stroke-width="2"/>`;

  // 점 마커
  let dots = '';
  target.forEach((v, i) => {
    const [px, py] = pt(v, i);
    dots += `<circle cx="${px}" cy="${py}" r="3" fill="#FF5630" stroke="white" stroke-width="1.2"/>`;
  });
  current.forEach((v, i) => {
    const [px, py] = pt(v, i);
    dots += `<circle cx="${px}" cy="${py}" r="4" fill="#0052CC" stroke="white" stroke-width="1.5"/>`;
  });

  // 범례
  const legendY = H - 20;
  const legend = `
    <line x1="20" y1="${legendY}" x2="40" y2="${legendY}" stroke="#FF5630" stroke-width="2" stroke-dasharray="5,3"/>
    <circle cx="30" cy="${legendY}" r="3" fill="#FF5630"/>
    <text x="46" y="${legendY}" font-size="10" fill="#6B778C" dominant-baseline="central" font-family="'Noto Sans KR',sans-serif">
      ${selectedGoal === 'employment' ? '취업 목표 수준' : '자격증 목표 수준'}
    </text>
    <line x1="200" y1="${legendY}" x2="220" y2="${legendY}" stroke="#0052CC" stroke-width="2"/>
    <circle cx="210" cy="${legendY}" r="4" fill="#0052CC"/>
    <text x="226" y="${legendY}" font-size="10" fill="#6B778C" dominant-baseline="central" font-family="'Noto Sans KR',sans-serif">현재 수준</text>
  `;

  document.getElementById(containerId).innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block; margin:0 auto; max-width:480px">
      ${bg}${axLines}${lvLabels}${tPoly}${cPoly}${dots}${labels}${legend}
    </svg>`;
}

// ═══════════════════════════════════════════════════════
//  RENDER MONTHLY PLANNER
// ═══════════════════════════════════════════════════════
function renderMonthlyPlanner(planner) {
  const section = document.getElementById('monthlyPlannerSection');
  if (!planner || planner.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  // 다음 달 기준으로 시작
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const baseYear  = start.getFullYear();
  const baseMonth = start.getMonth(); // 0-indexed

  const MN = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  const html = planner.map((item) => {
    const totalIdx  = baseMonth + (item.month_offset - 1);
    const monthIdx  = totalIdx % 12;
    const yearOff   = Math.floor(totalIdx / 12);
    const label     = `${baseYear + yearOff}년 ${MN[monthIdx]}`;

    const coursesHtml = (item.courses || [])
      .map(c => `<div class="planner-course">${c}</div>`)
      .join('');

    return `
      <div class="planner-card">
        <div class="planner-month-badge">${label}</div>
        <div class="planner-courses">${coursesHtml}</div>
        ${item.milestone ? `<div class="planner-milestone">🎯 ${item.milestone}</div>` : ''}
      </div>`;
  }).join('');

  document.getElementById('monthlyPlannerGrid').innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  PDF & RESET
// ═══════════════════════════════════════════════════════
function generatePDF() {
  if (!analysisResult) return;
  window.print();
}

function resetAll() {
  selectedGoal   = '';
  selectedTrack  = '';
  jobSpecificity = '';
  aiToolLevel    = 0;
  skillLevels    = {};
  analysisResult = null;
  document.getElementById('result').style.display = 'none';
  document.getElementById('specificJobInput').style.display = 'none';
  document.querySelectorAll('.goal-btn, .track-btn, .radio-card').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('input[name="jobSpecificity"]').forEach(r => r.checked = false);
  showSection(1);
}
