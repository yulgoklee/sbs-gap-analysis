// ═══════════════════════════════════════════════════════
//  TEST: 03 트랙 선택 및 툴 레벨
//  9개 트랙 각각의 스킬 체크 항목과 UI 동작 검증
// ═══════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');

// constants.js와 동기화 - 트랙별 기대 도구 목록 (부분 매칭)
const EXPECTED_TOOLS = {
  motion:         ['포토샵', '일러스트', '프리미어프로', '애프터이펙트', '시네마4D'],
  interior:       ['포토샵', '일러스트', 'AutoCAD', '스케치업', '3ds Max'],
  visual_editing: ['포토샵', '일러스트', '인디자인'],
  web:            ['포토샵', '일러스트', 'HTML/CSS', 'JavaScript', 'Figma'],
  cg_maya:        ['포토샵', '일러스트', '마야', '애프터이펙트', 'ZBrush'],
  it_programming: ['C언어', 'Java', 'Python'],
  ai:             ['ChatGPT', 'Midjourney', 'AI 영상'],
  artwork:        ['포토샵', '일러스트', '디지털드로잉'],
  certification:  ['포토샵', '일러스트', '엑셀', 'AutoCAD']
};

const BTNS = {
  step1Next: '#sec1 .btn-analyze',
  step2Next: '#sec2 .btn-analyze',
};

async function dismissApiModal(page) {
  await page.fill('#apiKeyInput', 'TEST_KEY_FOR_UI_ONLY');
  await page.click('.btn-modal');
  await expect(page.locator('#apiModal')).toBeHidden();
}

async function fillStep1(page) {
  await page.fill('#name', '테스트');
  await page.fill('#age', '25');
  await page.selectOption('#background', 'non_major');
  await page.selectOption('#currentStatus', 'student');
  await page.click(BTNS.step1Next);
  await expect(page.locator('#sec2')).toHaveClass(/active/);
}

test.describe('목표 유형 선택 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await fillStep1(page);
  });

  test('취업 선택 시 goal_employment 버튼 활성화', async ({ page }) => {
    await page.click('#goal_employment');
    await expect(page.locator('#goal_employment')).toHaveClass(/selected/);
    await expect(page.locator('#goal_certification')).not.toHaveClass(/selected/);
  });

  test('자격증 선택 시 goal_certification 버튼 활성화', async ({ page }) => {
    await page.click('#goal_certification');
    await expect(page.locator('#goal_certification')).toHaveClass(/selected/);
    await expect(page.locator('#goal_employment')).not.toHaveClass(/selected/);
  });

  test('취업 선택 시 jobField 표시, certField 숨김', async ({ page }) => {
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    await expect(page.locator('#certField')).toBeHidden();
  });

  test('자격증 선택 시 certField 표시, jobField 숨김', async ({ page }) => {
    await page.click('#goal_certification');
    await expect(page.locator('#certField')).toBeVisible();
    await expect(page.locator('#jobField')).toBeHidden();
  });

  test('특정 직업 라디오 선택 시 직업 입력란 표시', async ({ page }) => {
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    await page.click('#radioCard_specific');
    await expect(page.locator('#specificJobInput')).toBeVisible();
  });

  test('해당 직군 라디오 선택 시 직업 입력란 숨김', async ({ page }) => {
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    await page.click('#radioCard_general');
    await expect(page.locator('#specificJobInput')).toBeHidden();
  });
});

test.describe('트랙별 스킬 체크 항목', () => {
  for (const [track, tools] of Object.entries(EXPECTED_TOOLS)) {
    test(`[${track}] 트랙 - 스킬 체크 항목 확인`, async ({ page }) => {
      await page.goto('/');
      await dismissApiModal(page);
      await fillStep1(page);

      if (track === 'certification') {
        await page.click('#goal_certification');
        await page.click(`#track_${track}`);
        await expect(page.locator('#certField')).toBeVisible();
        await page.fill('#targetCert', 'GTQ 1급');
      } else {
        await page.click('#goal_employment');
        await page.click(`#track_${track}`);
        await expect(page.locator('#jobField')).toBeVisible();
        await page.click('#radioCard_general');
      }

      await page.click(BTNS.step2Next);
      await expect(page.locator('#sec3')).toHaveClass(/active/);

      for (const tool of tools) {
        await expect(page.locator('#skillCheckArea')).toContainText(tool);
      }
    });
  }
});

test.describe('툴 레벨 버튼 선택', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await dismissApiModal(page);
    await fillStep1(page);
    await page.click('#goal_employment');
    await page.click('#track_motion');
    await expect(page.locator('#jobField')).toBeVisible();
    await page.click('#radioCard_general');
    await page.click(BTNS.step2Next);
    await expect(page.locator('#sec3')).toHaveClass(/active/);
  });

  test('툴 레벨 버튼 클릭 시 선택 상태 표시', async ({ page }) => {
    const firstToolBtns = page.locator('.skill-row').first().locator('.level-btn');
    await firstToolBtns.nth(1).click(); // '독학'
    await expect(firstToolBtns.nth(1)).toHaveClass(/selected/);
  });

  test('다른 레벨 클릭 시 이전 선택 해제', async ({ page }) => {
    const firstToolBtns = page.locator('.skill-row').first().locator('.level-btn');
    await firstToolBtns.nth(1).click(); // '독학'
    await firstToolBtns.nth(2).click(); // '학원수강'
    await expect(firstToolBtns.nth(1)).not.toHaveClass(/selected/);
    await expect(firstToolBtns.nth(2)).toHaveClass(/selected/);
  });

  test('레벨 버튼 수가 5개(없음~실무경험)인지 확인', async ({ page }) => {
    const firstToolBtns = page.locator('.skill-row').first().locator('.level-btn');
    await expect(firstToolBtns).toHaveCount(5);
  });
});
