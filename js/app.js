// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let apiKey = '';
let selectedGoal = '';
let selectedTrack = '';
let skillLevels = {};
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
  const name = document.getElementById('name').value.trim();
  const age  = document.getElementById('age').value;
  const bg   = document.getElementById('background').value;
  if (!name || !age || !bg) { alert('이름, 나이, 배경을 입력해주세요.'); return; }
  showSection(2);
}
function goToStep3() {
  if (!selectedGoal) { alert('목표 유형을 선택해주세요.'); return; }
  if (!selectedTrack) { alert('희망 트랙을 선택해주세요.'); return; }
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
}
function selectTrack(t) {
  selectedTrack = t;
  document.querySelectorAll('.track-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('track_' + t).classList.add('selected');
}

// ═══════════════════════════════════════════════════════
//  SKILL CHECK BUILD
// ═══════════════════════════════════════════════════════
function buildSkillCheck() {
  const tools = TRACK_TOOLS[selectedTrack] || [];
  const area = document.getElementById('skillCheckArea');
  skillLevels = {};
  area.innerHTML = tools.map(tool => `
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
  tools.forEach(t => { skillLevels[t] = 0; });
}

function selectLevel(id, tool, val, el) {
  document.querySelectorAll(`#levels_${id} .level-btn`).forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  skillLevels[tool] = val;
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
  const skillStr = Object.entries(skillLevels)
    .map(([tool, val]) => `- ${tool}: ${LEVEL_LABELS[val]} (${val}/4)`)
    .join('\n');

  const radarConfig = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const goalLabel = selectedGoal === 'employment' ? '취업 준비' : '자격증 취득';
  const targetVals = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;

  return `[고객 정보]
- 이름: ${document.getElementById('name').value}
- 나이: ${document.getElementById('age').value}세
- 배경: ${document.getElementById('background').value === 'major' ? '전공자/관련학과' : '비전공자'}
- 목표 유형: ${goalLabel}
- 희망 트랙: ${selectedTrack}
- 희망 직업: ${document.getElementById('desiredJob')?.value || '미정'}
- 목표 자격증: ${document.getElementById('targetCert')?.value || '없음'}
- 투자 가능 기간: ${document.getElementById('availableMonths').value || '미정'}개월
- 주당 투자 시간: ${document.getElementById('hoursPerWeek').value || '미정'}시간

[현재 툴 수준 (0=없음 / 1=독학 / 2=학교수강 / 3=자격증보유 / 4=실무경험)]
${skillStr}

[레이더 차트 분석 요청]
다음 6개 축(0~5점)의 현재 수준을 스킬 입력과 고객 배경을 고려해 계산 후 radar_current 배열로 반환하세요.
축: ${JSON.stringify(radarConfig.axes)}
목표 수준(${goalLabel}): ${JSON.stringify(targetVals)}
변환 기준: 없음=0, 독학=1, 학교수강=2, 자격증=3, 실무=4~5 (전공자면 +0.5 보정)

[월별 플래너 요청]
추천 수업을 순서대로 월별로 배치해 monthly_planner 배열로 반환하세요.
month_offset=1이 다음 달 기준 첫 번째 달입니다.
각 month당 수업명(courses 배열)과 이달 목표(milestone 문자열)를 포함하세요.`.trim();
}

// ═══════════════════════════════════════════════════════
//  BUILD SYSTEM PROMPT
// ═══════════════════════════════════════════════════════
function buildSystemPrompt() {
  const radarConfig = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const goalLabel   = selectedGoal === 'employment' ? '취업 준비' : '자격증 취득';
  const targetVals  = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;

  return `당신은 SBS 아카데미 컴퓨터아트학원 수원점의 전문 상담 AI입니다.
아래 커리큘럼 및 취업·자격증 데이터를 토대로 고객 맞춤 GAP 분석 결과를 JSON 형식으로만 반환하세요.

[분석 규칙]
1. 반드시 학원 커리큘럼 안에서만 수업을 추천하세요
2. 투자 가능 기간보다 필요 기간이 길면 현실적인 전체 기간을 그대로 제시하세요 (단축 금지)
3. 취업 트렌드는 2025~2026년 한국 기준으로 구체적으로 작성하세요
4. 자격증 목표 시 시험 횟수, 주관처, 응시 조건을 milestone에 반영하세요
5. 반드시 순수 JSON만 반환하세요 (마크다운 코드블록 없이)
6. 모든 텍스트는 한국어로 작성하세요

[레이더 차트 기준]
트랙: ${selectedTrack} | 목표: ${goalLabel}
6개 축: ${JSON.stringify(radarConfig.axes)}
목표 수준(5점 만점): ${JSON.stringify(targetVals)}

[학원 커리큘럼 데이터]
■ 공통기초
- 포토샵 기초(1개월), 포토웍스/심화(1개월), 일러스트 기초(1개월), 디테일일러스트/심화(1개월)

■ 모션/영상
- 프리미어프로(1), 애프터이펙트1(1), 애프터이펙트2(1), 애프터이펙트3(1)
- 시네마4D 1~5(각 1개월), 모션포트폴리오(최소 2개월), AI크리에이터-모션(1, 선택)

■ 건축/인테리어
- 실내건축자격증: 기능사(3~4개월)/산업기사(4~5개월)/기사(5~6개월)
- 스케치업1~2(각1), 캐드1~2(각1), 3ds Max1~2(각1), BIM1~2(각1)
- 인테리어포트폴리오(최소2), AI크리에이터-인테리어(1, 선택)

■ 시각/편집디자인
- 인포그래픽1~2(각1), 브랜딩디자인1~2(각1), 패키지디자인1~2(각1)
- 그래픽아트웍(1), 인디자인1~2(각1), 시각편집포트폴리오(최소2), AI크리에이터(1, 선택)

■ 웹디자인
- 인포그래픽(2), 브랜딩디자인(2)
- 웹퍼블리셔1 HTML(1), 웹퍼블리셔2 CSS(1), 웹퍼블리셔3 JS(1), 웹퍼블리셔4 jQuery(1)
- UI/UX1(1), UI/UX2(1), 웹포트폴리오(최소2), AI크리에이터-웹(1, 선택)

■ CG/마야
- 마야1~9(각1), 애프터이펙트(3), Unreal(1), CG포트폴리오(최소2), AI크리에이터(1, 선택)

■ IT/프로그래밍
- C언어(2), Java/Android(2), Python(2), AICE자격증(1, 파이썬 이수 후)
- 백엔드 JSP/DB(6)

■ AI
- AI자격증(1), AI기초반 ChatGPT+Midjourney(1), AI유튜브(1), AI영상편집(1)

■ 아트웍
- 디지털드로잉(개인 맞춤, 기간 가변), AI아트웍(1), 아트웍포트폴리오(최소2)

■ 자격증 단기과정
- GTQ2급(1), GTQ1급(1), GTQ-i(1), 컴퓨터그래픽스기능사(2)
- 웹디자인개발기사(2), MOS(1), 컴활2급(1), 컴활1급(1)
- 전산회계1급(2), 전산세무2급(2), CAT2급(1), 전산응용건축제도기능사(3~4), ACP(1)

[취업 시장 정보 (2025~2026 한국)]
- 모션/영상: 숏폼(릴스/쇼츠) 편집 수요 폭증, AE 모션그래픽+프리미어 편집 동시 필수, 신입 연봉 2,200~2,800만원
- 건축/인테리어: CAD 도면+3D 렌더링 동시 역량 필수, 자격증 보유 우대, 신입 2,000~2,600만원
- 시각/편집: 브랜딩+SNS 콘텐츠 제작 가능한 디자이너 우대, Behance 포폴 필수, 신입 2,000~2,500만원
- 웹디자인: Figma+코딩 가능한 UI/UX 디자이너 수요 높음, 반응형 웹 구현 필수, 신입 2,200~2,700만원
- CG/마야: 게임사(넥슨·넷마블) 및 VFX 스튜디오 상시 채용, ArtStation 포폴 필수, 신입 2,400~3,000만원
- IT/프로그래밍: GitHub 프로젝트+알고리즘 능력 필수, Python/Java 백엔드 수요 높음, 신입 2,600~3,200만원
- AI: AI 활용 능력 전 직군 필수화, AI 콘텐츠 기획 전문직 신규 수요, 프리랜서 병행 가능
- 아트웍: 웹툰·게임·광고 일러스트 수요 지속, ArtStation+SNS 포폴 필수, 신입 1,800~2,400만원

[자격증 취득 기준]
- GTQ 1급: 포토샵 중급 이상, 연 5~6회(KPC), 합격률 약 30%
- GTQ-i: 일러스트 중급 이상, 연 5~6회(KPC)
- 컴퓨터그래픽스기능사: 포토샵+일러스트, 연 4회(산업인력공단), 실기 비중 큼
- 웹디자인개발기사: HTML/CSS/JS 필수, 연 3회(산업인력공단)
- 전산응용건축제도기능사: AutoCAD, 연 4회(산업인력공단), 3~4개월 준비
- 실내건축산업기사: 2년제 관련학과 졸업 또는 실무 2년 필요
- 컴활 1급: 엑셀 고급+액세스, 연 6회(대한상공회의소), 합격률 약 20%
- 전산회계 1급: 회계 이론+KcLep 프로그램, 연 6회(한국세무사회)
- AICE: Python 수료 후 취득 가능, AI 관련 국내 최초 공인 자격증
- AI-POT 2급: AI 기초 활용, 단기 준비 가능

[출력 JSON 형식 — 반드시 이 형식으로만 반환]
{
  "customer_summary": { "name": "", "goal": "", "background": "" },
  "current_level_summary": "현재 수준 2~3줄 요약",
  "radar_current": [0, 0, 0, 0, 0, 0],
  "gap_analysis": {
    "strong_points": ["강점1", "강점2", "강점3"],
    "weak_points": ["보완필요1", "보완필요2", "보완필요3"],
    "gap_description": "GAP 분석 설명 2~3줄 (취업 기준 또는 자격증 기준으로 구체적으로)"
  },
  "recommended_courses": [
    { "order": 1, "course_name": "수업명", "duration_months": 1, "reason": "추천 이유 (GAP 연계)" }
  ],
  "total_duration": { "min_months": 0, "max_months": 0 },
  "monthly_planner": [
    { "month_offset": 1, "courses": ["수업명"], "milestone": "이달 목표 한 줄" }
  ],
  "academy_coverage": {
    "coverable": ["학원에서 커버 가능한 항목"],
    "not_coverable": ["개인 자체 준비 필요 항목"],
    "recommendation": "최종 안내 멘트 2~3줄"
  }
}`.trim();
}

// ═══════════════════════════════════════════════════════
//  GEMINI API CALL
// ═══════════════════════════════════════════════════════
async function callGemini(userInput) {
  const systemPrompt = buildSystemPrompt();
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
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
    if (resp.status === 429) throw new Error('요청 한도 초과(429). 1~2분 후 다시 시도해주세요.');
    if (resp.status === 404) throw new Error('모델을 찾을 수 없습니다(404). API 키를 확인해주세요.');
    if (resp.status === 403) throw new Error('API 키가 유효하지 않습니다(403).');
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

  // 1. 현재 수준 진단
  document.getElementById('currentLevelSummary').textContent = r.current_level_summary;

  // 2. 레이더 차트
  const radarConfig  = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const targetValues = selectedGoal === 'employment' ? radarConfig.employment_target : radarConfig.cert_target;
  const currentValues = Array.isArray(r.radar_current) ? r.radar_current.map(v => Math.min(Math.max(Number(v)||0, 0), 5)) : Array(6).fill(0);
  document.getElementById('radarLegendTarget').textContent = selectedGoal === 'employment' ? '취업 목표 수준' : '자격증 목표 수준';
  drawRadarChart('radarChartContainer', radarConfig.axes, targetValues, currentValues);

  // GAP 설명 + 태그
  document.getElementById('gapDescription').textContent = r.gap_analysis.gap_description;
  document.getElementById('strongPoints').innerHTML =
    (r.gap_analysis.strong_points || []).map(p => `<span class="tag tag-strong">✅ ${p}</span>`).join('');
  document.getElementById('weakPoints').innerHTML =
    (r.gap_analysis.weak_points || []).map(p => `<span class="tag tag-weak">⚠️ ${p}</span>`).join('');

  // 3. 포트폴리오 참고 링크
  const portfolioSites = TRACK_PORTFOLIO_SITES[selectedTrack] || [];
  if (portfolioSites.length > 0) {
    document.getElementById('portfolioSection').style.display = 'block';
    document.getElementById('portfolioLinks').innerHTML = portfolioSites.map(site => `
      <a href="${site.url}" target="_blank" rel="noopener" class="portfolio-link-card">
        <div class="portfolio-link-title">🔗 ${site.title}</div>
        <div class="portfolio-link-desc">${site.description}</div>
      </a>
    `).join('');
  } else {
    document.getElementById('portfolioSection').style.display = 'none';
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
      `⚠️ 희망 기간(${avail}개월)보다 더 필요합니다. 목표 달성을 위해 기간 연장을 검토해 보세요.`;
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

  const html = planner.map((item, idx) => {
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
  selectedGoal  = '';
  selectedTrack = '';
  skillLevels   = {};
  analysisResult = null;
  document.getElementById('result').style.display = 'none';
  document.querySelectorAll('.goal-btn, .track-btn').forEach(b => b.classList.remove('selected'));
  showSection(1);
}
