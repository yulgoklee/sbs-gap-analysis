/* ═══════════════════════════════════════════════════════
   aptitude.js — 적성검사 로직
═══════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════
//  DATA — TRACKS (9개)
// ═══════════════════════════════════════════════════════
const TRACK_KEYS = ['motion','interior','visual_editing','web','cg_maya','it_programming','ai','artwork','certification'];

const TRACKS = {
  motion: {
    name: '영상/모션', icon: '🎬', color: '#FF5630', bg: 'linear-gradient(135deg,#FF5630,#DE350B)',
    subtitle: '영상·모션으로 세상과 소통하는 세계',
    certs:     ['컴퓨터그래픽스운용기능사', 'GTQ(우대)'],
    jobs:      ['영상편집자', '모션그래퍼', '유튜브 크리에이터', '광고영상 제작자'],
    employers: ['방송국', '광고제작사', '기업 홍보팀', '유튜브 채널'],
    salary:    '신입 약 2,400 ~ 3,000만원',
    archetype: '스토리텔러',
    lore: '움직임 하나로 사람의 감정을 움직이는 당신. 한 장면, 한 컷 안에 감동을 담아 스크린 너머 수천 명의 시선을 사로잡습니다.',
    jobCards: [
      { icon: '🎬', title: '영상편집자',       desc: '광고·유튜브·다큐 — 스크린을 채우는 사람' },
      { icon: '💫', title: '모션그래퍼',        desc: '브랜드 로고·UI에 생동감을 불어넣는 사람' },
      { icon: '📱', title: '콘텐츠 크리에이터', desc: '채널 하나로 수만 명과 대화하는 사람' },
    ],
    works: [
      { icon: '🎞️', title: '브랜드 광고 영상', color: 'linear-gradient(135deg,#FF5630,#DE350B)' },
      { icon: '✨',  title: '모션그래픽',       color: 'linear-gradient(135deg,#FF784F,#FF5630)' },
      { icon: '📲',  title: 'SNS 콘텐츠',       color: 'linear-gradient(135deg,#DE350B,#AB1C00)' },
    ],
  },
  interior: {
    name: '건축/인테리어', icon: '🏠', color: '#00875A', bg: 'linear-gradient(135deg,#00875A,#006644)',
    subtitle: '공간을 설계하고 아름답게 만드는 세계',
    certs:     ['실내건축기능사', '전산응용건축제도기능사', 'AutoCAD 활용'],
    jobs:      ['인테리어디자이너', '공간플래너', 'BIM 설계사'],
    employers: ['인테리어회사', '건축설계사무소', '가구·건자재회사', '부동산개발사'],
    salary:    '신입 약 2,400 ~ 3,000만원',
    archetype: '공간 설계자',
    lore: '빈 공간을 삶이 담긴 장소로 변환하는 당신. 조명, 동선, 소재 하나하나에 의도를 심어 사람들이 꿈꾸던 환경을 현실로 만들어냅니다.',
    jobCards: [
      { icon: '🏡', title: '인테리어디자이너', desc: '빈 공간을 머물고 싶은 곳으로 바꾸는 사람' },
      { icon: '📐', title: '공간플래너',        desc: '카페·숍·오피스의 첫인상을 설계하는 사람' },
      { icon: '🏗️', title: 'BIM 설계사',        desc: '3D 도면으로 건물이 지어지기 전 미래를 보는 사람' },
    ],
    works: [
      { icon: '🛋️', title: '주거 공간 설계',   color: 'linear-gradient(135deg,#00875A,#006644)' },
      { icon: '☕',  title: '카페·숍 인테리어', color: 'linear-gradient(135deg,#00A36B,#00875A)' },
      { icon: '📋',  title: 'CAD 도면·3D 모델', color: 'linear-gradient(135deg,#006644,#004D33)' },
    ],
  },
  visual_editing: {
    name: '시각/편집디자인', icon: '🎨', color: '#0052CC', bg: 'linear-gradient(135deg,#0052CC,#0041A3)',
    subtitle: '시각으로 브랜드와 메시지를 전달하는 세계',
    certs:     ['GTQ 1급', '컴퓨터그래픽스기능사', '시각디자인산업기사'],
    jobs:      ['그래픽디자이너', '편집디자이너', '브랜드디자이너'],
    employers: ['디자인 에이전시', '광고회사', '기업 마케팅팀', '출판사'],
    salary:    '신입 약 2,600 ~ 3,200만원',
    archetype: '비주얼 아티잔',
    lore: '색과 형태로 브랜드의 첫인상을 결정하는 당신. 정렬 하나, 서체 하나에도 의미를 담아 시각으로 세상과 대화합니다.',
    jobCards: [
      { icon: '🎨', title: '그래픽디자이너', desc: '브랜드의 얼굴을 만드는 사람' },
      { icon: '📖', title: '편집디자이너',   desc: '책·매거진·패키지 한 면 한 면을 완성하는 사람' },
      { icon: '🏷️', title: '브랜드디자이너', desc: '로고 하나로 기업의 정체성을 심어주는 사람' },
    ],
    works: [
      { icon: '🖋️', title: '브랜드 아이덴티티', color: 'linear-gradient(135deg,#0052CC,#0041A3)' },
      { icon: '📰', title: '편집·출판 디자인',   color: 'linear-gradient(135deg,#0066FF,#0052CC)' },
      { icon: '📦', title: '패키지·포스터',       color: 'linear-gradient(135deg,#0041A3,#002D7A)' },
    ],
  },
  web: {
    name: '웹디자인', icon: '🌐', color: '#7C3AED', bg: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    subtitle: 'UI/UX로 사용자 경험을 설계하는 세계',
    certs:     ['웹디자인기능사', 'GTQ(우대)', 'HTML/CSS/JS 구현'],
    jobs:      ['UI/UX디자이너', '웹디자이너', '퍼블리셔'],
    employers: ['IT기업', '스타트업', '웹 에이전시', '디자인 에이전시'],
    salary:    '신입 약 3,000 ~ 3,800만원',
    archetype: '경험 설계자',
    lore: '모든 클릭과 스크롤 뒤에 당신의 설계가 있습니다. 디지털 공간에서 사용자가 느끼는 모든 감각을 의도적으로 설계하는 UX 아키텍트입니다.',
    jobCards: [
      { icon: '🖱️', title: 'UI/UX디자이너', desc: '앱·웹에서 사람들의 모든 경험을 설계하는 사람' },
      { icon: '🌐', title: '웹디자이너',      desc: '브랜드의 디지털 공간을 만드는 사람' },
      { icon: '💻', title: '퍼블리셔',        desc: '디자인을 살아있는 화면으로 구현하는 사람' },
    ],
    works: [
      { icon: '📱', title: '앱 UI 화면',      color: 'linear-gradient(135deg,#7C3AED,#6D28D9)' },
      { icon: '🖥️', title: '웹사이트 디자인', color: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
      { icon: '🗂️', title: 'UX 프로토타입',   color: 'linear-gradient(135deg,#6D28D9,#4C1D95)' },
    ],
  },
  cg_maya: {
    name: 'CG/마야', icon: '🤖', color: '#6554C0', bg: 'linear-gradient(135deg,#6554C0,#403294)',
    subtitle: '3D로 가상 세계를 창조하는 세계',
    certs:     ['컴퓨터그래픽스운용기능사', '게임그래픽전문가'],
    jobs:      ['3D아티스트', 'VFX아티스트', '캐릭터모델러', '게임그래픽디자이너'],
    employers: ['게임회사', 'VFX스튜디오', '광고제작사', '영화제작사'],
    salary:    '신입 약 2,600 ~ 3,400만원',
    archetype: '세계 창조자',
    lore: '현실에 존재하지 않는 세계를 만들어내는 당신. 3D 공간 안에서 물리법칙을 초월한 상상을 픽셀 하나하나로 구현해냅니다.',
    jobCards: [
      { icon: '🤖', title: '3D아티스트',          desc: '현실에 없는 세계를 3D로 만들어내는 사람' },
      { icon: '💥', title: 'VFX아티스트',          desc: '영화·광고 속 폭발·마법을 현실로 만드는 사람' },
      { icon: '🎮', title: '게임그래픽디자이너',   desc: '게임 속 캐릭터·배경을 살아있게 만드는 사람' },
    ],
    works: [
      { icon: '🦾', title: '3D 캐릭터·환경', color: 'linear-gradient(135deg,#6554C0,#403294)' },
      { icon: '🌟', title: 'VFX·시각효과',   color: 'linear-gradient(135deg,#7B68D9,#6554C0)' },
      { icon: '🎯', title: '게임 그래픽',     color: 'linear-gradient(135deg,#403294,#2D1F6E)' },
    ],
  },
  it_programming: {
    name: 'IT/프로그래밍', icon: '💻', color: '#2B4492', bg: 'linear-gradient(135deg,#2B4492,#172B4D)',
    subtitle: '코드로 서비스와 세상을 만드는 세계',
    certs:     ['정보처리기사', 'AICE 자격증', 'SQLD'],
    jobs:      ['웹개발자', '앱개발자', '백엔드개발자', '풀스택개발자'],
    employers: ['IT기업', '스타트업', 'SI업체', '대기업 IT부서'],
    salary:    '신입 약 3,200 ~ 4,500만원',
    archetype: '코드 아키텍트',
    lore: '당신이 작성한 한 줄 한 줄이 수많은 사람들의 일상을 바꿉니다. 논리와 구조로 세상을 움직이는 보이지 않는 엔지니어입니다.',
    jobCards: [
      { icon: '⚡', title: '웹개발자',     desc: '서비스 뒤에서 세상을 움직이는 코드를 짜는 사람' },
      { icon: '📱', title: '앱개발자',     desc: '수백만 명의 스마트폰 속 앱을 만드는 사람' },
      { icon: '🚀', title: '풀스택개발자', desc: '기획부터 배포까지 서비스를 혼자 완성하는 사람' },
    ],
    works: [
      { icon: '💻', title: '웹·앱 서비스',   color: 'linear-gradient(135deg,#2B4492,#172B4D)' },
      { icon: '⚙️', title: '백엔드 시스템',  color: 'linear-gradient(135deg,#3D5A9E,#2B4492)' },
      { icon: '🌐', title: 'API·서비스 배포', color: 'linear-gradient(135deg,#172B4D,#0D1F3C)' },
    ],
  },
  ai: {
    name: 'AI 크리에이터', icon: '✨', color: '#0079BF', bg: 'linear-gradient(135deg,#0079BF,#006298)',
    subtitle: 'AI 도구로 창작과 업무를 혁신하는 세계',
    certs:     ['AI 활용능력 자격증', '컴퓨터활용능력'],
    jobs:      ['AI 콘텐츠 크리에이터', '프롬프트 엔지니어', 'AI 마케터'],
    employers: ['AI 스타트업', '기업 디지털전환팀', '콘텐츠 제작사', '마케팅 에이전시'],
    salary:    '신입 약 3,000 ~ 4,000만원',
    archetype: '혁신 선구자',
    lore: '기술과 창의를 동시에 다루는 당신. AI라는 도구를 손에 쥐고 누구보다 빠르게 새로운 영역을 개척하며 미래를 선점합니다.',
    jobCards: [
      { icon: '🤖', title: 'AI 콘텐츠 크리에이터', desc: 'AI로 영상·이미지·글을 누구보다 빠르게 만드는 사람' },
      { icon: '💬', title: '프롬프트 엔지니어',      desc: 'AI에게 원하는 것을 정확히 설계하는 언어 전문가' },
      { icon: '📊', title: 'AI 마케터',               desc: '데이터와 AI로 마케팅 전략을 자동화하는 사람' },
    ],
    works: [
      { icon: '✨', title: 'AI 생성 콘텐츠',  color: 'linear-gradient(135deg,#0079BF,#006298)' },
      { icon: '🧠', title: '자동화·프롬프트', color: 'linear-gradient(135deg,#0091D9,#0079BF)' },
      { icon: '📈', title: '데이터 분석',      color: 'linear-gradient(135deg,#006298,#004A75)' },
    ],
  },
  artwork: {
    name: '아트웍', icon: '🖌️', color: '#E91E8C', bg: 'linear-gradient(135deg,#E91E8C,#C2185B)',
    subtitle: '디지털 드로잉으로 세계관을 만드는 세계',
    certs:     ['GTQ(우대)', '디지털드로잉 활용'],
    jobs:      ['일러스트레이터', '캐릭터디자이너', '웹툰작가', '컨셉아티스트'],
    employers: ['게임회사', '엔터테인먼트사', '출판사', '프리랜서'],
    salary:    '신입 약 2,200 ~ 2,800만원',
    archetype: '세계관 창조자',
    lore: '붓 하나로 캐릭터에 생명을 불어넣는 당신. 이야기와 이미지로 사람들의 마음속에 오래도록 살아남을 무언가를 남깁니다.',
    jobCards: [
      { icon: '🖌️', title: '일러스트레이터', desc: '그림 하나로 이야기를 전달하는 사람' },
      { icon: '🦸', title: '캐릭터디자이너', desc: '게임·애니·굿즈 속 캐릭터를 탄생시키는 사람' },
      { icon: '📚', title: '웹툰작가',        desc: '내 이야기로 수십만 독자를 사로잡는 사람' },
    ],
    works: [
      { icon: '🎨', title: '일러스트·캐릭터', color: 'linear-gradient(135deg,#E91E8C,#C2185B)' },
      { icon: '📖', title: '웹툰·만화',        color: 'linear-gradient(135deg,#F06292,#E91E8C)' },
      { icon: '🎭', title: '컨셉 아트',        color: 'linear-gradient(135deg,#C2185B,#8B0038)' },
    ],
  },
  certification: {
    name: '자격증 과정', icon: '📋', color: '#FF8B00', bg: 'linear-gradient(135deg,#FF8B00,#E07000)',
    subtitle: '자격증으로 빠르게 취업을 완성하는 세계',
    certs:     ['GTQ 1·2급', '컴활 1·2급', '전산회계 1급', 'ITQ'],
    jobs:      ['경영지원', '총무·행정', '회계사무원', '무역사무원'],
    employers: ['일반기업', '공공기관', '금융권', '회계사무소'],
    salary:    '신입 약 2,200 ~ 2,800만원',
    archetype: '실무 전문가',
    lore: '확실한 자격으로 빠르게 현장에 진입하는 당신. 자격증이라는 명확한 무기를 쥐고 안정적이면서도 전문적인 커리어를 만들어갑니다.',
    jobCards: [
      { icon: '🏢', title: '경영지원 사무원',  desc: '기업 운영의 중심에서 모든 것을 조율하는 사람' },
      { icon: '💰', title: '회계·세무 사무원', desc: '숫자로 기업의 건강을 관리하는 사람' },
      { icon: '🌍', title: '무역 사무원',       desc: '세계를 무대로 수출입을 연결하는 사람' },
    ],
    works: [
      { icon: '📋', title: '문서·보고서 작성', color: 'linear-gradient(135deg,#FF8B00,#E07000)' },
      { icon: '💳', title: '회계·세무 처리',   color: 'linear-gradient(135deg,#FFA040,#FF8B00)' },
      { icon: '🌍', title: '무역·행정 업무',   color: 'linear-gradient(135deg,#E07000,#B35800)' },
    ],
  }
};

// ═══════════════════════════════════════════════════════
//  DATA — PERSONAS (16가지 조합)
// ═══════════════════════════════════════════════════════
const PERSONAS = {
  'artwork|visual_editing':   { name: '디지털 캔버스 예술가',
    combo: '1순위 아트웍 / 2순위 시각편집',
    trait: '손끝의 감각이 뛰어나며 나만의 화풍을 만드는 데 집중합니다.',
    ai:    '생성형 AI(Midjourney 등)를 활용해 아이디어 스케치 시간을 단축합니다.' },
  'artwork|cg_maya':          { name: '게임 컨셉 아티스트',
    combo: '1순위 아트웍 / 2순위 마야/CG',
    trait: '상상 속 세계관과 캐릭터를 구체화하는 일에 희열을 느낍니다.',
    ai:    'AI로 질감(Texture) 소스를 생성하여 작업의 디테일을 높입니다.' },
  'visual_editing|artwork':   { name: '브랜드 크리에이티브 디렉터',
    combo: '1순위 시각편집 / 2순위 아트웍',
    trait: '기업의 정체성을 시각적으로 정립하고 로고부터 패키지까지 총괄합니다.',
    ai:    'AI 브랜딩 도구를 활용해 수백 개의 시안을 초고속으로 검토합니다.' },
  'visual_editing|web':       { name: '올라운드 광고 디자이너',
    combo: '1순위 시각편집 / 2순위 웹디자인',
    trait: '온·오프라인을 넘나드는 상업 디자인의 실무 최강자입니다.',
    ai:    '광고 카피라이팅 AI와 결합해 기획부터 디자인까지 1인 제작을 실현합니다.' },
  'web|it_programming':       { name: '사용자 경험(UX) 설계자',
    combo: '1순위 웹디자인 / 2순위 IT프로그래밍',
    trait: '사용자의 마음을 읽고 가장 편리한 디지털 서비스의 흐름을 설계합니다.',
    ai:    'AI 분석 도구로 사용자 데이터를 파악해 최적의 UI를 자동 제안받습니다.' },
  'web|motion':               { name: '디지털 미디어 아티스트',
    combo: '1순위 웹디자인 / 2순위 2D/3D모션',
    trait: '정적인 웹을 넘어 생동감 있게 움직이는 인터랙티브 웹을 구축합니다.',
    ai:    'AI 코딩 보조로 복잡한 인터랙션 구현 시간을 획기적으로 줄입니다.' },
  'motion|visual_editing':    { name: '시네마틱 영상 연출가',
    combo: '1순위 2D/3D모션 / 2순위 시각편집',
    trait: '영상의 리듬과 연출력을 활용해 강렬한 메시지를 전달합니다.',
    ai:    'AI 영상 편집 도구로 컷 편집과 자막 작업을 자동화하고 연출에만 집중합니다.' },
  'motion|cg_maya':           { name: '하이브리드 모션 디렉터',
    combo: '1순위 2D/3D모션 / 2순위 마야/CG',
    trait: '그래픽 움직임을 넘어 입체적인 공간감까지 다루는 고숙련 영상가입니다.',
    ai:    'AI 업스케일링 기술로 저화질 소스를 고화질 영상으로 즉시 변환합니다.' },
  'cg_maya|interior':         { name: '가상 현실 빌더',
    combo: '1순위 마야/CG / 2순위 인테리어',
    trait: '현실보다 더 실제 같은 3D 공간과 건축물을 가상 세계에 구현합니다.',
    ai:    'AI 렌더링 최적화 기술로 무거운 작업도 빠르게 결과물을 뽑아냅니다.' },
  'cg_maya|motion':           { name: 'VFX 특수효과 전문가',
    combo: '1순위 마야/CG / 2순위 2D/3D모션',
    trait: '영화나 게임의 시각적 완성도를 결정짓는 화려한 특수효과를 창조합니다.',
    ai:    'AI 로토스코핑(배경 분리) 기술로 단순 노가다 작업을 자동 해결합니다.' },
  'interior|cg_maya':         { name: '감성 공간 디자이너',
    combo: '1순위 인테리어 / 2순위 마야/CG',
    trait: '심미적인 아름다움과 공간의 공기를 디자인하는 예술가형 설계자입니다.',
    ai:    'AI로 평면도를 3D 공간으로 즉시 변환해 클라이언트 미팅 효율을 높입니다.' },
  'interior|certification':   { name: '공간 실무 기술자',
    combo: '1순위 인테리어 / 2순위 자격증',
    trait: '도면 설계부터 현장 관리, 자격증까지 겸비한 실무형 전문가입니다.',
    ai:    'AI 적산 프로그램을 통해 자재량과 공사 비용을 오차 없이 계산합니다.' },
  'it_programming|web':       { name: '풀스택 웹 엔지니어',
    combo: '1순위 IT프로그래밍 / 2순위 웹디자인',
    trait: '보이지 않는 서버의 논리와 보이는 디자인의 연결을 완벽히 이해합니다.',
    ai:    'GitHub Copilot 같은 AI 비서를 활용해 코드 에러를 실시간으로 교정합니다.' },
  'it_programming|certification': { name: '논리적 시스템 분석가',
    combo: '1순위 IT프로그래밍 / 2순위 자격증',
    trait: '복잡한 데이터를 다루고 안정적인 시스템을 구축하는 문제 해결사입니다.',
    ai:    'AI 데이터 분석 기능을 통해 복잡한 비즈니스 로직을 자동화합니다.' },
  'certification|it_programming': { name: '스마트 비즈니스 운영자',
    combo: '1순위 자격증 / 2순위 IT프로그래밍',
    trait: '오피스 툴과 데이터 관리 능력을 바탕으로 기업의 운영 효율을 높입니다.',
    ai:    'ChatGPT를 활용해 복잡한 문서 요약, 보고서 작성, 메일 응대를 자동화합니다.' },
  'certification|visual_editing': { name: '디자인 실무 행정가',
    combo: '1순위 자격증 / 2순위 시각편집',
    trait: '행정 업무는 물론, 간단한 홍보물 제작까지 가능한 멀티플레이어입니다.',
    ai:    'Canva/Adobe Express AI로 전문 디자이너 없이도 고퀄리티 홍보물을 만듭니다.' },
};

// ═══════════════════════════════════════════════════════
//  DATA — QUESTIONS (25개 · 간접 관찰형 · 다차원)
// ═══════════════════════════════════════════════════════
const QUESTIONS = [
  // ── A. 감각의 예민도 (Q1~8) ──
  { section:'A', text: "나는 처음 보는 포스터나 광고를 볼 때, 메시지 내용보다 글자체(폰트)와 배경색의 '조화'가 먼저 눈에 들어온다.",
    scores: { visual_editing:1.0 } },
  { section:'A', text: "예쁜 카페에 가면 단순히 사진을 찍기보다, 가구의 배치나 조명의 위치가 왜 이렇게 되었는지 구조를 살피게 된다.",
    scores: { interior:1.0 } },
  { section:'A', text: "영화나 애니메이션을 볼 때, 캐릭터의 감정선보다 그들이 움직이는 '속도감'이나 '타격감'에 더 짜릿함을 느낀다.",
    scores: { motion:1.0 } },
  { section:'A', text: "웹사이트나 앱을 쓸 때, 기능은 문제없어도 버튼의 위치나 색상이 촌스러우면 사용하기 싫어진다는 기분이 든다.",
    scores: { visual_editing:1.0, web:1.0 } },
  { section:'A', text: "일상적인 사물(컵, 의자 등)을 보며 \"이걸 더 멋진 캐릭터나 생명체로 바꾼다면?\"이라는 상상을 가끔 한다.",
    scores: { artwork:1.0, cg_maya:1.0 } },
  { section:'A', text: "복잡한 표나 데이터를 볼 때, 수치 자체보다 이를 어떻게 한눈에 들어오는 도표로 정리할지 고민이 앞선다.",
    scores: { visual_editing:1.0 } },
  { section:'A', text: "주변 사람들로부터 \"너는 참 관찰력이 좋다\"거나 \"디테일한 부분을 잘 잡아낸다\"는 소리를 자주 듣는다.",
    scores: { artwork:1.0 } },
  { section:'A', text: "길거리 전광판의 화려한 특수효과를 보면 \"어떻게 만든 걸까?\"라는 호기심이 생겨 검색해 본 적이 있다.",
    scores: { motion:1.0, cg_maya:1.0 } },

  // ── B. 사고의 습관 (Q9~17) ──
  { section:'B', text: "나는 무언가를 배울 때 '일단 해보는 것'보다, 전체적인 '원리와 구조'를 먼저 파악해야 마음이 편하다.",
    scores: { cg_maya:1.0, interior:1.0, it_programming:1.0 } },
  { section:'B', text: "정해진 매뉴얼대로 정확하게 결과물을 뽑아내는 과정에서 큰 안정감을 느낀다.",
    scores: { interior:1.0, certification:1.0 } },
  { section:'B', text: "같은 작업을 반복해야 할 때, \"이걸 더 빠르고 편하게 자동화할 방법은 없을까?\"를 본능적으로 고민한다.",
    scores: { web:1.0, it_programming:1.0, ai:1.0 } },
  { section:'B', text: "나는 결과물이 90% 완성되었어도, 남들이 모르는 아주 작은 '디테일'이 마음에 안 들면 끝까지 수정하고 싶다.",
    scores: { artwork:1.0, motion:1.0 } },
  { section:'B', text: "복잡한 문제를 만났을 때 감성적으로 접근하기보다, 단계별로 나누어 논리적인 해결책을 찾는 것이 익숙하다.",
    scores: { cg_maya:1.0, interior:1.0, it_programming:1.0 } },
  { section:'B', text: "나는 여러 명이 북적이며 일하는 환경보다, 혼자 깊게 몰입해서 나만의 결과물을 완성해 나가는 것이 더 즐겁다.",
    scores: { artwork:1.0 } },
  { section:'B', text: "새로운 디지털 기기나 소프트웨어를 처음 접했을 때, 설명서 없이 이것저것 눌러보며 스스로 기능을 파악하는 편이다.",
    scores: { web:1.0, it_programming:1.0, ai:1.0 } },
  { section:'B', text: "\"창의적이다\"라는 말보다 \"체계적이고 논리적이다\"라는 칭찬이 나에게는 더 기분 좋게 들린다.",
    scores: { certification:1.0 } },
  { section:'B', text: "무언가를 설명할 때 긴 글보다는 그림, 도표, 혹은 비유를 활용해 시각적으로 설명하는 것이 더 편하다.",
    scores: { visual_editing:1.0, motion:1.0 } },

  // ── C. 가치와 비전 (Q18~25) ──
  { section:'C', text: "나는 나만의 독특한 예술 세계를 구축하는 것보다, 누군가의 실질적인 불편함을 기술로 해결해 주는 것이 더 뿌듯하다.",
    scores: { web:1.0, ai:1.0 } },
  { section:'C', text: "10년 후의 내 모습이 전문적인 기술 하나로 자신의 가치를 증명하는 '장인'의 이미지였으면 좋겠다.",
    scores: { certification:1.0 } },
  { section:'C', text: "세상에 없던 완전히 새로운 것을 창조하는 일보다, 기존의 것을 더 쓸모 있고 아름답게 '개선'하는 일이 더 매력적이다.",
    scores: { visual_editing:1.0, ai:1.0 } },
  { section:'C', text: "내가 만든 창작물이나 서비스가 사람들의 일상에 직접적인 '편리함'을 제공할 때 살아있음을 느낀다.",
    scores: { interior:1.0, web:1.0 } },
  { section:'C', text: "최신 기술 트렌드를 남들보다 빠르게 익혀서, 이를 내 업무에 적용해 앞서나가는 것이 즐겁다.",
    scores: { ai:1.0 } },
  { section:'C', text: "결과가 바로 나오지 않더라도, 기초를 탄탄히 쌓아가는 지루한 과정을 견뎌낼 자신이 있다.",
    scores: { cg_maya:1.0 } },
  { section:'C', text: "단순히 돈을 버는 직업을 넘어, 내 이름으로 된 포트폴리오를 꾸준히 쌓아가는 삶을 지향한다.",
    scores: { artwork:1.0, motion:1.0 } },
  { section:'C', text: "나는 복잡한 세상의 규칙을 단순하고 명료한 시스템으로 정리하는 것에 남다른 재능이 있다고 생각한다.",
    scores: { it_programming:1.0 } },
];

// ═══════════════════════════════════════════════════════
//  MAX SCORES — 런타임 자동 계산
// ═══════════════════════════════════════════════════════
const MAX_SCORES = (function() {
  const max = {};
  TRACK_KEYS.forEach(k => { max[k] = 0; });
  QUESTIONS.forEach(q => {
    Object.entries(q.scores).forEach(([k, w]) => { max[k] += w; });
  });
  return max;
})();

const SECTION_LABELS = {
  A: '🔍 감각의 예민도',
  B: '⚙️ 사고의 습관',
  C: '🌟 가치와 비전'
};

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let apiKey           = '';
let currentQ         = 0;
let answers          = new Array(QUESTIONS.length).fill(-1);
let topTrackKey      = '';
let autoAdvanceTimer = null;
const LS_KEY = 'sbs_gemini_api_key';

// ═══════════════════════════════════════════════════════
//  API KEY
// ═══════════════════════════════════════════════════════
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
});

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
  const scoreLines = TRACK_KEYS.map(k => `  - ${TRACKS[k].name}: ${scores[k]}점`).join('\n');

  const prompt = `당신은 SBS 아카데미 진로 상담 전문가입니다.
아래는 수강생의 적성검사 결과입니다. 검사는 Yes/No 형식으로 감각적 예민도, 사고 습관, 가치관·진로 비전을 간접적으로 측정한 것입니다.

[응답 패턴]
- 감각의 예민도 (8문항) 중 '그렇다': ${yesA}개
- 사고의 습관 (9문항) 중 '그렇다': ${yesB}개
- 가치와 비전 (8문항) 중 '그렇다': ${yesC}개

[트랙별 적합도 (0~100점)]
${scoreLines}

[AI 추천]
1순위: ${t1.name} (${scores[top1Key]}점) — ${t1.subtitle}
2순위: ${t2.name} (${scores[top2Key]}점) — ${t2.subtitle}
전체 평균: ${avg}점

위 결과를 바탕으로 아래 내용을 자연스러운 한국어로 4~5문장으로 작성해주세요:
1. 이 사람의 성향·사고방식을 한 문장으로 요약
2. 1순위 '${t1.name}'이 왜 잘 맞는지 응답 패턴 근거로 2문장
3. 2순위 '${t2.name}'도 함께 고려할 만한 이유 한 문장
4. 다음 단계(GAP 분석 또는 상담)로 자연스럽게 유도하는 마무리 문장

따뜻하고 격려하는 톤으로, JSON 없이 순수 텍스트로만 반환하세요.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{ parts:[{ text:prompt }] }] }) }
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
        <span class="salary-val">${t1.salary}</span>
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
          <span class="r2-salary-val">${t2.salary}</span>
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
