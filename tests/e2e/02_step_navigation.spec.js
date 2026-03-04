// ═══════════════════════════════════════════════════════
//  TEST: 02 Step 이동 및 UI 상태
//  Step 인디케이터, 이전/다음 버튼, 섹션 표시 여부 검증
// ═══════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');

// 섹션별 고유 버튼 선택자
const BTNS = {
  step1Next: '#sec1 .btn-analyze',
  step2Next: '#sec2 .btn-analyze',
  step2Prev: '#sec2 .btn-reset',
  step3Prev: '#sec3 .btn-reset',
};

async function dismissApiModal(page) {
  await page.fill('#apiKeyInput', 'TEST_KEY_FOR_UI_ONLY');
  await page.click('.btn-modal');
  await expect(page.locator('#apiModal')).toBeHidden();
}

// Step 1 → Step 2 이동 헬퍼
async function goToStep2(page) {
  await page.fill('#name', '테스트');
  await page.fill('#age', '25');
  await page.selectOption('#background', 'non_major');
  await page.selectOption('#currentStatus', 'student');
  await page.click(BTNS.step1Next);
  await expect(page.locator('#sec2')).toHaveClass(/active/);
}

// Step 2 → Step 3 이동 헬퍼 (취업/모션)
async function goToStep3(page) {
  await goToStep2(page);
  await page.click('#goal_employment');
  await page.click('#track_motion');
  await expect(page.locator('#jobField')).toBeVisible();
  await page.click('#radioCard_general');
  await page.click(BTNS.step2Next);
  await expect(page.locator('#sec3')).toHaveClass(/active/);
}

test.describe('초기 화면', () => {
  test('페이지 타이틀 확인', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SBS 아카데미/);
  });

  test('API 키 모달이 처음에 표시됨', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#apiModal')).toBeVisible();
  });

  test('API 키 입력 후 모달 닫힘', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await expect(page.locator('#apiModal')).toBeHidden();
  });

  test('초기에 Step 1 섹션만 표시', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
    await expect(page.locator('#sec2')).not.toHaveClass(/active/);
    await expect(page.locator('#sec3')).not.toHaveClass(/active/);
  });
});

test.describe('Step 인디케이터', () => {
  test('Step 1에서 첫 번째 인디케이터 활성화', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await expect(page.locator('#step1')).toHaveClass(/active/);
    await expect(page.locator('#step2')).not.toHaveClass(/active/);
  });

  test('Step 2로 이동 시 인디케이터 업데이트', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep2(page);
    await expect(page.locator('#step2')).toHaveClass(/active/);
  });

  test('Step 3로 이동 시 인디케이터 업데이트', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep3(page);
    await expect(page.locator('#step3')).toHaveClass(/active/);
  });
});

test.describe('이전 버튼 (뒤로 가기)', () => {
  test('Step 2에서 이전 버튼 → Step 1로 이동', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep2(page);
    await page.click(BTNS.step2Prev);
    await expect(page.locator('#sec1')).toHaveClass(/active/);
  });

  test('Step 3에서 이전 버튼 → Step 2로 이동', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep3(page);
    await page.click(BTNS.step3Prev);
    await expect(page.locator('#sec2')).toHaveClass(/active/);
  });

  test('Step 1로 돌아와도 입력값 유지', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep2(page);
    await page.click(BTNS.step2Prev);
    await expect(page.locator('#name')).toHaveValue('테스트');
  });
});

test.describe('Step 3 스킬 체크 영역', () => {
  test('트랙 선택 후 Step 3에 스킬 체크 항목 표시', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep3(page);
    await expect(page.locator('#skillCheckArea')).not.toBeEmpty();
    await expect(page.locator('#skillCheckArea')).toContainText('포토샵');
    await expect(page.locator('#skillCheckArea')).toContainText('프리미어프로');
    await expect(page.locator('#skillCheckArea')).toContainText('애프터이펙트');
  });

  test('스킬 체크 영역에 AI 도구 섹션 포함', async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await goToStep3(page);
    await expect(page.locator('#skillCheckArea')).toContainText('AI');
  });
});
