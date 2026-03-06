// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let apiKey        = '';
let selectedTrack = '';
let aiToolLevel   = 0;
let skillLevels   = {};
let analysisResult = null;

const TRACK_NAMES = {
  motion: '모션/영상', interior: '건축/인테리어', visual_editing: '시각/편집디자인',
  web: '웹디자인', cg_maya: 'CG/마야', it_programming: 'IT/프로그래밍',
  ai: 'AI', artwork: '아트웍', certification: '자격증 과정'
};

// ═══════════════════════════════════════════════════════
//  API KEY
// ═══════════════════════════════════════════════════════
const LS_KEY = 'sbs_gemini_api_key';

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('API 키를 입력해주세요.'); return; }
  apiKey = key;
  localStorage.setItem(LS_KEY, key);
  document.getElementById('apiModal').style.display = 'none';
}

function changeApiKey() {
  document.getElementById('apiKeyInput').value = localStorage.getItem(LS_KEY) || '';
  document.getElementById('apiModal').style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) { apiKey = saved; document.getElementById('apiModal').style.display = 'none'; }

  // 적성검사(A)에서 트랙 파라미터로 넘어온 경우 자동 선택
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('track');
  if (trackParam && TRACK_NAMES[trackParam]) {
    selectTrack(trackParam);
    // 이름 입력창으로 포커스 이동
    setTimeout(() => document.getElementById('name').focus(), 300);
  }
});

// ═══════════════════════════════════════════════════════
//  STEP NAVIGATION (3단계)
// ═══════════════════════════════════════════════════════
function showSection(n) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec' + n).classList.add('active');
  document.getElementById('loading').style.display = 'none';
  document.getElementById('result').style.display  = 'none';

  for (let i = 1; i <= 3; i++) {
    const step = document.getElementById('step' + i);
    step.classList.remove('active', 'done');
    if (i < n) step.classList.add('done');
    else if (i === n) step.classList.add('active');
    if (i < 3) {
      document.getElementById('line' + i).classList.toggle('done', i < n);
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep1() { showSection(1); }

function goToStep2() {
  const name   = document.getElementById('name').value.trim();
  const status = document.getElementById('currentStatus').value;
  if (!name)        { alert('이름을 입력해주세요.'); return; }
  if (!status)      { alert('현재 신분을 선택해주세요.'); return; }
  if (!selectedTrack){ alert('희망 트랙을 선택해주세요.'); return; }
  buildSkillCheck();
  showSection(2);
}

// ═══════════════════════════════════════════════════════
//  TRACK SELECT
// ═══════════════════════════════════════════════════════
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
  const area  = document.getElementById('skillCheckArea');
  skillLevels  = {};
  aiToolLevel  = 0;

  const legendHtml = `
    <div class="level-legend">
      ${LEVEL_LABELS.map((label, i) => `
        <div class="legend-item">
          <span class="legend-label">${label}</span>
          <span class="legend-desc">${LEVEL_DESCS[i]}</span>
        </div>`).join('')}
    </div>`;

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
  document.getElementById('result').style.display  = 'none';
  document.getElementById('loading').style.display = 'block';

  // step2 → done, step3 → active
  ['step1','step2'].forEach(id => {
    document.getElementById(id).classList.remove('active');
    document.getElementById(id).classList.add('done');
  });
  ['line1','line2'].forEach(id => document.getElementById(id).classList.add('done'));
  document.getElementById('step3').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  let aiResult = null;
  let isAiFallback = false;

  if (apiKey) {
    try {
      const raw = await callGemini(buildUserInput(), buildSystemPrompt());
      aiResult = parseResult(raw);
    } catch(e) {
      console.warn('AI 분석 실패, 표준 로드맵으로 대체:', e.message);
      isAiFallback = true;
    }
  } else {
    isAiFallback = true;
  }

  document.getElementById('loading').style.display = 'none';
  renderResult(aiResult, isAiFallback);
}

// ═══════════════════════════════════════════════════════
//  BUILD USER INPUT
// ═══════════════════════════════════════════════════════
function buildUserInput() {
  const statusMap = {
    job_seeker: '구직 중', graduate_ready: '졸업예정(취업준비생)',
    student: '재학 중 대학생', employed: '재직 중', other: '기타'
  };
  const statusVal = document.getElementById('currentStatus').value;

  const skillStr = Object.entries(skillLevels)
    .map(([tool, val]) => `  - ${tool}: ${LEVEL_LABELS[val]}(${val}/4)`)
    .join('\n');

  const radarConfig = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const stagesStr   = (TRACK_ROADMAP_STAGES[selectedTrack] || [])
    .map((s, i) => `  ${i+1}. [${s.stage}] ${s.courses.join(', ')} → ${s.outcome} (표준 ${s.months}개월)`)
    .join('\n');

  return `[고객 정보]
- 이름: ${document.getElementById('name').value}
- 현재 신분: ${statusMap[statusVal] || '미선택'}
- 희망 트랙: ${TRACK_NAMES[selectedTrack]}
- AI 도구 활용: ${AI_TOOL_LEVELS[aiToolLevel]}

[현재 툴 수준 (0=없음/1=독학/2=학원수강/3=자격증/4=실무경험)]
${skillStr}

[레이더 차트 요청]
축: ${JSON.stringify(radarConfig.axes)}
취업 목표 수준: ${JSON.stringify(radarConfig.employment_target)}
현재 수준을 스킬 입력 기반으로 0~5점으로 계산해 radar_current 배열로 반환

[표준 로드맵 (개인화 기준)]
${stagesStr}`.trim();
}

// ═══════════════════════════════════════════════════════
//  BUILD SYSTEM PROMPT
// ═══════════════════════════════════════════════════════
function buildSystemPrompt() {
  const curriculum = TRACK_CURRICULUM_TEXT[selectedTrack]  || '';
  const jobMarket  = TRACK_JOB_MARKET_TEXT[selectedTrack]  || '';
  const certInfo   = TRACK_CERT_TEXT[selectedTrack]         || '';

  return `SBS아카데미 컴퓨터아트학원 수원점 상담 AI입니다. 아래 데이터 기반으로 GAP분석 결과를 순수 JSON으로만 반환하세요.

[규칙]
1. 학원 커리큘럼 안에서만 수업 추천
2. strong_points: 학원수강(2) 이상 스킬 → 강점 (없으면 "아직 전문 스킬 없음")
3. weak_points: 없음(0)·독학(1) 중 취업 필수 스킬 → 채울 것들
4. roadmap_stages: 표준 로드맵을 현재 스킬에 맞게 개인화 (학원수강 이상 스킬 포함 단계는 reducible=true)
5. reduce_reason: 단축 가능 이유를 간결하게 (왜 단축되는지)
6. total_duration: standard_months=표준 합계, personalized_min/max=현재 스킬 반영 후 예상
7. 순수 JSON만 반환 (마크다운 코드블록 없이), 한국어

[커리큘럼]
${curriculum}

[취업시장 2025~2026]
${jobMarket}

[자격증 정보]
${certInfo}

[출력 JSON 형식]
{"customer_summary":{"name":""},"radar_current":[0,0,0,0,0,0],"strong_points":[""],"weak_points":[""],"gap_description":"현재와 목표 사이 갭 한두 문장","roadmap_stages":[{"stage":"","courses":[""],"outcome":"","months":0,"reducible":false,"reduce_reason":""}],"total_duration":{"standard_months":0,"personalized_min":0,"personalized_max":0},"personalization_note":"현재 스킬 반영 개인화 메시지 1~2문장"}`.trim();
}

// ═══════════════════════════════════════════════════════
//  GEMINI API CALL
// ═══════════════════════════════════════════════════════
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

async function callGemini(userInput, systemPrompt) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + '\n\n' + userInput }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 3000 }
      })
    }
  );
  if (!resp.ok) {
    if (resp.status === 403) throw new Error('API 키 오류(403)');
    if (resp.status === 429) throw new Error('요청 한도 초과(429)');
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
    throw new Error('결과 파싱 실패');
  }
}

// ═══════════════════════════════════════════════════════
//  FALLBACK: 스킬 기반 강점/약점 계산
// ═══════════════════════════════════════════════════════
function calcFallbackAnalysis() {
  const strong = [];
  const weak   = [];

  Object.entries(skillLevels).forEach(([tool, level]) => {
    if (level >= 2) strong.push(`${tool} (${LEVEL_LABELS[level]})`);
    else if (level === 1) weak.push(`${tool} — 심화 학습 필요`);
    else weak.push(`${tool} — 처음부터 시작`);
  });

  if (aiToolLevel >= 2) strong.push(`AI 도구 활용 (${AI_TOOL_LEVELS[aiToolLevel]})`);

  return {
    strong_points: strong.length ? strong : ['학습 준비 완료 — 기초부터 체계적으로 시작 가능'],
    weak_points:   weak,
    gap_description: `${TRACK_NAMES[selectedTrack]} 트랙의 표준 커리큘럼에 따라 학습을 시작합니다.`
  };
}

// ═══════════════════════════════════════════════════════
//  RENDER RESULT
// ═══════════════════════════════════════════════════════
function renderResult(r, isAiFallback) {
  document.getElementById('result').style.display = 'block';

  const name = document.getElementById('name').value || '';

  // 헤더
  document.getElementById('resultTitle').textContent   = `${name}님의 GAP 분석 결과`;
  document.getElementById('resultSubtitle').textContent =
    `${TRACK_NAMES[selectedTrack]} 트랙 · ${new Date().toLocaleDateString('ko-KR')} 기준`;

  // ① After 섹션
  renderAfterSection();

  // ② Before 섹션
  renderBeforeSection(r, isAiFallback);

  // ③ 로드맵 섹션
  renderRoadmapSection(r, isAiFallback);

  analysisResult = r;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── ① After ──────────────────────────────────────────
function renderAfterSection() {
  const track = TRACK_AFTER_DATA[selectedTrack];
  if (!track) return;

  const card = document.getElementById('afterCard');
  card.style.background = track.bg;

  card.innerHTML = `
    <div class="after-card-top">
      <div class="after-track-icon">${track.icon}</div>
      <div>
        <div class="after-track-label">${TRACK_NAMES[selectedTrack].toUpperCase()} TRACK</div>
        <div class="after-job-title">${track.jobTitle}</div>
      </div>
    </div>
    <div class="after-tasks">
      <div class="after-tasks-label">이런 일을 하게 됩니다</div>
      ${track.tasks.map(t => `
        <div class="after-task-item">
          <div class="after-task-check">✓</div>
          <span>${t}</span>
        </div>`).join('')}
    </div>
    <div class="after-meta-grid">
      <div class="after-meta-item">
        <div class="after-meta-label">💰 신입 연봉</div>
        <div class="after-meta-value">${track.salary.min.toLocaleString()}~${track.salary.max.toLocaleString()}만원</div>
      </div>
      <div class="after-meta-item">
        <div class="after-meta-label">📅 준비 기간</div>
        <div class="after-meta-value">${track.duration.min}~${track.duration.max}개월<br/><span style="font-size:10px;opacity:0.75">(비전공자 기준)</span></div>
      </div>
      <div class="after-meta-item">
        <div class="after-meta-label">🏢 주요 취업처</div>
        <div class="after-meta-value">${track.employers.join(', ')}</div>
      </div>
    </div>
    ${track.certSpecs ? `
    <div class="after-extra-grid">
      <div class="after-extra-block">
        <div class="after-extra-label">🏅 주요 취업스펙</div>
        <div class="after-extra-tags">
          ${track.certSpecs.map(s => `<span class="after-spec-tag">${s}</span>`).join('')}
        </div>
      </div>
      <div class="after-extra-block">
        <div class="after-extra-label">📁 포트폴리오</div>
        <div class="after-extra-tags">
          ${track.portfolio.map(p => `<span class="after-spec-tag">${p}</span>`).join('')}
        </div>
      </div>
    </div>` : ''}`;
}

// ── ② Before ─────────────────────────────────────────
function renderBeforeSection(r, isAiFallback) {
  const fb = isAiFallback || !r ? calcFallbackAnalysis() : r;

  // 강점
  document.getElementById('strongPoints').innerHTML =
    (fb.strong_points || []).map(p => `<span class="tag tag-strong">✅ ${p}</span>`).join('');

  // 약점
  document.getElementById('weakPoints').innerHTML =
    (fb.weak_points || []).map(p => `<span class="tag tag-weak">📌 ${p}</span>`).join('');

  // GAP 설명
  const gapEl = document.getElementById('gapDescription');
  if (fb.gap_description) {
    gapEl.textContent  = fb.gap_description;
    gapEl.style.display = 'block';
  } else {
    gapEl.style.display = 'none';
  }

  // 레이더 차트
  const radarConfig    = TRACK_RADAR_CONFIG[selectedTrack] || TRACK_RADAR_CONFIG.certification;
  const targetValues   = radarConfig.employment_target;
  const currentValues  = (!isAiFallback && r && Array.isArray(r.radar_current))
    ? r.radar_current.map(v => Math.min(Math.max(Number(v)||0, 0), 5))
    : Array(6).fill(0);

  drawRadarChart('radarChartContainer', radarConfig.axes, targetValues, currentValues);
}

// ── ③ 로드맵 ──────────────────────────────────────────
function renderRoadmapSection(r, isAiFallback) {
  const hasAiRoadmap = !isAiFallback && r && Array.isArray(r.roadmap_stages) && r.roadmap_stages.length;

  // AI 개인화 노트
  const noteEl = document.getElementById('personalizationNote');
  if (hasAiRoadmap && r.personalization_note) {
    document.getElementById('personalizationNoteText').textContent = r.personalization_note;
    noteEl.style.display = 'block';
  } else {
    noteEl.style.display = 'none';
  }

  // Fallback 안내
  document.getElementById('fallbackNote').style.display = isAiFallback ? 'block' : 'none';

  // 스테이지 렌더링
  const stages = hasAiRoadmap
    ? r.roadmap_stages
    : TRACK_ROADMAP_STAGES[selectedTrack] || [];

  const track = TRACK_AFTER_DATA[selectedTrack];
  const accentColor = track ? track.color : 'var(--primary)';

  document.getElementById('stageTimeline').innerHTML = stages.map((s, i) => `
    <div class="stage-item ${s.reducible ? 'reducible' : ''}">
      <div class="stage-header">
        <div class="stage-num" style="${s.reducible ? `background:${accentColor}` : ''}">${i + 1}</div>
        <div class="stage-info">
          <div class="stage-name">${s.stage}</div>
          <div class="stage-courses">${(s.courses || []).join(' · ')}</div>
        </div>
        <div class="stage-months" style="${s.reducible ? `color:${accentColor}` : ''}">${s.months}개월</div>
      </div>
      <div class="stage-outcome">→ ${s.outcome}</div>
      ${s.reducible && s.reduce_reason
        ? `<div class="stage-reduce-note" style="color:${accentColor}">⚡ ${s.reduce_reason}</div>`
        : ''}
    </div>`).join('');

  // 기간 요약
  const dur = (!isAiFallback && r && r.total_duration) ? r.total_duration : null;
  const trackDur = TRACK_AFTER_DATA[selectedTrack]?.duration;
  const durationEl = document.getElementById('durationSummary');

  if (dur && dur.personalized_min && dur.personalized_min !== dur.standard_months) {
    durationEl.innerHTML = `
      <div class="duration-summary-box">
        <div class="duration-summary-num">${dur.standard_months}</div>
        <div class="duration-summary-label">표준 개월</div>
      </div>
      <div class="duration-vs">→</div>
      <div class="duration-summary-box personalized">
        <div class="duration-summary-num">${dur.personalized_min}~${dur.personalized_max}</div>
        <div class="duration-summary-label">현재 스킬 반영 개월</div>
      </div>`;
  } else {
    const min = dur?.standard_months || trackDur?.min || '-';
    const max = trackDur?.max || '-';
    durationEl.innerHTML = `
      <div class="duration-summary-box">
        <div class="duration-summary-num">${min}~${max}</div>
        <div class="duration-summary-label">예상 소요 개월 (비전공자 기준)</div>
      </div>`;
  }

}

// ═══════════════════════════════════════════════════════
//  DRAW RADAR CHART (SVG) — 기존 유지
// ═══════════════════════════════════════════════════════
function drawRadarChart(containerId, axes, target, current) {
  const W = 480, H = 420;
  const cx = W / 2, cy = H / 2 - 15;
  const R = 130, n = axes.length, MAX = 5;
  const labelDist = 36;

  function angle(i) { return (Math.PI * 2 * i / n) - Math.PI / 2; }
  function pt(val, i) {
    const a = angle(i);
    const r = (Math.min(Math.max(val, 0), MAX) / MAX) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  let bg = '';
  for (let lv = 1; lv <= 5; lv++) {
    const pts = Array.from({length: n}, (_, i) => {
      const a = angle(i), r = (lv / MAX) * R;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    const fills = ['#FDFDFF','#F8F9FF','#F2F5FF','#EBF0FF','#E3ECFF'];
    bg += `<polygon points="${pts}" fill="${fills[lv-1]}" stroke="#DFE1E6" stroke-width="0.8"/>`;
  }

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

  let lvLabels = '';
  for (let lv = 1; lv <= 5; lv++) {
    const a = angle(0), r = (lv / MAX) * R;
    lvLabels += `<text x="${cx + r * Math.cos(a) + 4}" y="${cy + r * Math.sin(a)}"
      font-size="8" fill="#B3BAC5" font-family="'Noto Sans KR',sans-serif" dominant-baseline="central">${lv}</text>`;
  }

  const tPts  = target.map((v, i) => pt(v, i).join(',')).join(' ');
  const tPoly = `<polygon points="${tPts}" fill="rgba(255,86,48,0.1)" stroke="#FF5630" stroke-width="1.8" stroke-dasharray="5,3"/>`;

  const cPts  = current.map((v, i) => pt(v, i).join(',')).join(' ');
  const cPoly = `<polygon points="${cPts}" fill="rgba(0,82,204,0.15)" stroke="#0052CC" stroke-width="2"/>`;

  let dots = '';
  target.forEach((v, i) => {
    const [px, py] = pt(v, i);
    dots += `<circle cx="${px}" cy="${py}" r="3" fill="#FF5630" stroke="white" stroke-width="1.2"/>`;
  });
  current.forEach((v, i) => {
    const [px, py] = pt(v, i);
    dots += `<circle cx="${px}" cy="${py}" r="4" fill="#0052CC" stroke="white" stroke-width="1.5"/>`;
  });

  const legendY = H - 20;
  const legend = `
    <line x1="20" y1="${legendY}" x2="40" y2="${legendY}" stroke="#FF5630" stroke-width="2" stroke-dasharray="5,3"/>
    <circle cx="30" cy="${legendY}" r="3" fill="#FF5630"/>
    <text x="46" y="${legendY}" font-size="10" fill="#6B778C" dominant-baseline="central" font-family="'Noto Sans KR',sans-serif">취업 목표 수준</text>
    <line x1="200" y1="${legendY}" x2="220" y2="${legendY}" stroke="#0052CC" stroke-width="2"/>
    <circle cx="210" cy="${legendY}" r="4" fill="#0052CC"/>
    <text x="226" y="${legendY}" font-size="10" fill="#6B778C" dominant-baseline="central" font-family="'Noto Sans KR',sans-serif">현재 수준</text>`;

  document.getElementById(containerId).innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block; margin:0 auto; max-width:480px">
      ${bg}${axLines}${lvLabels}${tPoly}${cPoly}${dots}${labels}${legend}
    </svg>`;
}

// ═══════════════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════════════
function resetAll() {
  selectedTrack  = '';
  aiToolLevel    = 0;
  skillLevels    = {};
  analysisResult = null;
  document.getElementById('result').style.display = 'none';
  document.querySelectorAll('.track-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('name').value = '';
  document.getElementById('currentStatus').value = '';
  showSection(1);
}
