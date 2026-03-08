# SBS 아카데미 GAP 분석 시스템

> SBS 아카데미 컴퓨터아트학원 수원점 | AI 기반 맞춤 상담 시스템

**🔗 배포 URL**: https://yulgoklee.github.io/sbs-gap-analysis/

---

## 프로젝트 개요

방문 고객과 상담사가 함께 화면을 보면서 진행하는 AI 기반 상담 웹 앱.

- **시나리오 A (적성검사)**: 25문항 Yes/No 간접 행동 문항 (감각·사고·가치관 3섹션) → 9개 트랙 적성도 산출 → 페르소나 도출 → 게임 RPG 스타일 결과 카드 → Gemini AI 코멘트 → GAP 분석 연결
- **시나리오 B (GAP 분석)**: 고객 수준 입력 → Gemini AI 맞춤 커리큘럼/취업·자격증 가이드 → PDF 저장

---

## 사용 방법 (멘토/상담사용)

### 접속
- 크롬 브라우저에서 https://yulgoklee.github.io/sbs-gap-analysis/ 접속
- 별도 설치 없음, 인터넷만 연결되어 있으면 사용 가능

### API 키 설정 (기기당 최초 1회)
1. 접속 시 API 키 입력 모달 표시
2. [Google AI Studio](https://aistudio.google.com) → Get API key → 무료 발급
3. 키 입력 후 저장 → 브라우저에 저장되어 다음 접속 시 자동 로그인
4. 키 변경이 필요한 경우 우상단 **🔑 키 변경** 버튼 클릭

### 상담 진행

#### 시나리오 A — 적성검사 (진로 탐색)
1. 랜딩 페이지에서 **적성검사** 선택
2. **25문항** 응답 (Yes / No · 섹션A 감각의 예민도 8문항, 섹션B 사고의 습관 9문항, 섹션C 가치와 비전 8문항)
3. 결과 확인 — 게임 RPG 클래스 카드 스타일
   - **페르소나 블록**: 1순위+2순위 조합에서 도출한 16가지 페르소나명·특징·AI 시너지
   - **1순위**: 아키타입·어피니티 바·lore 텍스트 + "이런 사람이 돼" 직업 카드 3종 + 작업물 쇼케이스 3종 + 초봉 가이드
   - **2순위**: 아키타입·lore + 직업·취업처·연봉 요약
4. **Gemini AI 맞춤 코멘트** 자동 생성
5. **GAP 분석 바로가기** 버튼으로 시나리오 B 연결

#### 시나리오 B — GAP 분석 (커리큘럼 설계)
1. 랜딩 페이지에서 **GAP 분석** 선택 (또는 적성검사 결과에서 연결)
2. **Step 1** — 고객 기본 정보 입력 (이름, 나이, 배경, 현재 상태, 투자 가능 기간)
3. **Step 2** — 목표 선택 (취업 준비 / 자격증 취득) + 트랙 선택
4. **Step 3** — 트랙별 핵심 툴 경험 수준 선택 (없음 / 독학 / 학원 수강 / 업무 활용 / 실무 경험)
5. **GAP 분석 시작** → Gemini AI가 분석 후 결과 화면 출력
6. **PDF 저장** → 상단 저장 버튼 → 브라우저 인쇄 대화상자 → PDF로 저장

---

## 기술 스택

| 구분 | 내용 |
|---|---|
| **Frontend** | HTML / CSS / Vanilla JS |
| **AI API** | Google Gemini API (`gemini-2.5-flash-lite`) |
| **PDF** | 브라우저 인쇄 기능 (window.print) + 인쇄용 CSS |
| **배포** | GitHub Pages (main 브랜치 루트) |
| **자동화 테스트** | Playwright (E2E, headless Chromium) |
| **버전 관리** | GitHub |

---

## 파일 구조

```
sbs-gap-analysis/
├── index.html              # 메인 랜딩 페이지 (시나리오 A/B 선택)
├── aptitude-test.html      # 시나리오 A: 적성검사
├── gap-analysis.html       # 시나리오 B: GAP 분석
├── css/
│   ├── style.css           # 전체 공통 스타일 (반응형 + 인쇄용 포함)
│   └── aptitude.css        # 시나리오 A 전용 스타일
├── js/
│   ├── shared.js           # 공통 모듈 (Gemini API 키 관리 — 양 페이지 공유)
│   ├── constants.js        # 트랙 통합 데이터 (TRACKS·TRACK_KEYS·커리큘럼·상수)
│   ├── app.js              # GAP 분석 로직 (폼 흐름, API 호출, 결과 렌더링)
│   ├── aptitude-data.js    # 시나리오 A 정적 데이터 (PERSONAS·QUESTIONS·MAX_SCORES)
│   └── aptitude.js         # 시나리오 A 로직 (퀴즈 흐름, 점수 계산, 결과 렌더링)
├── data/
│   ├── academy.json        # 학원 기본 정보
│   ├── common-courses.json # 공통 기초 과목 데이터
│   ├── gap-analysis.json   # GAP 분석 설정 데이터
│   └── tracks/             # 트랙별 커리큘럼 JSON (9개 파일)
│       ├── ai.json
│       ├── artwork.json
│       ├── certification.json
│       ├── cg-maya.json
│       ├── interior.json
│       ├── it-programming.json
│       ├── motion.json
│       ├── visual-editing.json
│       └── web.json
├── tests/
│   ├── helpers/
│   │   └── mock-response.js    # Gemini API 목업 응답 데이터
│   └── e2e/
│       ├── 01_validation.spec.js       # 입력 유효성 검사 테스트
│       ├── 02_step_navigation.spec.js  # Step 이동 및 UI 상태 테스트
│       ├── 03_track_tools.spec.js      # 트랙별 스킬 체크 항목 테스트
│       └── 04_api_mock.spec.js         # API 목업 + 결과 렌더링 테스트
├── package.json            # 테스트 의존성 및 스크립트
├── playwright.config.js    # Playwright 설정
└── README.md
```

---

## 주요 기능

### 시나리오 A — 적성검사 (구현 완료)
1. **25문항 Yes/No 간접 행동 문항** — 3섹션(감각의 예민도·사고의 습관·가치와 비전)으로 구성, 행동·성향 기반으로 편향 최소화
2. **자동 이동** — 응답 클릭 후 다음 문항 자동 이동
3. **트랙별 정규화 점수 산출** — 최대 원점수 기반 동적 정규화 (0~100점)
4. **페르소나 블록** — 1순위+2순위 트랙 조합으로 16가지 페르소나(이름·특징·AI 시너지) 도출
5. **게임 RPG 클래스 카드 결과 화면**
   - 트랙 그래디언트 배경 + 다크 오버레이
   - 아키타입 칭호 (예: 경험 설계자, 코드 아키텍트)
   - 어피니티 바 애니메이션 (0 → 점수% 슬라이드)
   - lore 텍스트 (트랙별 1인칭 세계관 서술)
6. **"이런 사람이 돼" 직업 아이덴티티 카드** — 3개 직업 × 아이콘·제목·한 줄 설명
7. **작업물 쇼케이스** — 3개 그래디언트 카드 (해당 직군이 만드는 결과물 시각화)
8. **초봉 가이드** — 고용노동부·업계 평균 기준 신입 연봉 범위 표시
9. **2순위 경로** — 아키타입·lore + 직업·취업처·연봉 요약 카드
10. **Gemini AI 맞춤 코멘트** — 결과 기반 자동 생성 (graceful fallback 내장)
11. **결과 판정 로직** — 저점 / 전체 동점 등 비정상 케이스 분리 처리
12. **GAP 분석 연결** — 결과 화면에서 시나리오 B로 바로 이동

### 시나리오 B — GAP 분석 (구현 완료)
1. **기본 정보 입력** — 이름, 나이, 배경(전공/비전공), 투자 가능 기간
2. **목표 설정** — 취업 준비 / 자격증 취득 선택 + 트랙 선택
3. **현재 수준 체크** — 트랙별 핵심 툴 경험 수준 선택 (0~4단계)
4. **GAP 분석 결과** — Gemini API 분석 → 결과 화면 출력
5. **PDF 저장** — 브라우저 인쇄 기능으로 PDF 저장

---

## 트랙 목록 (9개)

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

---

## Gemini 프롬프트 구조

### GAP 분석 출력 JSON
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

## 자동화 테스트

### 환경 설치
```bash
npm install
npx playwright install chromium
```

### 테스트 실행
```bash
npm test                # headless 전체 실행 (CI/CD용)
npm run test:headed     # 브라우저 화면 보면서 실행
npm run test:ui         # Playwright UI 모드 (대화형)
npm run test:report     # 마지막 테스트 리포트 보기
```

### 테스트 현황

| 파일 | 내용 | 테스트 수 |
|---|---|---|
| `01_validation.spec.js` | 필수 입력값 누락 시 alert 발생 및 Step 이동 차단 | 9개 |
| `02_step_navigation.spec.js` | Step 이동, 인디케이터, 이전 버튼, 입력값 유지 | 10개 |
| `03_track_tools.spec.js` | 9개 트랙 스킬 항목 정확성, 툴 레벨 버튼 동작 | 16개 |
| `04_api_mock.spec.js` | API 목업으로 결과 렌더링 전 영역 검증, 에러 처리 | 34개 |
| **합계** | | **69개 (전체 통과)** |

### 테스트 주요 기법
- **Alert 인터셉트**: `page.addInitScript()`로 `window.alert` 오버라이드 → dialog deadlock 우회
- **API 목업**: `page.route('**/generativelanguage.googleapis.com/**')` → 실제 API 호출 없이 결과 렌더링 전체 검증
- **섹션별 선택자**: `#sec1 .btn-analyze`, `#sec2 .btn-analyze` 등으로 숨겨진 섹션 버튼 매칭 방지

---

## 사람 테스트 환경

- **테스트 가이드 (Notion)**: https://www.notion.so/3191f0564d87812a979df844db512a91
  - 접속 방법, API 키 설정, 트랙별 시나리오, 피드백 체크리스트 포함
- **테스트 결과 트래커 (Notion DB)**: 12개 시나리오 사전 등록, 결과/버그/의견 기록

---

## 개발 워크플로우

```
기능 개발/수정
    ↓
npm test  (로컬 자동화 테스트 69개 통과 확인)
    ↓
git push origin main
    ↓
GitHub Pages 자동 배포 (수 초 내)
    ↓
https://yulgoklee.github.io/sbs-gap-analysis/ 접속 확인
    ↓
멘토/상담사 사람 테스트 → 피드백 → 수정 반복
```

---

## 스크립트 로딩 순서

| 페이지 | 로딩 순서 |
|---|---|
| `gap-analysis.html` | `shared.js` → `constants.js` → `app.js` |
| `aptitude-test.html` | `shared.js` → `constants.js` → `aptitude-data.js` → `aptitude.js` |

---

## 버전 히스토리

### v1.7.0 (현재)

**토큰 최적화 및 코드 리팩토링**

- [x] **Gemini API 호출 최적화**
  - `aptitude.js` `callGemini()`에 `maxOutputTokens: 350` 추가 (기존 무제한 → 제한)
  - `app.js` `maxOutputTokens: 3000` → `1500` 축소
  - `buildUserInput()` 스테이지 문자열 압축 (`표준 2개월` → `/2M`, 구분자 `·` 등)
  - 적성검사 AI 점수 전송 범위: 전체 9트랙 → **상위 3트랙만** 전송
- [x] **공통 모듈 분리 — `js/shared.js` 신규**
  - `saveApiKey()`, `changeApiKey()`, API 키 로드 DOMContentLoaded 핸들러를 `shared.js`로 추출
  - `app.js`와 `aptitude.js`의 중복 코드 완전 제거
- [x] **트랙 데이터 단일화 — `constants.js` 통합**
  - `aptitude.js`의 `TRACKS` (아이콘·색상·lore 등) + `constants.js`의 `TRACK_AFTER_DATA` (직업·커리큘럼·연봉) → 단일 `TRACKS` 객체로 병합
  - `TRACK_KEYS` 배열 `constants.js`로 이전
  - `salary` 표현 통일: 문자열 → `{ min, max }` 객체
  - `app.js`의 `TRACK_NAMES` 제거 → `TRACKS[key].name` 직접 참조
- [x] **`aptitude.js` 데이터/로직 분리 — `js/aptitude-data.js` 신규**
  - `PERSONAS` (16가지 조합), `QUESTIONS` (25문항), `MAX_SCORES`, `SECTION_LABELS` → `aptitude-data.js`로 분리
  - `aptitude.js`는 퀴즈 흐름·점수 계산·결과 렌더링 **로직만** 보유

### v1.6.0
- [x] **적성검사 문항 재설계** — 30문항 → **25문항** 3섹션 (감각의 예민도·사고의 습관·가치와 비전)
- [x] **결과지 페르소나 블록 추가** — 1순위+2순위 조합 기반 16가지 페르소나 (이름·특징·AI 시너지)
- [x] **HTML 리팩토링** — `aptitude-test.html` 단일 파일 → `css/aptitude.css` + `js/aptitude.js` + `aptitude-test.html` 3파일 분리

### v1.5.0
- [x] **적성검사 문항 전면 개편** — 24문항 Likert → 30문항 Yes/No 간접 행동 문항
- [x] **결과 화면 게임 RPG 카드 디자인** — 트랙 그래디언트 + 다크 오버레이, 아키타입·lore 도입
  - 어피니티 바 애니메이션 (width 0 → 점수% 슬라이드)
  - 1순위/2순위 Dual Career 카드 구조
  - 초봉 가이드 (다크 배경 스트립)
- [x] **"이런 사람이 돼" 직업 아이덴티티 섹션** — 자격증 제거, 직업 카드 3종으로 대체
  - 각 직업: 아이콘 + 제목 + 한 줄 설명 (10대~30대 초반 공감 언어)
- [x] **작업물 쇼케이스** — 직군별 결과물을 그래디언트 카드 3종으로 시각화
- [x] **9개 트랙 전체 메타데이터 확장** — `archetype`, `lore`, `jobCards`, `works` 필드 추가

### v1.4.0
- [x] **시나리오 A (적성검사) 완성** — `aptitude-test.html` 신규 구현
  - 24문항 Likert 5점 척도 (성향·관심사 18 + 희망·열망 6)
  - 트랙별 정규화 점수(0~100) + SVG 레이더차트 + 점수 바
  - Top 트랙 진로 정보(자격증·직업·취업처) + Gemini AI 맞춤 코멘트
  - GAP 분석 연결 버튼
- [x] **적성검사 UX 개선**
  - 점수 클릭 400ms 후 자동 다음 문항 이동
  - 결과 판정 로직 강화 — 저점/전체동점 등 3종 케이스 분리 처리
- [x] **랜딩 페이지 (index.html)** — 시나리오 A/B 선택 메뉴
- [x] **파일 분리** — `gap-analysis.html`로 GAP 분석 독립

### v1.3.0
- [x] **자동화 테스트 69개 전체 통과** — Playwright E2E (01~04 spec)
- [x] **GitHub Pages 배포** — https://yulgoklee.github.io/sbs-gap-analysis/
- [x] **API 키 localStorage 영구 저장** — 기기당 최초 1회 입력 후 자동 유지
- [x] **🔑 키 변경 버튼** — 헤더 우측에 API 키 재설정 버튼 추가
- [x] **Notion 사람 테스트 환경** — 가이드 페이지 + 결과 트래커 DB 구축

### v1.2.0
- [x] **파일 구조 모듈화** — 단일 HTML에서 `css/`, `js/`, `data/` 디렉토리 분리
- [x] **JSON 데이터 분리** — 트랙별 커리큘럼을 개별 JSON 파일로 관리
- [x] **상수 파일 분리** — 트랙 메타데이터·상수를 `constants.js`로 독립
- [x] **Gemini 모델 변경** — `gemini-2.0-flash` → `gemini-2.5-flash-lite` (429 에러 해결)

### v1.1.0
- [x] **레이더 차트 (SVG)** — 취업/자격증 목표 수준 vs 현재 수준 6각형 시각화
- [x] **포트폴리오 참고 링크** — 트랙별 최대 3개 외부 링크 카드
- [x] **월별 학습 플래너** — 수업 로드맵을 캘린더 형식으로 시각화 (좌우 스크롤)
- [x] **프롬프트 대폭 개선** — 취업 시장 정보·자격증 기준·레이더 수치 계산 포함
- [x] **투자 기간 초과 안내** — 희망 기간보다 필요 기간이 길 경우 경고 메시지 표시
- [x] maxOutputTokens 4096으로 증가

### v1.0.0
- [x] 4단계 입력 폼 (기본정보 → 목표 → 수준체크 → 결과)
- [x] Gemini API 연동
- [x] GAP 분석 결과 화면 렌더링
- [x] PDF 저장 (브라우저 인쇄 방식, 한글 완벽 지원)
- [x] 반응형 (태블릿/PC 대응)

---

## 다음 버전 예정 작업

### v1.8.0 - 피드백 반영 및 기능 추가
- [ ] 사람 테스트 피드백 기반 UI/UX 개선
- [ ] API 에러 핸들링 강화
- [ ] 상담 이력 저장 기능
- [ ] 취업 공고 실시간 트렌드 연동

---

## 새 세션 시작 시 Claude에게 전달할 내용

```
이 README를 참고해서 작업을 이어가줘.
현재 버전: v1.7.0
배포 URL: https://yulgoklee.github.io/sbs-gap-analysis/
작업할 내용: [여기에 작업 내용 입력]
```

---

## 학원 정보

- **학원명**: SBS 아카데미 컴퓨터아트학원 수원점
- **전화**: 031-546-3644
- **GitHub**: https://github.com/yulgoklee/sbs-gap-analysis
- **배포**: https://yulgoklee.github.io/sbs-gap-analysis/
