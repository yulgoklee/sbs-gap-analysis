// ═══════════════════════════════════════════════════════
//  TEST: 04 API 목업 + 결과 렌더링
//  실제 Gemini API 없이 목업 응답으로 renderResult() 전체 검증
// ═══════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { MOCK_API_RESPONSE } = require('../helpers/mock-response');

const GEMINI_URL_PATTERN = '**/generativelanguage.googleapis.com/**';
const BTNS = {
  step1Next: '#sec1 .btn-analyze',
  step2Next: '#sec2 .btn-analyze',
  step3Run:  '#sec3 .btn-analyze',
};

async function dismissApiModal(page) {
  await page.fill('#apiKeyInput', 'TEST_KEY_FOR_MOCK');
  await page.click('.btn-modal');
  await expect(page.locator('#apiModal')).toBeHidden();
}

// Gemini API 요청을 목업 응답으로 가로채기
async function mockGeminiApi(page) {
  await page.route(GEMINI_URL_PATTERN, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_API_RESPONSE)
    });
  });
}

// Step 1 ~ 3 완전 입력 후 분석 버튼 클릭
async function runFullFlow(page, { goal = 'employment', track = 'motion' } = {}) {
  // Step 1
  await page.fill('#name', '테스트');
  await page.fill('#age', '25');
  await page.selectOption('#background', 'non_major');
  await page.selectOption('#currentStatus', 'student');
  await page.fill('#availableMonths', '12');
  await page.click(BTNS.step1Next);
  await expect(page.locator('#sec2')).toHaveClass(/active/);

  // Step 2
  if (goal === 'employment') {
    await page.click('#goal_employment');
    await page.click(`#track_${track}`);
    await expect(page.locator('#jobField')).toBeVisible();
    await page.click('#radioCard_general');
  } else {
    await page.click('#goal_certification');
    await page.click(`#track_${track}`);
    await expect(page.locator('#certField')).toBeVisible();
    await page.fill('#targetCert', 'GTQ 1급');
  }
  await page.click(BTNS.step2Next);
  await expect(page.locator('#sec3')).toHaveClass(/active/);

  // Step 3: 스킬 레벨 기본값(없음) 그대로, 분석 시작
  await page.click(BTNS.step3Run);
}

test.describe('API 목업 - 기본 결과 렌더링', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await mockGeminiApi(page);
    await dismissApiModal(page);
  });

  test('결과 섹션 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#result')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#loading')).toBeHidden();
  });

  test('고객 이름이 결과 타이틀에 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#resultTitle')).toContainText('테스트', { timeout: 15_000 });
  });

  test('현재 수준 진단 텍스트 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#currentLevelSummary')).not.toBeEmpty({ timeout: 15_000 });
  });

  test('레이더 차트 SVG 생성', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#radarChartContainer svg')).toBeVisible({ timeout: 15_000 });
  });

  test('GAP 설명 텍스트 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#gapDescription')).not.toBeEmpty({ timeout: 15_000 });
  });

  test('강점 태그 표시 (2개)', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#strongPoints .tag-strong')).toHaveCount(2, { timeout: 15_000 });
  });

  test('약점 태그 표시 (3개)', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#weakPoints .tag-weak')).toHaveCount(3, { timeout: 15_000 });
  });

  test('추천 수업 로드맵 항목 표시 (5개)', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#courseTimeline .course-item')).toHaveCount(5, { timeout: 15_000 });
  });

  test('예상 기간 min/max 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#durationMin')).toHaveText('6', { timeout: 15_000 });
    await expect(page.locator('#durationMax')).toHaveText('8');
  });

  test('월별 플래너 섹션 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#monthlyPlannerSection')).toBeVisible({ timeout: 15_000 });
  });

  test('학원 커버 가능 항목 표시 (5개)', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#coverableList li')).toHaveCount(5, { timeout: 15_000 });
  });

  test('학원 불가 항목 표시 (2개)', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#notCoverableList li')).toHaveCount(2, { timeout: 15_000 });
  });

  test('추천 문구 표시', async ({ page }) => {
    await runFullFlow(page);
    await expect(page.locator('#recommendationBox')).not.toBeEmpty({ timeout: 15_000 });
  });
});

test.describe('API 목업 - 취업/자격증 목표별 분기', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await mockGeminiApi(page);
    await dismissApiModal(page);
  });

  test('취업 목표 - 직군 요구 스펙 섹션 표시', async ({ page }) => {
    await runFullFlow(page, { goal: 'employment', track: 'motion' });
    await expect(page.locator('#jobMarketSection')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#jobSpecGrid')).toContainText('필수 스킬');
    await expect(page.locator('#jobSpecGrid')).toContainText('신입 평균 연봉');
  });

  test('자격증 목표 - 직군 요구 스펙 섹션 숨김', async ({ page }) => {
    await runFullFlow(page, { goal: 'certification', track: 'certification' });
    await expect(page.locator('#result')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#jobMarketSection')).toBeHidden();
  });

  test('레이더 차트 범례 - 취업 목표 레이블', async ({ page }) => {
    await runFullFlow(page, { goal: 'employment', track: 'motion' });
    await expect(page.locator('#radarLegendTarget')).toHaveText('취업 목표 수준', { timeout: 15_000 });
  });

  test('레이더 차트 범례 - 자격증 목표 레이블', async ({ page }) => {
    await runFullFlow(page, { goal: 'certification', track: 'certification' });
    await expect(page.locator('#radarLegendTarget')).toHaveText('자격증 목표 수준', { timeout: 15_000 });
  });
});

test.describe('API 목업 - 에러 처리', () => {

  test('API 400 에러 시 로딩 숨기고 결과 미표시', async ({ page }) => {
    await page.goto('/');
    await page.route(GEMINI_URL_PATTERN, route => {
      route.fulfill({ status: 400, body: JSON.stringify({ error: { message: 'Bad Request' } }) });
    });
    await dismissApiModal(page);

    // 에러 alert 처리 (dismiss)
    page.on('dialog', d => d.dismiss());

    await runFullFlow(page);
    await expect(page.locator('#loading')).toBeHidden({ timeout: 15_000 });
    await expect(page.locator('#result')).toBeHidden();
  });

  test('API 429 에러 시 로딩 숨기고 결과 미표시', async ({ page }) => {
    await page.goto('/');
    await page.route(GEMINI_URL_PATTERN, route => {
      route.fulfill({ status: 429, body: JSON.stringify({ error: { message: 'Too Many Requests' } }) });
    });
    await dismissApiModal(page);

    page.on('dialog', d => d.dismiss());

    await runFullFlow(page);
    await expect(page.locator('#loading')).toBeHidden({ timeout: 15_000 });
    await expect(page.locator('#result')).toBeHidden();
  });
});

test.describe('API 목업 - 9개 트랙 연속 실행', () => {
  const TRACKS = [
    { track: 'motion',         goal: 'employment' },
    { track: 'interior',       goal: 'employment' },
    { track: 'visual_editing', goal: 'employment' },
    { track: 'web',            goal: 'employment' },
    { track: 'cg_maya',        goal: 'employment' },
    { track: 'it_programming', goal: 'employment' },
    { track: 'ai',             goal: 'employment' },
    { track: 'artwork',        goal: 'employment' },
    { track: 'certification',  goal: 'certification' },
  ];

  for (const { track, goal } of TRACKS) {
    test(`[${track}] 트랙 - 결과 정상 렌더링`, async ({ page }) => {
      await page.goto('/');
      await mockGeminiApi(page);
      await dismissApiModal(page);

      await runFullFlow(page, { goal, track });

      await expect(page.locator('#result')).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('#radarChartContainer svg')).toBeVisible();
    });
  }
});
