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
