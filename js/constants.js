// ═══════════════════════════════════════════════════════
//  DATA CONSTANTS
// ═══════════════════════════════════════════════════════

const LEVEL_LABELS = ['없음', '독학/조금 경험', '학교/학원 수강', '자격증 보유', '실무 경험'];

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

// ── 트랙별 포트폴리오 참고 사이트 ──
const TRACK_PORTFOLIO_SITES = {
  motion: [
    { title: 'Behance · 모션그래픽', url: 'https://www.behance.net/search/projects?search=motion+graphic', description: '국내외 모션그래픽 포트폴리오 참고' },
    { title: 'Vimeo · Motion Design', url: 'https://vimeo.com/categories/animation', description: '영상/애니메이션 포트폴리오 참고' },
    { title: 'ArtStation · Motion', url: 'https://www.artstation.com/channels/motion-graphics', description: '전문 아티스트 모션 포트폴리오' }
  ],
  interior: [
    { title: 'Archinect Portfolio', url: 'https://archinect.com/portfolio', description: '건축/인테리어 포트폴리오 참고' },
    { title: 'Dezeen · Architecture', url: 'https://www.dezeen.com/architecture/', description: '건축 디자인 트렌드 참고' },
    { title: 'Pinterest · 인테리어', url: 'https://www.pinterest.co.kr/ideas/interior-design/', description: '인테리어 아이디어 및 포트폴리오 참고' }
  ],
  visual_editing: [
    { title: 'Behance · Graphic Design', url: 'https://www.behance.net/search/projects?search=graphic+design', description: '그래픽/편집 디자인 포트폴리오 참고' },
    { title: 'Dribbble · Visual Design', url: 'https://dribbble.com/tags/graphic_design', description: '시각 디자인 트렌드 참고' },
    { title: 'Pinterest · Brand Design', url: 'https://www.pinterest.co.kr/ideas/brand-design/', description: '브랜딩 디자인 아이디어 참고' }
  ],
  web: [
    { title: 'Behance · UI/UX', url: 'https://www.behance.net/search/projects?search=ui+ux', description: 'UI/UX 디자인 포트폴리오 참고' },
    { title: 'Dribbble · Web Design', url: 'https://dribbble.com/tags/web_design', description: '웹 디자인 트렌드 참고' },
    { title: 'Awwwards', url: 'https://www.awwwards.com/', description: '세계 최고 수준 웹 디자인 참고' }
  ],
  cg_maya: [
    { title: 'ArtStation · 3D Art', url: 'https://www.artstation.com/channels/character-art', description: '전문 3D 아티스트 포트폴리오 참고' },
    { title: 'CGSociety', url: 'https://cgsociety.org/', description: 'CG/VFX 전문가 커뮤니티' },
    { title: 'Sketchfab', url: 'https://sketchfab.com/', description: '3D 모델 포트폴리오 플랫폼' }
  ],
  it_programming: [
    { title: 'GitHub Trending', url: 'https://github.com/trending', description: '트렌딩 오픈소스 프로젝트 참고' },
    { title: 'Naver D2', url: 'https://d2.naver.com/home', description: '네이버 기술 블로그 참고' }
  ],
  ai: [
    { title: 'Behance · AI Art', url: 'https://www.behance.net/search/projects?search=AI+art', description: 'AI 생성 아트 포트폴리오 참고' },
    { title: 'Midjourney Explore', url: 'https://www.midjourney.com/explore', description: 'Midjourney 작품 탐색' }
  ],
  artwork: [
    { title: 'ArtStation · Illustration', url: 'https://www.artstation.com/channels/illustration', description: '일러스트레이션 포트폴리오 참고' },
    { title: 'Pixiv', url: 'https://www.pixiv.net/', description: '디지털 아트 커뮤니티' },
    { title: 'Behance · Illustration', url: 'https://www.behance.net/search/projects?search=illustration', description: '일러스트 포트폴리오 참고' }
  ],
  certification: [
    { title: 'Q-net 큐넷', url: 'https://www.q-net.or.kr/', description: '자격증 시험 정보 및 접수 안내' }
  ]
};
