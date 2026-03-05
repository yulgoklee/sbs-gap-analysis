// ═══════════════════════════════════════════════════════
//  DATA CONSTANTS
//  ※ 유지보수: 데이터만 이 파일에서 관리합니다.
//    레벨·툴·레이더 설정 변경 시 이 파일만 수정하세요.
// ═══════════════════════════════════════════════════════

// ── 툴 수준 레이블 (버튼 표시용) ──
const LEVEL_LABELS = ['없음', '독학', '학원수강', '자격증', '실무경험'];

// ── 툴 수준 설명 (스킬 체크 안내용) ──
const LEVEL_DESCS = [
  '사용해본 적 없음',
  '유튜브·책으로 혼자 배운 경험',
  '학원·학교에서 정식으로 배운 경험',
  '관련 자격증을 취득한 상태',
  '실제 업무·프로젝트에서 사용한 경험'
];

// ── AI 도구 활용 수준 ──
const AI_TOOL_LEVELS = ['없음', 'ChatGPT 정도', '이미지 AI(MJ 등)', '영상 AI 활용', '실무 AI 활용'];
const AI_TOOL_DESCS = [
  'AI 도구를 사용해본 적 없음',
  'ChatGPT 등 텍스트 AI 정도 사용',
  'Midjourney 등 이미지 생성 AI 활용 경험',
  'AI 영상 편집·생성 툴 활용 경험',
  '실무에서 AI 도구를 적극 활용 중'
];

// ── 트랙별 스킬 체크 항목 ──
const TRACK_TOOLS = {
  motion:          ['포토샵', '일러스트', '프리미어프로', '애프터이펙트', '시네마4D'],
  interior:        ['포토샵', '일러스트', 'AutoCAD(캐드)', '스케치업', '3ds Max'],
  visual_editing:  ['포토샵', '일러스트', '인디자인'],
  web:             ['포토샵', '일러스트', 'HTML/CSS', 'JavaScript', 'Figma'],
  cg_maya:         ['포토샵', '일러스트', '마야', '애프터이펙트', 'ZBrush'],
  it_programming:  ['C언어', 'Java', 'Python'],
  ai:              ['ChatGPT', 'Midjourney', 'AI 영상 툴'],
  artwork:         ['포토샵', '일러스트', '디지털드로잉 툴'],
  certification:   ['포토샵', '일러스트', '엑셀', 'AutoCAD']
};

// ── 트랙별 커리큘럼 텍스트 (프롬프트용 - 선택 트랙만 삽입) ──
// ※ 유지보수: 커리큘럼 변경 시 해당 트랙 항목만 수정하세요.
const TRACK_CURRICULUM_TEXT = {
  motion:
    '공통기초: 포토샵기초(1), 포토웍스(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    '모션/영상: 프리미어프로(1), 애프터이펙트1~3(각1), 시네마4D 1~5(각1), 모션포트폴리오(최소2), AI크리에이터(1·선택)',
  interior:
    '공통기초: 포토샵기초(1), 포토웍스(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    '건축/인테리어: 스케치업1~2(각1), 캐드1~2(각1), 3ds Max1~2(각1), BIM1~2(각1), 인테리어포트폴리오(최소2), AI크리에이터(1·선택)\n' +
    '실내건축자격증: 기능사(3~4개월), 산업기사(4~5개월), 기사(5~6개월)',
  visual_editing:
    '공통기초: 포토샵기초(1), 포토웍스(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    '시각/편집: 인포그래픽1~2(각1), 브랜딩디자인1~2(각1), 패키지디자인1~2(각1), 그래픽아트웍(1), 인디자인1~2(각1), 시각편집포트폴리오(최소2), AI크리에이터(1·선택)',
  web:
    '공통기초: 포토샵기초(1), 포토웍스(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    '웹디자인: 인포그래픽(2), 브랜딩디자인(2), HTML(1), CSS(1), JS(1), jQuery(1), UI/UX1~2(각1), 웹포트폴리오(최소2), AI크리에이터-웹(1·선택)',
  cg_maya:
    '공통기초: 포토샵기초(1), 포토웍스(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    'CG/마야: 마야1~9(각1), 애프터이펙트(3), Unreal(1), CG포트폴리오(최소2), AI크리에이터(1·선택)',
  it_programming:
    'IT/프로그래밍: C언어(2), Java/Android(2), Python(2), AICE자격증(1·파이썬이수후), 백엔드JSP/DB(6)',
  ai:
    'AI: AI자격증(1), ChatGPT+Midjourney기초(1), AI유튜브(1), AI영상편집(1)',
  artwork:
    '공통기초: 포토샵기초(1), 일러스트기초(1), 디테일일러스트(1)\n' +
    '아트웍: 디지털드로잉(개인맞춤), AI아트웍(1), 아트웍포트폴리오(최소2)',
  certification:
    '자격증단기: GTQ2급(1), GTQ1급(1), GTQ-i(1), 컴그기능사(2), 웹디자인개발기사(2), MOS(1), 컴활2급(1), 컴활1급(1), 전산회계1급(2), 전산세무2급(2), CAT2급(1), 전산응용건축제도기능사(3~4), ACP(1)'
};

// ── 트랙별 취업시장 정보 (2025~2026) ──
// ※ 유지보수: 취업 트렌드 변경 시 해당 트랙 항목만 수정하세요.
const TRACK_JOB_MARKET_TEXT = {
  motion:         '숏폼 편집 수요 폭증·AE+프리미어 동시 필수·AI편집툴 우대·신입 2,200~2,800만원',
  interior:       'CAD도면+3D렌더링 동시 필수·자격증 우대·신입 2,200~2,700만원',
  visual_editing: '브랜딩+SNS콘텐츠 디자이너 우대·Behance포폴 필수·신입 2,100~2,700만원',
  web:            'Figma+코딩 UI/UX 수요 높음·반응형 구현 필수·신입 2,400~3,000만원',
  cg_maya:        '게임사(넥슨·넷마블)+VFX 상시채용·ArtStation포폴 필수·신입 2,300~3,000만원',
  it_programming: 'GitHub+알고리즘 필수·Python/Java백엔드 수요·신입 2,800~3,500만원',
  ai:             'AI활용 전직군 필수화·AI콘텐츠기획 신규수요·신입 2,800~4,000만원',
  artwork:        '웹툰·게임·광고 일러스트 수요지속·ArtStation+SNS포폴 필수·신입 2,000~2,700만원',
  certification:  '자격증 보유시 취업·이직 우대·신입 2,000~2,500만원'
};

// ── 트랙별 연관 자격증 정보 ──
// ※ 유지보수: 자격증 정보 변경 시 해당 트랙 항목만 수정하세요.
const TRACK_CERT_TEXT = {
  motion:         'GTQ1급(포토샵중급·연5~6회·합격률30%), 컴퓨터그래픽스기능사(연4회)',
  interior:       '전산응용건축제도기능사(AutoCAD·연4회·3~4개월), 실내건축산업기사(관련학과졸or실무2년), 실내건축기사(4년제졸or실무4년)',
  visual_editing: 'GTQ1급(연5~6회·합격률30%), GTQ-i(연5~6회), 컴퓨터그래픽스기능사(연4회)',
  web:            '웹디자인개발기사(HTML/CSS/JS·연3회), GTQ1급(연5~6회)',
  cg_maya:        'GTQ1급, 컴퓨터그래픽스기능사(연4회)',
  it_programming: 'AICE(Python수료후·AI국내최초공인), 정보처리기능사',
  ai:             'AICE(Python수료후), AI-POT2급(단기준비가능)',
  artwork:        'GTQ1급, GTQ-i, 컴퓨터그래픽스기능사',
  certification:  'GTQ1급(합격률30%), GTQ-i, 컴그기능사(연4회), 웹디자인개발기사(연3회), 컴활1급(합격률20%), 컴활2급, 전산회계1급(연6회), 전산세무2급, MOS, 전산응용건축제도기능사(3~4개월)'
};

// ── 트랙별 레이더 차트 설정 ──
const TRACK_RADAR_CONFIG = {
  motion: {
    axes: ['영상 기획력', '편집(프리미어)', '모션그래픽(AE)', '3D(시네마4D)', '포트폴리오', '트렌드 이해'],
    employment_target: [3, 5, 4, 3, 5, 3],
    cert_target:       [2, 4, 4, 2, 3, 2]
  },
  interior: {
    axes: ['공간 기획력', '2D도면(CAD)', '3D모델링', '렌더링(Max)', '포트폴리오', '자격증 보유'],
    employment_target: [3, 5, 5, 4, 4, 3],
    cert_target:       [2, 5, 2, 2, 2, 5]
  },
  visual_editing: {
    axes: ['브랜딩 기획력', '포토샵', '일러스트', '인디자인', '포트폴리오', '편집 감각'],
    employment_target: [4, 5, 5, 4, 5, 3],
    cert_target:       [2, 5, 5, 3, 3, 2]
  },
  web: {
    axes: ['UI/UX 설계', '디자인툴(PS/AI)', 'HTML/CSS', 'JavaScript', '반응형 구현', '포트폴리오'],
    employment_target: [4, 4, 5, 4, 4, 4],
    cert_target:       [3, 3, 5, 4, 4, 3]
  },
  cg_maya: {
    axes: ['3D 기획력', '마야 모델링', '텍스처/렌더링', '리깅·애니메이션', '언리얼 엔진', '포트폴리오'],
    employment_target: [3, 5, 4, 3, 3, 5],
    cert_target:       [2, 4, 4, 3, 2, 4]
  },
  it_programming: {
    axes: ['알고리즘 이해', '언어 숙련도', 'DB/백엔드', 'GitHub 관리', '프로젝트 경험', '자격증'],
    employment_target: [4, 5, 5, 4, 4, 3],
    cert_target:       [3, 4, 3, 3, 2, 5]
  },
  ai: {
    axes: ['프롬프트 엔지니어링', '이미지 AI', '영상 AI', 'ChatGPT 활용', '콘텐츠 기획', 'AI 자격증'],
    employment_target: [5, 4, 3, 4, 4, 3],
    cert_target:       [3, 3, 2, 4, 2, 5]
  },
  artwork: {
    axes: ['드로잉 기초', '채색/렌더링', '캐릭터 디자인', '디지털 툴', 'AI 아트 활용', '포트폴리오'],
    employment_target: [4, 4, 4, 4, 3, 4],
    cert_target:       [3, 3, 3, 4, 2, 3]
  },
  certification: {
    axes: ['포토샵 활용', '일러스트 활용', '오피스/엑셀', 'CAD 활용', '회계/세무', '자격증 이해도'],
    employment_target: [3, 3, 4, 3, 3, 5],
    cert_target:       [4, 4, 5, 4, 4, 5]
  }
};

// ── 트랙별 After 비전 데이터 (① After 섹션용) ──
const TRACK_AFTER_DATA = {
  motion: {
    icon: '🎬', color: '#FF5630', bg: 'linear-gradient(135deg,#FF5630,#DE350B)',
    jobTitle: '영상편집자 / 모션그래퍼',
    tasks: ['유튜브·SNS 숏폼 영상 편집', '광고·브랜드 영상 제작', '모션그래픽 소스 제작', '드라마·영화 후반 작업'],
    employers: ['방송국', '광고제작사', '기업 홍보팀', '유튜브 채널'],
    salary: { min: 2200, max: 2800 },
    duration: { min: 10, max: 14 }
  },
  interior: {
    icon: '🏠', color: '#00875A', bg: 'linear-gradient(135deg,#00875A,#006644)',
    jobTitle: '인테리어 디자이너 / 공간 플래너',
    tasks: ['실내 공간 설계 및 도면 작성', '3D 시각화 및 렌더링', '인테리어 제안서 작성', '시공 관리 및 자재 선정'],
    employers: ['인테리어 회사', '건축설계사무소', '가구·건자재 회사', '부동산 개발사'],
    salary: { min: 2200, max: 2700 },
    duration: { min: 10, max: 14 }
  },
  visual_editing: {
    icon: '🎨', color: '#0052CC', bg: 'linear-gradient(135deg,#0052CC,#0041A3)',
    jobTitle: '그래픽 디자이너 / 편집 디자이너',
    tasks: ['포스터·브로슈어·카탈로그 제작', 'SNS 콘텐츠 디자인', '브랜드 아이덴티티 개발', '패키지 디자인'],
    employers: ['디자인 에이전시', '광고회사', '기업 마케팅팀', '출판사'],
    salary: { min: 2100, max: 2700 },
    duration: { min: 8, max: 12 }
  },
  web: {
    icon: '🌐', color: '#7C3AED', bg: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    jobTitle: 'UI/UX 디자이너 / 웹 디자이너',
    tasks: ['웹사이트·앱 화면 설계', 'UI/UX 기획 및 프로토타입', '반응형 웹 퍼블리싱', '사용자 경험 개선'],
    employers: ['IT기업', '스타트업', '웹 에이전시', '디자인 에이전시'],
    salary: { min: 2400, max: 3000 },
    duration: { min: 8, max: 12 }
  },
  cg_maya: {
    icon: '🤖', color: '#6554C0', bg: 'linear-gradient(135deg,#6554C0,#403294)',
    jobTitle: '3D 아티스트 / VFX 아티스트',
    tasks: ['3D 캐릭터·배경 모델링', '텍스처·렌더링 작업', 'VFX 특수효과 제작', '게임 리소스 제작'],
    employers: ['게임회사', 'VFX 스튜디오', '광고제작사', '영화제작사'],
    salary: { min: 2300, max: 3000 },
    duration: { min: 12, max: 18 }
  },
  it_programming: {
    icon: '💻', color: '#2B4492', bg: 'linear-gradient(135deg,#2B4492,#172B4D)',
    jobTitle: '웹 개발자 / 앱 개발자',
    tasks: ['웹·앱 서비스 개발', '서버·데이터베이스 구축', 'API 개발 및 연동', '시스템 유지보수'],
    employers: ['IT기업', 'SI업체', '스타트업', '대기업 IT부서'],
    salary: { min: 2800, max: 3500 },
    duration: { min: 12, max: 18 }
  },
  ai: {
    icon: '✨', color: '#0079BF', bg: 'linear-gradient(135deg,#0079BF,#006298)',
    jobTitle: 'AI 콘텐츠 크리에이터 / AI 활용 전문가',
    tasks: ['AI 이미지·영상 콘텐츠 제작', '프롬프트 엔지니어링', 'AI 기반 마케팅 콘텐츠 기획', 'AI 도구 활용 업무 자동화'],
    employers: ['AI 스타트업', '기업 디지털전환팀', '콘텐츠 제작사', '마케팅 에이전시'],
    salary: { min: 2800, max: 4000 },
    duration: { min: 8, max: 12 }
  },
  artwork: {
    icon: '🖌️', color: '#E91E8C', bg: 'linear-gradient(135deg,#E91E8C,#C2185B)',
    jobTitle: '일러스트레이터 / 캐릭터 디자이너',
    tasks: ['디지털 일러스트 제작', '캐릭터·IP 디자인', '웹툰 콘셉트 아트', 'AI 아트웍 활용 창작'],
    employers: ['게임회사', '엔터테인먼트사', '출판사', '프리랜서'],
    salary: { min: 2000, max: 2700 },
    duration: { min: 10, max: 14 }
  },
  certification: {
    icon: '📋', color: '#FF8B00', bg: 'linear-gradient(135deg,#FF8B00,#E07000)',
    jobTitle: '사무직 전문가 / 자격증 취업',
    tasks: ['문서 작성 및 데이터 관리', '회계·세무 실무 처리', '디자인 자격증 활용 업무', 'CAD 도면 보조 작업'],
    employers: ['일반기업', '공공기관', '금융권', '회계사무소'],
    salary: { min: 2000, max: 2500 },
    duration: { min: 8, max: 10 }
  }
};

// ── 트랙별 표준 로드맵 스테이지 (③ 로드맵 fallback용) ──
const TRACK_ROADMAP_STAGES = {
  motion: [
    { stage: '기초',      courses: ['포토샵 기초', '일러스트 기초'],  outcome: '이미지 보정·편집 기본기 완성',              months: 2 },
    { stage: '영상 편집', courses: ['프리미어프로'],                   outcome: '유튜브·SNS 영상 직접 편집 가능',            months: 1 },
    { stage: '모션그래픽',courses: ['애프터이펙트 1~3'],               outcome: '광고·브랜드 모션 소스 제작 가능',           months: 3 },
    { stage: '3D',        courses: ['시네마4D 1~5'],                   outcome: '3D 오브젝트·배경·타이틀 제작 가능',         months: 5 },
    { stage: '포트폴리오',courses: ['모션 포트폴리오'],                 outcome: '취업용 포트폴리오 완성 · 지원 시작',        months: 2 }
  ],
  interior: [
    { stage: '기초',      courses: ['포토샵 기초', '일러스트 기초'],  outcome: '프레젠테이션용 이미지 편집 가능',            months: 2 },
    { stage: '3D 모델링', courses: ['스케치업 1~2'],                  outcome: '공간 3D 모형 제작 가능',                     months: 2 },
    { stage: '도면',      courses: ['AutoCAD 1~2'],                   outcome: '실내 도면 작성 가능',                        months: 2 },
    { stage: '렌더링',    courses: ['3ds Max 1~2'],                   outcome: '고퀄리티 공간 렌더링 이미지 제작',           months: 2 },
    { stage: '포트폴리오',courses: ['인테리어 포트폴리오'],            outcome: '취업용 포트폴리오 완성 · 지원 시작',        months: 2 }
  ],
  visual_editing: [
    { stage: '기초',       courses: ['포토샵 기초', '일러스트 기초'], outcome: '이미지 보정·벡터 그래픽 기본기 완성',        months: 2 },
    { stage: '편집 디자인',courses: ['인포그래픽', '브랜딩 디자인'],  outcome: 'SNS 콘텐츠·브랜드 디자인 제작 가능',        months: 2 },
    { stage: '인쇄·출판', courses: ['패키지 디자인', '인디자인'],     outcome: '패키지·브로슈어 등 인쇄물 제작 가능',        months: 2 },
    { stage: '포트폴리오', courses: ['시각편집 포트폴리오'],           outcome: '취업용 포트폴리오 완성 · 지원 시작',        months: 2 }
  ],
  web: [
    { stage: '기초',       courses: ['포토샵 기초', '일러스트 기초'],              outcome: '웹 디자인용 이미지 편집 기본기 완성',  months: 2 },
    { stage: 'UI/UX 디자인',courses: ['인포그래픽', '브랜딩 디자인', 'Figma'],   outcome: 'UI/UX 화면 기획·설계 가능',            months: 2 },
    { stage: '퍼블리싱',   courses: ['HTML', 'CSS', 'JavaScript', 'jQuery'],      outcome: '반응형 웹사이트 직접 구현 가능',        months: 4 },
    { stage: '포트폴리오', courses: ['웹 포트폴리오'],                             outcome: '취업용 포트폴리오 완성 · 지원 시작',   months: 2 }
  ],
  cg_maya: [
    { stage: '기초',           courses: ['포토샵 기초', '일러스트 기초'], outcome: '2D 그래픽 기본기 완성',                  months: 2 },
    { stage: '3D 모델링',      courses: ['마야 1~5'],                    outcome: '캐릭터·배경 3D 모델링 가능',             months: 5 },
    { stage: '애니메이션·렌더링',courses: ['마야 6~9', '애프터이펙트'],  outcome: '리깅·애니메이션·렌더링 작업 가능',       months: 7 },
    { stage: '포트폴리오',     courses: ['CG 포트폴리오'],               outcome: '취업용 포트폴리오 완성 · 지원 시작',     months: 2 }
  ],
  it_programming: [
    { stage: 'C언어·알고리즘', courses: ['C언어'],               outcome: '프로그래밍 로직·알고리즘 기초 완성',             months: 2 },
    { stage: 'Java·앱 개발',   courses: ['Java', 'Android'],     outcome: '앱 개발 기초 및 안드로이드 앱 제작 가능',       months: 2 },
    { stage: 'Python·AI',      courses: ['Python', 'AICE 자격증'],outcome: '데이터 처리·자동화 스크립트 작성 가능',         months: 2 },
    { stage: '백엔드·DB',      courses: ['JSP/DB 백엔드'],        outcome: '웹 서비스 서버·데이터베이스 구축 가능',          months: 6 }
  ],
  ai: [
    { stage: 'AI 기초·자격증', courses: ['AI 자격증', 'ChatGPT+Midjourney 기초'], outcome: 'AI 도구 활용 기본기·자격증 취득',           months: 2 },
    { stage: 'AI 콘텐츠 제작', courses: ['AI 유튜브', 'AI 영상 편집'],            outcome: 'AI 기반 영상·이미지 콘텐츠 제작 가능',      months: 4 },
    { stage: '실무 심화',      courses: ['프롬프트 엔지니어링 심화'],              outcome: '업무 자동화·AI 콘텐츠 기획 실무 가능',      months: 2 }
  ],
  artwork: [
    { stage: '기초',      courses: ['포토샵 기초', '일러스트 기초'],           outcome: '디지털 드로잉 기본 툴 사용 가능',           months: 2 },
    { stage: '드로잉',    courses: ['디지털 드로잉', '디테일 일러스트'],       outcome: '캐릭터·배경 일러스트 제작 가능',            months: 4 },
    { stage: 'AI 아트웍', courses: ['AI 아트웍'],                              outcome: 'AI 활용 창작물 제작 가능',                   months: 1 },
    { stage: '포트폴리오',courses: ['아트웍 포트폴리오'],                      outcome: '취업·프리랜서용 포트폴리오 완성',            months: 2 }
  ],
  certification: [
    { stage: '디자인 자격증', courses: ['GTQ 2급·1급', 'GTQ-i', '컴퓨터그래픽스기능사'], outcome: '포토샵·일러스트 자격증 취득',      months: 3 },
    { stage: '오피스 자격증', courses: ['컴활 1·2급', 'MOS'],                             outcome: '엑셀·오피스 자격증 취득',          months: 2 },
    { stage: '전문 자격증',   courses: ['전산회계 1급', '전산세무 2급', 'ITQ'],            outcome: '회계·세무 실무 자격증 취득',       months: 3 }
  ]
};
