# Atlas — 기획 문서

> 저장은 그대로, 다시 여는 순간만 1초로.

---

## 0. 문서 개요

이 문서는 Atlas 프로젝트의 문제 정의부터 리서치, 경쟁 분석, 서비스 정의, 기능 설계, 데이터/기술 구조, 디자인 시스템까지의 전체 기획 과정을 정리한 문서입니다. 애자일 + 디자인씽킹 방식으로 "가설 → 검증 → 학습"을 반복하며 진행했고, 진행 중 실제 데이터(설문·경쟁사 리서치·실제 사이트 목록)를 반영해 초기안에서 몇 차례 수정된 지점은 그대로 기록해두었습니다.

현재 웹 데모(`index.html`)와 크롬 확장 프로그램(`extension/`)이 모두 구현되어 GitHub(`rimkim02/atlas-explore`)에 있습니다. 구현 내용은 11절 참고.

---

## 1. 문제 가설 (Problem Hypothesis)

> **우리는** 실무 디자이너가 인스타·유튜브 등 여러 채널에서 발견한 디자인 에셋 사이트를 저장하지만, 작업을 재개하는 순간엔 그것을 다시 찾는 데 시간을 쓰고 있다고 믿는다.
> **만약** 저장 순간에 최소한의 카테고리를 남기고, 브라우저 안에서 그 카테고리로 즉시 접근할 수 있게 한다면,
> **작업 재개 시점의 재검색 빈도와 소요 시간이 눈에 띄게 줄어들 것이다.**
> 이것을 **Lo-fi 프로토타입 + 사용성 테스트**로 검증한다. (목표 지표: 카테고리 클릭 → 목표 사이트 도달 10초 이내)

---

## 2. 리서치 요약 (실무 디자이너 설문)

| 항목 | 결과 |
|---|---|
| 재검색 경험 있음 | 87.5% |
| 평소 상시 활용 사이트 수 | 평균 3~5개 |
| 가장 큰 불편 | "필요한 사이트를 찾는 데 시간이 오래 걸린다" |
| 저장 채널 상위 | Chrome 북마크, Pinterest |
| 필요 기능 1순위 | 작업 종류별 추천 사이트 |

※ 해당 리서치는 소규모 설문으로, 방향성 참고용이며 정량 결론 근거로는 표본 확대가 필요합니다.

### Empathy Map

- **Says**: "필요한 사이트를 찾는 데 시간이 오래 걸린다" / "어디에 저장했는지 기억나지 않는다"
- **Thinks**: "분명 저장해뒀는데... 이게 어디 있었지?" / "비슷한 사이트가 너무 많아서 뭘 써야 할지 모르겠다"
- **Does**: Chrome 북마크 + Pinterest 동시 사용, 3~5개 사이트 반복 재방문
- **Feels**: 저장했다는 안도감 → 못 찾았을 때의 답답함·시간 낭비에 대한 짜증

### 히든 니즈 (Latent Need)

- **표면적 니즈**: 빠르게 다시 찾고 싶다 (속도)
- **히든 니즈**: 이전 참고와의 일관성을 지키고, 내 디자인 결정에 대한 확신을 유지하고 싶다 (심리적 안정감)
- 근거: 피드백 반영(재작업) 단계에서 재검색 실패가 가장 고통스러웠던 이유는 시간 손실만이 아니라, 이전 결정과 다른 방향으로 흘러갈지 모른다는 불안감이었다 (소규모 설문 기반 추론 — 정성 인터뷰로 추가 검증 필요).

---

## 3. 문제 정의 (Define)

**POV**: 실무 디자이너는 작업에 착수하는 순간 필요한 에셋 사이트를 빠르게 열어야 한다. 왜냐하면 저장할 당시엔 있었던 "이건 무슨 작업용"이라는 맥락이 시간이 지나면 사라지기 때문이다.

**HMW**
1. 작업 종류별로 사이트를 즉시 열 수 있게 한다면?
2. 저장 순간 카테고리 태그를 자연스럽게 남기게 한다면?
3. 이전 결정과의 일관성을 유지하도록 도울 수 있다면?

**우선순위 (ICE 스코어)**

| HMW | Impact | Confidence | Ease | 우선순위 |
|---|---|---|---|---|
| 작업 종류별 즉시 열기 | 높음 | 높음 | 높음 | 1순위 |
| 저장 시 카테고리 태그 | 높음 | 중간 | 중간 | 2순위 |
| AI 상황별 사이트 추천 | 중간 | 중간 | 낮음 | 3순위 |
| 프로젝트별 워크스페이스 | 낮음 | 낮음 | 낮음 | 보류 |

---

## 4. 유저 세그먼트 & 페르소나

| 페르소나 | Need | Pain | Solution 원칙 |
|---|---|---|---|
| **레퍼런스 리서처형** | 넓게 비교하며 발산 | 비슷한 사이트가 너무 많아 선택 피로 | 최근 사용순 우선 노출로 선택지 축소 |
| **도구·방법론 애용형** | 특정 상황에만 필요한 낮은 빈도 자원 | 안 쓰다 보니 존재 자체를 잊음 | 저사용 카테고리 고정 노출로 망각 방지 |
| **에셋 헌터형** | 작업 중간에 소재를 빠르게 조달 | 찾으러 나가면 작업 흐름이 끊김 | 새 탭 오픈, 원 작업 탭 그대로 보존 |

---

## 5. 경쟁 분석

| 서비스 | 포지셔닝 | 우리와의 차이 |
|---|---|---|
| **Eagle** | 데스크탑 자산관리(DAM), 웹 북마크·AI 검색 포함 | 앱 설치 필요, 라이프타임 결제, 파일 중심 |
| **Bookmarkify** | 디자이너 전용 북마크 | 결국 저장 습관을 통째로 이전해야 함 |
| **Cosmos / Are.na** | 발견·탐색 중심 큐레이션 | 이미 아는 사이트를 빠르게 재방문하는 용도가 아님 |
| **Raindrop.io** | 범용 북마크 매니저 | 디자인 특화 아님 |

**차별화 포인트**: 기능 경쟁이 아니라 인터랙션 비용 경쟁. Eagle이 "이미 다 갖췄지만 무거운 창고"라면, Atlas는 "그 창고까지 갈 필요 없이 작업 중인 브라우저에서 손 뻗으면 닿는 서랍".

---

## 6. 서비스 정의

**서비스 목표 (의문형)**
> 디자이너가 에셋을 찾는 데 쓰는 시간을, 만드는 데 쓰는 시간으로 바꿀 수 있을까?

**개요**
> 브라우저를 벗어나지 않고 카테고리 버튼 하나로 필요한 에셋 사이트 묶음을 즉시 다시 여는 크롬 확장. 새 저장소로 이전할 필요 없이 기존 저장 습관 위에 그대로 얹혀 작동한다.

**히어로 카피 (변경 이력)**
- ~~Saving stays the same. Reopening takes a second.~~ (v1 — "재진입 속도" 강조)
- ~~Explore Design Resources~~ (v2 — "리소스 탐색"으로 톤 전환)
- **Explore / Your Design Sites** (v3, 현재 — "내가 쓰는 사이트"라는 개인화 톤. "Explore" 다음 줄바꿈, DM Sans)

**주요 기능**
- 카테고리 FAB 퀵오픈 — 버튼 한 번으로 Explore 페이지 오픈
- **즐겨찾기 (Favorites)**: 사이트를 개별로 즐겨찾기(★) 지정. FAB 호버 시 즐겨찾기 사이트가 버튼 스택으로 바로 노출되어 Explore 진입 없이 최단 경로 접근. Explore 상단 세그먼트 네비의 "Starred" 탭으로도 모아 보기
- **최근 방문 (Recent) — 신규**: 카드에서 연 사이트를 검색바 아래에 이름 칩으로 최근순 노출(최대 12개). 칩마다 개별 삭제 가능
- 다중 태그 조합 필터 + 3그룹 세그먼트 네비게이션 (7절)
- 새 탭 오픈 — 원 작업 탭 보존, 흐름 유지
- 저장 시 도메인 매핑 기반 자동 태그 추천 · 기존 저장 습관(북마크·Pinterest) 연동 (후속)

---

## 7. 카테고리 · 태그 구조 (설계 변경 이력 포함)

### 7-1. 초기안 — 단계 × 유형 구조 (v1, 프로토타입에 구현됨)

리서치/컨셉/제작 3단계 탭 안에 11개 유형(UI 레퍼런스, 폰트, 아이콘 등)을 배치하고, 사이트마다 Type 1개 + Stage 최대 2개를 태깅하는 구조. 저사용 카테고리(AI 도구·UX 방법론)는 모든 탭에 고정 노출.

- 장점: "지금 작업 단계"라는 맥락이 명확히 반영됨
- 한계: 실제 사이트 목록(180개)을 분류해보니 하나의 사이트가 단계보다는 **여러 성격을 동시에** 갖는 경우가 많아, 고정된 3단계 탭 구조로는 표현이 부족했음

### 7-2. 태그 체계 — Notion 스타일 다중 태그 (v2, 채택)

22개 Type 태그를 하나의 사이트에 여러 개 붙일 수 있는 다중 선택 구조로 전환. 단계(Stage) 축은 제거하고, 태그 자체를 10개 색상군으로 묶어 시각적으로 스캔하기 쉽게 구성.

**22개 태그 → 10개 색상군**

| 색상군 | 태그 |
|---|---|
| Gray (유틸리티) | Tool, Library |
| Brown (실체 에셋) | Mockup, 3D |
| Orange (UI 구성 요소) | Icon, Component |
| Yellow (스타일 토큰) | Color, Font |
| Green (제품 플랫폼) | Web, App, Ecommerce |
| Teal (행동·모션) | UX, Interaction, Motion |
| Blue (레퍼런스·비주얼) | Inspiration, Portfolio, Image |
| Purple (시스템·고급) | AI Design, Design System |
| Pink (크리에이티브 아이덴티티) | Branding, Graphic Design |
| Red (커뮤니케이션) | Email |

**실제 분류 데이터**: 실제 디자인 리소스 사이트 180개를 위 태그로 전량 분류 + 영문 설명 작성 완료. 목록은 `index.html`과 `extension/data.js`에 인라인(동일 데이터). 상위 태그는 Inspiration(102), Library(55), Web(53), App(21) 순.

> v1의 "지금 작업 단계"라는 통찰 자체는 여전히 유효합니다. 다만 이를 고정된 탭 구조가 아니라, 다중 태그 조합 필터(예: Web + Motion + Inspiration)로 사용자가 그때그때 조합해서 쓰는 방식으로 구현 방향을 바꿨습니다.

### 7-3. Explore 페이지 카드 그룹 — 3분류 (v3, 구현)

Explore 페이지에서는 22개 태그를 다시 3개의 상위 그룹 타이틀로 묶어 카드 섹션으로 보여줍니다. 태그는 필터링용 세부 단위로 유지하고, 이 3그룹은 페이지 전체의 큰 스캔 단위 역할을 합니다.

| 그룹 타이틀 | 성격 | 포함 태그 |
|---|---|---|
| **Reference** | 보고 참고하는 레퍼런스·사례 | Web, App, UX, Branding, Graphic Design, Portfolio, Inspiration, Ecommerce, Email |
| **Visual Asset Explore** | 실제로 다운로드해 작업에 쓰는 소재 | Icon, Font, Image, Color, Mockup, 3D |
| **Experimental Design Opensource** | 컴포넌트·모션·도구 등 코드/기술 기반 리소스 | Component, Design System, Motion, Interaction, Tool, AI Design, Library |

사이트가 여러 그룹에 걸치면 `Visual Asset Explore → Reference → Experimental Design Opensource` 우선순위로 한 그룹에 배치합니다. 현재 그룹별 사이트 수는 대략 Reference 103 / Visual Asset Explore 61 / Experimental Design Opensource 16 — Reference 편중이 있어 후속 조정 여지가 있습니다.

### 7-4. 인페이지 네비게이션 — 세그먼트 컨트롤 (구현)

카드 리스트 위에 3그룹을 전환하는 세그먼트 컨트롤을 둡니다. 라운드(pill) 스타일, 높이 60px, 선택된 탭은 브랜드 라임으로 채움.

| 탭 | 내용 |
|---|---|
| **All** | 3그룹 전체 |
| **Starred** | 즐겨찾기한 사이트만 |
| **Reference** | Reference 그룹 |
| **Design Asset** | Visual Asset Explore 그룹 |
| **Tools** | Experimental Design Opensource 그룹 |

검색과 태그 필터(AND 조합)는 선택된 탭과 무관하게 항상 함께 동작합니다.

### 7-5. 카드 디자인 (구현)

- 카드 상단에 웹사이트 썸네일(스크린샷) — 이미지 corner radius 16, 카드 안쪽 여백 8
- 썸네일 → 제목(18px) → 설명 → 태그 + 즐겨찾기(★). 썸네일과 제목이 링크(새 탭)
- 카드 corner radius 24, 카드 간 간격 4px, 외곽 스트로크 없음
- 썸네일은 WordPress mShots 스크린샷 서비스 사용 (API 키 불필요). 진짜 `og:image`는 서버 사이드 페치가 필요해 후속 과제 (12절)

---

## 8. FAB 인터랙션 명세 (구현)

FAB의 클릭과 호버 동작을 분리합니다. "탐색"(클릭)과 "최단 경로 재접근"(호버, 즐겨찾기)이라는 서로 다른 의도를 나눠서 처리하며, 즐겨찾기 기능이 곧 FAB 호버 스택의 데이터 소스입니다.

| 동작 | 웹 데모 (`index.html`) | 크롬 확장 |
|---|---|---|
| **클릭** | Explore 섹션으로 스크롤 | Explore 페이지를 새 탭으로 오픈 |
| **호버 / 포커스** | 즐겨찾기 사이트가 버튼 스택으로 노출 → 클릭 시 새 탭 | 동일 |

크롬 확장에서 FAB는 모든 `http(s)` 페이지에 Shadow DOM으로 주입되어 사이트 CSS와 충돌하지 않습니다. 툴바 아이콘 클릭도 Explore 페이지를 엽니다. FAB 아이콘 자체는 SVG를 인라인 임베드해 외부 파일 유실 문제를 없앴습니다.

---

## 9. 데이터 & 기술 구조

### 9-1. 로컬 데이터 (Chrome 확장)

확장 프로그램 자체의 저장 데이터는 `chrome.storage.local`(약 10MB, 필요 시 `unlimitedStorage`)에 JSON으로 저장합니다. 사용자 설정처럼 아주 가벼운 값만 필요할 경우 `chrome.storage.sync`(100KB 제한)를 병행 고려합니다.

```json
{
  "favorites": [
    { "n": "Dribbble", "u": "https://dribbble.com", "domain": "dribbble.com" }
  ],
  "recent": [
    { "n": "Awwwards", "u": "https://www.awwwards.com", "domain": "awwwards.com" }
  ]
}
```

- v1 스키마의 `type`(단일값) + `stage`(배열) → v2 태그 체계에 맞춰 `type` 배열화 + `stage` 제거 **반영 완료**.
- `favorites`: 즐겨찾기 목록. FAB 호버 스택의 데이터 소스. 확장은 `chrome.storage.local`(설치된 모든 탭에 `storage.onChanged`로 실시간 동기화), 웹 데모는 `localStorage` 키 `atlas.favorites`.
- `recent`: 최근 방문 이력(최근순, 최대 12개). 카드 썸네일/제목 클릭 시 기록. 확장 `chrome.storage.local` / 웹 데모 `localStorage` 키 `atlas.recent`.
- 확장 데이터 접근 권한은 `permissions: ["storage"]` 하나. 호스트 권한은 콘텐츠 스크립트 매치(`http(s)://*/*`)로 대체.

### 9-2. 인프라 (웹 데모/향후 계정 동기화용, 선택 확장)

| 영역 | 서비스 | 상태 |
|---|---|---|
| 코드 저장소 | GitHub — `rimkim02/atlas-explore` | **적용 (Private)** |
| DB | Supabase (Row Level Security) | 선택 확장 |
| 서버리스 API | Cloudflare Workers (og:image 페치 등) | 선택 확장 |
| 웹 배포 | Vercel (GitHub 연동 자동 배포) | 선택 확장 |
| 도메인 | Spaceship | 선택 확장 |

웹 데모는 현재 단일 HTML 파일로 저장소/로컬에서 바로 실행되고, 확장도 로컬에서 완결됩니다. Supabase 동기화·Vercel 배포·서버리스 API는 계정 기능이나 실제 og:image가 필요해지는 시점에 붙입니다.

---

## 10. 디자인 시스템

- **브랜드명**: Atlas
- **브랜드 컬러**: 라임 그린 `#DAFF48` (로고 기준, 강조 요소에만 제한적으로 사용 — primary CTA, 선택된 세그먼트 탭, FAB, 검색바 포커스, 즐겨찾기 활성)
- **테마**: 다크 UI — `#121214`(base) → `#1B1B1E`(surface) → `#232327`(elevated)
- **텍스트**: `#F5F5F7`(primary) / `#9A9AA2`(secondary) / `#6B6B72`(muted)
- **UI 폰트**: Roboto — 헤딩·버튼·라벨 500 / 본문 400 (두 굵기만 사용)
- **히어로 포인트 서체**: DM Sans Regular(400) — 히어로 문구("Explore / Your Design Sites") 전용. 데스크톱 ~58px, line-height 1.02, letter-spacing −4%. 나머지 UI는 전부 Roboto
- **태그**: Notion 스타일, corner radius 8px, 10개 색상군 (7-2 참고). 선택 시 스트로크 없이 흐림/선명(opacity)으로만 구분
- **카드**: corner radius 24px, 썸네일 corner radius 16px, 카드 간 간격 4px, 외곽 스트로크 없음
- **세그먼트 컨트롤**: pill, 높이 60px, 선택 탭 라임 채움
- **검색바**: corner radius 999px, 포커스 시 라임 스트로크
- **커서**: 사이트 전역 커스텀 커서 (`custom cursor.svg`)
- **divider**: 컨테이너 구분용 얇은 스트로크는 제거. 스티키 헤더–툴바 경계만 divider를 유지해 스크롤 콘텐츠가 사이로 비치지 않게 함
- 상세 스타일 가이드: `atlas-design-system.html` 참고

---

## 11. 구현 현황

웹 데모와 크롬 확장 두 산출물이 모두 구현되어 GitHub(`rimkim02/atlas-explore`, Private)에 있습니다.

### 웹 데모 — `index.html`

- 단일 HTML 파일, 전체 영문 UI, 빌드 불필요 (외부 의존성 Google Fonts만)
- 히어로 "Explore / Your Design Sites" + 옆에 이미지(인라인 임베드) + "Get the Chrome extension" CTA / "View on GitHub"
- 검색바 · 최근 방문 칩 · 22태그 AND 필터 · 세그먼트 네비(All / Starred / Reference / Design Asset / Tools) · 3그룹 카드(썸네일)
- 즐겨찾기 → `localStorage`. FAB(우하단): 클릭 = Explore 스크롤 / 호버 = 즐겨찾기 스택
- 전역 커스텀 커서. Sign up은 헤더 우상단 텍스트 버튼만 (기능 없음)

### 크롬 확장 — `extension/` (Manifest V3)

| 파일 | 역할 |
|---|---|
| `manifest.json` | MV3 매니페스트 (`permissions: ["storage"]`, 아이콘 16/48/128) |
| `content.js` | 모든 페이지에 FAB 주입 (Shadow DOM). 클릭 = Explore 새 탭 / 호버 = 즐겨찾기 스택 |
| `background.js` | service worker — 툴바 아이콘 클릭 시 Explore 오픈 |
| `explore.html` / `.css` / `.js` | FAB로 여는 Explore 페이지 (웹 데모와 동일 구성 + Download CTA + 스크롤 탑 버튼) |
| `data.js` | 180개 사이트 · 태그 색상 · 3그룹 정의 공유 |
| `icons/` | 16 / 48 / 128 px 아이콘 (Atlas 마크) |

- 즐겨찾기 · 최근 방문 → `chrome.storage.local`. `storage.onChanged`로 설치된 모든 탭이 실시간 동기화
- 설치: `chrome://extensions` → 개발자 모드 → "압축해제된 확장 프로그램을 로드합니다" → `extension/` 폴더

### 데이터

실제 디자인 리소스 사이트 180개를 22태그로 전량 분류 + 영문 설명 작성. `index.html`과 `extension/data.js`에 동일하게 인라인.

---

## 12. 다음 단계

1. 실동작 프로토타입으로 "카드 클릭 → 목표 사이트 도달 10초 이내" 지표 사용성 테스트 (5인 내외)
2. 카드 썸네일을 스크린샷 서비스 대신 실제 `og:image` 기반으로 (서버리스 함수 + 캐시)
3. 사용자가 직접 사이트를 추가하는 흐름 + 저장 시 도메인 매핑 자동 태그 추천 (현재는 180개 프리셋만)
4. 웹 데모 배포(Vercel), 필요 시 계정 간 동기화(Supabase)
5. Chrome Web Store 심사용 패키징 (아이콘·스토어 스크린샷·개인정보 처리방침)
6. `data.js` ↔ `index.html` 목록 이중 관리 해소 (빌드 스텝 또는 단일 소스)
7. 검증 결과에 따라 다음 가설 수립
