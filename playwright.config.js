// ═══════════════════════════════════════════════════════
//  PLAYWRIGHT CONFIG
//  로컬 정적 서버(3000포트)에서 테스트 실행
// ═══════════════════════════════════════════════════════
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,       // API 목 테스트 순서 보장
  retries: 1,                 // 불안정한 환경 대비 1회 재시도
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/report', open: 'never' }]
  ],

  // 로컬 정적 서버 자동 실행
  webServer: {
    command: 'npx http-server . -p 3000 --silent',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 15_000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    locale: 'ko-KR',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
