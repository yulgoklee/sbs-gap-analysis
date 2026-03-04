// ═══════════════════════════════════════════════════════
//  TEST: 01 입력 Validation
//  필수 입력값 누락 시 alert이 뜨고 Step 이동이 차단되는지 검증
//
//  ※ window.alert()를 JS 인터셉트로 캡처
//     (Playwright dialog 이벤트 방식의 타이밍 이슈 우회)
// ═══════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');

const step1NextBtn = '#sec1 .btn-analyze';
const step2NextBtn = '#sec2 .btn-analyze';

// alert 인터셉트 스크립트를 page.goto() 전에 주입
async function injectAlertInterceptor(page) {
  await page.addInitScript(() => {
    window._alerts = [];
    window.alert = (msg) => { window._alerts.push(String(msg)); };
  });
}

// alert 메시지 수집
async function getAlerts(page) {
  return page.evaluate(() => window._alerts || []);
}

async function dismissApiModal(page) {
  await page.fill('#apiKeyInput', 'TEST_KEY_FOR_UI_ONLY');
  await page.click('.btn-modal');
  await expect(page.locator('#apiModal')).toBeHidden();
}

test.describe('Step 1 → Step 2 Validation', () => {

  test.beforeEach(async ({ page }) => {
    await injectAlertInterceptor(page);
    await page.goto('/');
    await dismissApiModal(page);
  });

  test('이름 미입력 시 Step 2로 이동 불가', async ({ page }) => {
    await page.fill('#age', '25');
    await page.selectOption('#background', 'non_major');
    await page.selectOption('#currentStatus', 'student');

    await page.click(step1NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toMatch(/이름|나이|배경|상태/);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
  });

  test('나이 미입력 시 Step 2로 이동 불가', async ({ page }) => {
    await page.fill('#name', '홍길동');
    await page.selectOption('#background', 'non_major');
    await page.selectOption('#currentStatus', 'student');
    // age 비워둠

    await page.click(step1NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toMatch(/이름|나이|배경|상태/);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
  });

  test('배경 미선택 시 Step 2로 이동 불가', async ({ page }) => {
    await page.fill('#name', '홍길동');
    await page.fill('#age', '25');
    await page.selectOption('#currentStatus', 'student');
    // background 선택 안 함

    await page.click(step1NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toMatch(/이름|나이|배경|상태/);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
  });

  test('현재상태 미선택 시 Step 2로 이동 불가', async ({ page }) => {
    await page.fill('#name', '홍길동');
    await page.fill('#age', '25');
    await page.selectOption('#background', 'non_major');
    // currentStatus 선택 안 함

    await page.click(step1NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toMatch(/이름|나이|배경|상태/);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
  });

  test('모든 필수값 입력 시 Step 2로 정상 이동 (alert 없음)', async ({ page }) => {
    await page.fill('#name', '홍길동');
    await page.fill('#age', '25');
    await page.selectOption('#background', 'non_major');
    await page.selectOption('#currentStatus', 'student');

    await page.click(step1NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBe(0);
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });
});

test.describe('Step 2 → Step 3 Validation', () => {

  test.beforeEach(async ({ page }) => {
    await injectAlertInterceptor(page);
    await page.goto('/');
    await dismissApiModal(page);

    // Step 1 통과
    await page.fill('#name', '홍길동');
    await page.fill('#age', '25');
    await page.selectOption('#background', 'non_major');
    await page.selectOption('#currentStatus', 'student');
    await page.click(step1NextBtn);
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('목표 유형 미선택 시 Step 3로 이동 불가', async ({ page }) => {
    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toContain('목표');
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('트랙 미선택 시 Step 3로 이동 불가', async ({ page }) => {
    await page.click('#goal_employment');
    // track 선택 안 함

    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toContain('트랙');
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('취업 목표 - 직업 구체성 미선택 시 이동 불가', async ({ page }) => {
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    // jobSpecificity 선택 안 함

    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toContain('직업');
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('자격증 목표 - 목표 자격증 미입력 시 이동 불가', async ({ page }) => {
    await page.click('#goal_certification');
    await page.click('#track_certification');
    await expect(page.locator('#certField')).toBeVisible();
    // targetCert 입력 안 함

    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toContain('자격증');
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('취업 목표 완전 입력 시 Step 3 정상 이동', async ({ page }) => {
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    await page.click('#radioCard_general');

    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBe(0);
    await expect(page.locator('#sec3')).toHaveClass(/active/);
  });

  test('자격증 목표 완전 입력 시 Step 3 정상 이동', async ({ page }) => {
    await page.click('#goal_certification');
    await page.click('#track_certification');
    await expect(page.locator('#certField')).toBeVisible();
    await page.fill('#targetCert', 'GTQ 1급');

    await page.click(step2NextBtn);

    const alerts = await getAlerts(page);
    expect(alerts.length).toBe(0);
    await expect(page.locator('#sec3')).toHaveClass(/active/);
  });
});
