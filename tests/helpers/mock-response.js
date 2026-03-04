// ═══════════════════════════════════════════════════════
//  MOCK GEMINI API RESPONSE
//  실제 API 호출 없이 renderResult() 테스트용 목업 데이터
// ═══════════════════════════════════════════════════════

/**
 * Gemini API가 반환하는 JSON 구조를 흉내 낸 목업 응답
 * renderResult()에서 사용하는 모든 필드를 포함
 */
const MOCK_GAP_RESULT = {
  customer_summary: {
    name: '테스트',
    goal: '취업',
    background: '비전공자'
  },
  current_level_summary:
    '포토샵·일러스트 독학 경험이 있으나 실무 수준에 미치지 못합니다. ' +
    '프리미어프로·애프터이펙트는 사용 경험이 없어 핵심 스킬 공백이 큽니다. ' +
    '모션/영상 취업 목표 대비 전체적인 수준이 낮은 편입니다.',
  radar_current: [1, 2, 1, 0, 0, 1],
  gap_analysis: {
    gap_description:
      '취업 목표 수준 대비 편집(프리미어)·모션그래픽(AE) 역량이 가장 크게 부족합니다.',
    strong_points: ['기초 포토샵 경험 보유', '학습 의지'],
    weak_points: ['프리미어프로 경험 없음', '애프터이펙트 경험 없음', '포트폴리오 없음']
  },
  job_market: {
    required_skills: ['프리미어프로', '애프터이펙트'],
    preferred_skills: ['시네마4D', 'AI 편집툴'],
    ai_requirement: 'AI 영상편집툴 우대 (Runway, Pika 등)',
    avg_salary: '2,200~2,800만원',
    market_trend: '숏폼 편집 수요 폭증, AE+프리미어 동시 필수',
    portfolio_platform: 'YouTube, Instagram, 개인 사이트'
  },
  recommended_courses: [
    { order: 1, course_name: '포토샵 기초',    reason: '기본기 정비',         duration_months: 1 },
    { order: 2, course_name: '일러스트 기초',   reason: '벡터 그래픽 습득',    duration_months: 1 },
    { order: 3, course_name: '프리미어프로',    reason: '영상편집 핵심 스킬',  duration_months: 1 },
    { order: 4, course_name: '애프터이펙트 1', reason: '모션그래픽 입문',     duration_months: 1 },
    { order: 5, course_name: '모션 포트폴리오', reason: '취업 포트폴리오 완성', duration_months: 2 }
  ],
  total_duration: { min_months: 6, max_months: 8 },
  monthly_planner: [
    { month: 1, courses: ['포토샵 기초'],      milestone: '포토샵 기본기 완성' },
    { month: 2, courses: ['일러스트 기초'],    milestone: '일러스트 기본기 완성' },
    { month: 3, courses: ['프리미어프로'],     milestone: '영상편집 가능 수준' },
    { month: 4, courses: ['애프터이펙트 1'],   milestone: '모션그래픽 입문 완성' },
    { month: 5, courses: ['모션 포트폴리오 1'], milestone: '포트폴리오 초안 완성' },
    { month: 6, courses: ['모션 포트폴리오 2'], milestone: '취업용 포트폴리오 완성' }
  ],
  academy_coverage: {
    coverable: [
      '포토샵 기초', '일러스트 기초', '프리미어프로',
      '애프터이펙트', '모션 포트폴리오'
    ],
    not_coverable: ['유튜브 채널 운영', '개인 촬영 장비 구입'],
    recommendation:
      '6~8개월 모션/영상 풀코스 수강을 권장합니다. ' +
      '포트폴리오 완성 후 취업 연계까지 지원 가능합니다.'
  }
};

/**
 * Gemini API HTTP 응답 형식으로 감싼 목업
 * page.route()에서 body로 사용
 */
const MOCK_API_RESPONSE = {
  candidates: [{
    content: {
      parts: [{
        text: '```json\n' + JSON.stringify(MOCK_GAP_RESULT, null, 2) + '\n```'
      }]
    }
  }]
};

module.exports = { MOCK_GAP_RESULT, MOCK_API_RESPONSE };
