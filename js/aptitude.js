/* ═══════════════════════════════════════════════════════
   aptitude.js — 적성검사 로직
   ※ 데이터(PERSONAS·QUESTIONS·MAX_SCORES·SECTION_LABELS) → aptitude-data.js
   ※ TRACK_KEYS · TRACKS → constants.js
   ※ API 키 관리 → shared.js
═══════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════
//  STATE  (apiKey · LS_KEY · saveApiKey · changeApiKey → shared.js)
// ═══════════════════════════════════════════════════════
let currentQ         = 0;
let answers          = new Array(QUESTIONS.length).fill(-1);
let topTrackKey      = '';
let autoAdvanceTimer = null;

// ═══════════════════════════════════════════════════════
//  QUIZ FLOW
// ═══════════════════════════════════════════════════════
function startQuiz() {
  answers  = new Array(QUESTIONS.length).fill(-1);
  currentQ = 0;
  document.getElementById('introScreen').style.display = 'none';
  document.getElementById('quizScreen').style.display  = 'block';
  renderQuestion(0);
}

function renderQuestion(idx) {
  currentQ = idx;
  const q      = QUESTIONS[idx];
  const pct    = Math.round((idx / QUESTIONS.length) * 100);
  const remSec = (QUESTIONS.length - idx) * 4;
  const remStr = remSec >= 60 ? `약 ${Math.round(remSec/60)}분 남음` : `약 ${remSec}초 남음`;

  document.getElementById('qCounter').textContent      = `Q${idx + 1} / ${QUESTIONS.length}`;
  document.getElementById('progressFill').style.width  = pct + '%';
  document.getElementById('qTime').textContent         = remStr;
  document.getElementById('qSectionTag').textContent   = SECTION_LABELS[q.section];
  document.getElementById('questionText').textContent  = q.text;

  const btnYes = document.getElementById('btnYes');
  const btnNo  = document.getElementById('btnNo');
  btnYes.className = 'yn-btn' + (answers[idx] === 1 ? ' selected-yes' : '');
  btnNo.className  = 'yn-btn' + (answers[idx] === 0 ? ' selected-no'  : '');
  document.getElementById('btnPrev').disabled = idx === 0;
}

function selectAnswer(val) {
  clearTimeout(autoAdvanceTimer);
  answers[currentQ] = val;
  document.getElementById('btnYes').className = 'yn-btn' + (val === 1 ? ' selected-yes' : '');
  document.getElementById('btnNo').className  = 'yn-btn' + (val === 0 ? ' selected-no'  : '');
  autoAdvanceTimer = setTimeout(() => {
    if (currentQ < QUESTIONS.length - 1) { renderQuestion(currentQ + 1); }
    else { submitQuiz(); }
  }, 400);
}

function prevQuestion() {
  clearTimeout(autoAdvanceTimer);
  if (currentQ > 0) renderQuestion(currentQ - 1);
}

// ═══════════════════════════════════════════════════════
//  SCORE CALCULATION
// ═══════════════════════════════════════════════════════
function calcScores() {
  const raw = {};
  TRACK_KEYS.forEach(k => { raw[k] = 0; });
  QUESTIONS.forEach((q, i) => {
    if (answers[i] === 1) {
      Object.entries(q.scores).forEach(([k, w]) => { if (raw[k] !== undefined) raw[k] += w; });
    }
  });
  const norm = {};
  TRACK_KEYS.forEach(k => {
    norm[k] = Math.min(100, Math.round((raw[k] / MAX_SCORES[k]) * 100));
  });
  return norm;
}

// ═══════════════════════════════════════════════════════
//  SUBMIT & API
// ═══════════════════════════════════════════════════════
async function submitQuiz() {
  document.getElementById('quizScreen').style.display    = 'none';
  document.getElementById('loadingScreen').style.display = 'block';

  const scores = calcScores();
  const sorted = [...TRACK_KEYS].sort((a, b) => scores[b] - scores[a]);
  topTrackKey  = sorted[0];
  const avg    = Math.round(TRACK_KEYS.reduce((s, k) => s + scores[k], 0) / TRACK_KEYS.length);

  let commentary = '';
  if (apiKey) { commentary = await callGemini(scores, sorted[0], sorted[1], avg); }

  document.getElementById('loadingScreen').style.display = 'none';
  renderResult(scores, avg, commentary);
}

async function callGemini(scores, top1Key, top2Key, avg) {
  const t1 = TRACKS[top1Key], t2 = TRACKS[top2Key];
  const yesA = QUESTIONS.filter((q,i) => q.section==='A' && answers[i]===1).length;
  const yesB = QUESTIONS.filter((q,i) => q.section==='B' && answers[i]===1).length;
  const yesC = QUESTIONS.filter((q,i) => q.section==='C' && answers[i]===1).length;

  // 상위 3개 트랙만 전송 (전체 9개 불필요)
  const top3 = [...TRACK_KEYS].sort((a,b) => scores[b]-scores[a]).slice(0, 3);
  const scoreLines = top3.map(k => `${TRACKS[k].name}:${scores[k]}점`).join(', ');

  const prompt = `SBS 아카데미 진로 상담 전문가. 적성검사(Yes/No·감각·사고·가치관 간접측정) 결과:

응답: 감각${yesA}/8 사고${yesB}/9 가치${yesC}/8
상위 적합도: ${scoreLines} (평균 ${avg}점)
1순위: ${t1.name}(${scores[top1Key]}점) — ${t1.subtitle}
2순위: ${t2.name}(${scores[top2Key]}점) — ${t2.subtitle}

따뜻하고 격려하는 한국어로 4~5문장 작성:
1. 이 사람의 성향 한 문장 요약
2. 1순위 추천 이유 (응답 패턴 근거) 2문장
3. 2순위 고려 이유 1문장
4. 다음 단계 유도 마무리 1문장
JSON 없이 순수 텍스트만 반환.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 350 }
        }) }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } catch(e) { return ''; }
}

// ═══════════════════════════════════════════════════════
//  RESULT MODE
// ═══════════════════════════════════════════════════════
function getResultMode(scores, avg) {
  const sorted = [...TRACK_KEYS].sort((a,b) => scores[b]-scores[a]);
  const gap    = scores[sorted[0]] - avg;
  if (avg < 20) return 'low';
  if (gap < 12 && avg > 65) return 'allHigh';
  if (gap < 12) return 'neutral';
  return 'normal';
}

// ═══════════════════════════════════════════════════════
//  RESULT RENDERING
// ═══════════════════════════════════════════════════════
function renderResult(scores, avg, commentary) {
  document.getElementById('resultScreen').style.display = 'block';

  // 이전 상태 초기화
  ['doneBanner','resultGrid','personaBlock','rank1Block','rankDivider','rank2Block','fallbackBanner','mentorBox','btnGoGap','rank1Reason'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('resultGrid').classList.remove('has-persona');

  const sorted = [...TRACK_KEYS].sort((a, b) => scores[b] - scores[a]);
  const mode   = getResultMode(scores, avg);

  if (mode === 'normal') {
    const k1 = sorted[0], k2 = sorted[1];
    const t1 = TRACKS[k1], t2 = TRACKS[k2];

    // ── 완료 배너 ──
    document.getElementById('doneBanner').style.display = 'flex';

    // ── 결과 그리드 표시 ──
    const grid       = document.getElementById('resultGrid');
    grid.style.display = 'grid';

    // ── 페르소나 블록 ──
    const personaKey = k1 + '|' + k2;
    const persona    = PERSONAS[personaKey];
    if (persona) {
      grid.classList.add('has-persona');
      document.getElementById('personaBlock').style.display = 'block';
      document.getElementById('personaName').textContent    = persona.name;
      document.getElementById('personaCombo').textContent   = persona.combo;
      document.getElementById('personaTrait').textContent   = persona.trait;
      document.getElementById('personaAi').textContent      = persona.ai;
    }

    // ── 1순위 블록 (게임 클래스 카드) ──
    const r1Block = document.getElementById('rank1Block');
    r1Block.style.display = 'block';
    r1Block.style.setProperty('--tc', t1.color);

    const hd = document.getElementById('rank1Hd');
    hd.style.background = t1.bg;
    hd.innerHTML = `
      <div class="r1-inner">
        <div class="r1-top">
          <span class="r1-rank-badge">1순위 AFFINITY</span>
          <span class="r1-archetype">${t1.archetype}</span>
        </div>
        <div class="r1-mid">
          <div class="r1-icon">${t1.icon}</div>
          <div class="r1-info">
            <div class="r1-name">${t1.name}</div>
            <div class="r1-affinity-row">
              <span class="r1-affinity-label">적성도</span>
              <div class="r1-affinity-track">
                <div class="r1-affinity-fill" id="r1AffinityFill"></div>
              </div>
              <span class="r1-affinity-pct">${scores[k1]}%</span>
            </div>
          </div>
          <div class="r1-score-col">
            <span class="r1-score-num">${scores[k1]}</span>
            <span class="r1-score-sub">/ 100</span>
          </div>
        </div>
        <div class="r1-lore">${t1.lore}</div>
      </div>`;

    // 적성도 바 애니메이션
    setTimeout(() => {
      const fill = document.getElementById('r1AffinityFill');
      if (fill) fill.style.width = scores[k1] + '%';
    }, 100);

    // ── AI 이유 ──
    if (commentary) {
      document.getElementById('rank1ReasonText').textContent = commentary;
      document.getElementById('rank1Reason').style.display  = 'block';
    }

    // ── 직업 아이덴티티 + 작업물 쇼케이스 ──
    document.getElementById('rank1Career').innerHTML = `
      <div class="rank1-jobs">
        <div class="rank1-jobs-title">이런 사람이 돼</div>
        <div class="job-cards">
          ${t1.jobCards.map(j => `
            <div class="job-card">
              <div class="job-card-icon">${j.icon}</div>
              <div class="job-card-title">${j.title}</div>
              <div class="job-card-desc">${j.desc}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="rank1-works">
        ${t1.works.map(w => `
          <div class="work-card" style="background:${w.color}">
            <div class="work-card-inner">
              <span class="work-card-icon">${w.icon}</span>
              <div class="work-card-title">${w.title}</div>
            </div>
          </div>`).join('')}
      </div>`;

    // ── 연봉 스트립 (다크) ──
    document.getElementById('rank1Salary').innerHTML = `
      <span class="salary-ico">💰</span>
      <div class="salary-info">
        <span class="salary-lbl">초봉 가이드</span>
        <span class="salary-val">신입 약 ${t1.salary.min.toLocaleString()}~${t1.salary.max.toLocaleString()}만원</span>
      </div>
      <span class="salary-note-txt">※ 고용노동부·업계 평균 기준</span>`;

    // ── 구분선 ──
    document.getElementById('rankDivider').style.display = 'flex';

    // ── 2순위 블록 (게임 카드 컴팩트) ──
    const r2 = document.getElementById('rank2Block');
    r2.style.display = 'block';
    r2.innerHTML = `
      <div class="rank2-hd" style="background:${t2.bg}">
        <div class="r2-inner">
          <div class="r2-top-row">
            <span class="r2-badge">2순위</span>
            <span class="r2-archetype">${t2.archetype}</span>
          </div>
          <div class="r2-main-row">
            <span class="r2-icon">${t2.icon}</span>
            <span class="r2-name">${t2.name}</span>
            <span class="r2-score">${scores[k2]}</span>
          </div>
          <div class="r2-lore">${t2.lore}</div>
        </div>
      </div>
      <div class="rank2-body">
        <div class="r2-skill-row">
          <span class="r2-skill-label">🎯 직업</span>
          <div class="r2-tags">${t2.jobs.map(j => `<span class="r2-tag">${j}</span>`).join('')}</div>
        </div>
        <div class="r2-skill-row">
          <span class="r2-skill-label">🏛 취업처</span>
          <div class="r2-tags">${t2.employers.map(e => `<span class="r2-tag">${e}</span>`).join('')}</div>
        </div>
        <div class="r2-skill-row">
          <span class="r2-skill-label">💰 연봉</span>
          <span class="r2-salary-val">신입 약 ${t2.salary.min.toLocaleString()}~${t2.salary.max.toLocaleString()}만원</span>
        </div>
      </div>`;

    // ── GAP 버튼 ──
    const gap = document.getElementById('btnGoGap');
    gap.style.display = '';
    gap.textContent   = `📊 [${t1.name}] GAP 분석 시작하기`;
    topTrackKey = k1;

  } else {
    // ── 비정상 모드 ──
    const FALLBACK = {
      low:     { bg:'linear-gradient(135deg,#607D8B,#455A64)', icon:'🔍', name:'아직 방향 탐색 중', sub:'다양한 분야를 더 경험해보세요' },
      allHigh: { bg:'linear-gradient(135deg,#FF8B00,#E07000)', icon:'⭐', name:'다방면 관심형',      sub:'여러 분야에 골고루 관심이 높습니다' },
      neutral: { bg:'linear-gradient(135deg,#5E35B1,#4527A0)', icon:'🧭', name:'방향 탐색 필요',     sub:'담당 멘토와 상담을 권장드립니다' },
    }[mode];
    const fb = document.getElementById('fallbackBanner');
    fb.style.display    = 'block';
    fb.className        = 'result-banner-fallback';
    fb.style.background = FALLBACK.bg;
    fb.innerHTML        = `<div class="rfb-icon">${FALLBACK.icon}</div><div class="rfb-name">${FALLBACK.name}</div><div class="rfb-sub">${FALLBACK.sub}</div>`;

    const MENTOR = {
      low:     { title:'현재 두드러지는 분야가 없습니다', msg:'아직 탐색 중인 단계일 수 있습니다. 담당 선생님과 1:1 상담을 통해 방향을 함께 찾아보세요.', bg:'#ECEFF1', border:'#607D8B' },
      allHigh: { title:'멘토와의 상담을 권장드립니다',    msg:'다양한 분야에 높은 관심을 보이고 있습니다. 담당 멘토와 1:1 상담으로 최적 과정을 함께 결정해 보세요.', bg:'#FFF8E1', border:'#FF8B00' },
      neutral: { title:'멘토와의 상담을 권장드립니다',    msg:'뚜렷한 선호가 아직 나타나지 않았습니다. 담당 선생님과의 상담을 통해 구체적인 방향을 잡아보시길 권장드립니다.', bg:'#E3F2FD', border:'#1565C0' },
    }[mode];
    const mb = document.getElementById('mentorBox');
    mb.style.background  = MENTOR.bg;
    mb.style.borderColor = MENTOR.border;
    mb.style.display     = 'block';
    document.getElementById('mentorTitle').textContent = MENTOR.title;
    mb.querySelector('.mentor-msg').textContent = MENTOR.msg;
  }
}

// ═══════════════════════════════════════════════════════
//  ACTIONS
// ═══════════════════════════════════════════════════════
function goToGap() { location.href = 'gap-analysis.html?track=' + topTrackKey; }

function retryQuiz() {
  answers  = new Array(QUESTIONS.length).fill(-1);
  currentQ = 0;
  clearTimeout(autoAdvanceTimer);
  document.getElementById('resultScreen').style.display = 'none';
  document.getElementById('introScreen').style.display  = 'block';
  window.scrollTo(0, 0);
}
