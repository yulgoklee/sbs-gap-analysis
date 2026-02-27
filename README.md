# SBS 아카데미 GAP 분석 시스템

> SBS 아카데미 컴퓨터아트학원 수원점 | AI 기반 맞춤 상담 시스템

---

## 프로젝트 개요

방문 고객과 상담사가 함께 화면을 보면서 진행하는 AI 기반 GAP 분석 웹 앱.
고객의 현재 수준과 목표를 입력하면 Gemini API가 맞춤형 커리큘럼 로드맵과 취업/자격증 가이드를 생성하고, PDF로 출력.

---

## 기술 스택

- **Frontend**: HTML / CSS / Vanilla JS (단일 파일)
- **AI API**: Google Gemini API (`gemini-2.5-flash-lite`)
- **PDF**: 브라우저 인쇄 기능 (window.print) + 인쇄용 CSS
- **버전 관리**: GitHub

---

## 파일 구조

```
sbs-gap-analysis/
├── index.html          # 메인 웹 앱 (단일 파일로 전체 기능 포함)
├── sbs_academy_data.json   # 학원 커리큘럼 데이터 (참조용)
└── README.md           # 프로젝트 문서
```

---

## 주요 기능

### 시나리오 B - GAP 분석 (현재 구현)
1. **기본 정보 입력** - 이름, 나이, 배경(전공/비전공), 투자 가능 기간
2. **목표 설정** - 취업 준비 / 자격증 취득 선택 + 트랙 선택
3. **현재 수준 체크** - 트랙별 핵심 툴 경험 수준 선택 (0~4단계)
4. **GAP 분석 결과** - Gemini API 분석 → 결과 화면 출력
5. **PDF 저장** - 브라우저 인쇄 기능으로 PDF 저장

### 시나리오 A - 적성검사 (예정)
- 아직 미구현

---

## 커리큘럼 데이터 구조

### 트랙 목록 (9개)
| 트랙 | 주요 툴 | 예상 기간 (비전공/전공) |
|---|---|---|
| 모션/영상 | 프리미어, 애프터이펙트, 시네마4D | 12~18 / 8~12개월 |
| 건축/인테리어 | AutoCAD, 스케치업, 3ds Max | 12~18 / 8~12개월 |
| 시각/편집디자인 | 포토샵, 일러스트, 인디자인 | 12~18 / 8~12개월 |
| 웹디자인 | HTML/CSS/JS, jQuery, UI/UX | 12~18 / 8~12개월 |
| CG/마야 | 마야, 애프터이펙트, Unreal | 12~18 / 8~12개월 |
| IT/프로그래밍 | C, Java, Python | 12~18 / 8~12개월 |
| AI | ChatGPT, Midjourney, AI 툴 | 6~10 / 4~6개월 |
| 아트웍 | 포토샵, 일러스트, 디지털드로잉 | 12~18 / 8~12개월 |
| 자격증 과정 | 트랙별 단기 집중 | 1~6개월 |

### 공통 기초 (모든 학과)
- 포토샵 기초 1개월 + 포토웍스 심화 1개월
- 일러스트 기초 1개월 + 디테일일러스트 심화 1개월

### 수업 기간 규칙
- 커리큘럼 번호 1개 = 1개월 (예: 애프터이펙트 1,2,3 = 3개월)
- 포트폴리오 = 개인 진도에 따라 최소 2개월~
- AI크리에이터 = 각 트랙 마지막 심화 단계 (1개월, 선택)

---

## Gemini 프롬프트 구조

### 시스템 프롬프트
- 역할 부여: SBS 아카데미 상담 AI
- 커리큘럼 데이터 전체 포함
- 출력 형식: JSON 고정

### 출력 JSON 구조
```json
{
  "customer_summary": { "name", "goal", "background" },
  "current_level_summary": "현재 수준 요약",
  "gap_analysis": {
    "strong_points": [],
    "weak_points": [],
    "gap_description": ""
  },
  "recommended_courses": [
    { "order", "course_name", "duration_months", "reason" }
  ],
  "total_duration": { "min_months", "max_months" },
  "goal_guide": "목표 달성 가이드",
  "academy_coverage": {
    "coverable": [],
    "not_coverable": [],
    "recommendation": ""
  }
}
```

---

## 버전 히스토리

### v1.0.0 (현재)
- [x] 4단계 입력 폼 (기본정보 → 목표 → 수준체크 → 결과)
- [x] Gemini API 연동 (`gemini-2.5-flash-lite`)
- [x] GAP 분석 결과 화면 렌더링
- [x] PDF 저장 (브라우저 인쇄 방식, 한글 완벽 지원)
- [x] 반응형 (태블릿/PC 대응)

---

## 다음 버전 예정 작업

### v1.1.0 - UI/UX 개선
- [ ] 결과 화면 디자인 고도화
- [ ] 로딩 애니메이션 개선
- [ ] 입력 폼 UX 개선

### v1.2.0 - 기능 추가
- [ ] 시나리오 A (적성검사) 구현
- [ ] 포트폴리오 예시 이미지 연동
- [ ] 취업 공고 실시간 트렌드 연동

### v1.3.0 - 운영 안정화
- [ ] API 에러 핸들링 강화
- [ ] 상담 이력 저장 기능
- [ ] 학원 정보 섹션 추가

---

## 사용 방법

1. `index.html` 크롬에서 열기
2. Gemini API 키 입력 (최초 1회)
3. 고객 정보 입력 → 목표 선택 → 수준 체크 → GAP 분석 시작
4. 결과 확인 후 PDF 저장 버튼 → 인쇄 대화상자 → PDF로 저장

### API 키 발급
[Google AI Studio](https://aistudio.google.com) → Get API key → 무료 발급

---

## 새 세션 시작 시 Claude에게 전달할 내용

```
이 README를 참고해서 작업을 이어가줘.
현재 버전: v1.0.0
작업할 내용: [여기에 작업 내용 입력]
```

---

## 학원 정보

- **학원명**: SBS 아카데미 컴퓨터아트학원 수원점
- **전화**: 031-546-3644
- **GitHub**: https://github.com/yulgoklee/sbs-gap-analysis
