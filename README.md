# Atlas — Explore Design Resources

Atlas 웹 데모 + 크롬 확장 프로그램. 디자인 에셋 사이트를 저장 습관 그대로 두고, 다시 여는 순간만 빠르게 만듭니다. 기획 문서(`Atlas_기획문서.md`)와 디자인 시스템(`atlas-design-system.html`)을 기준으로 구현했습니다.

| | 무엇 | 열기 |
|---|---|---|
| **웹 데모** | 공개용 랜딩 + 라이브러리 | `index.html` 을 크롬에서 열기 |
| **크롬 확장** | 실제 FAB — 모든 페이지에 주입 | `chrome://extensions` → 개발자 모드 → **Load unpacked** → `extension/` 폴더 ([자세히](extension/README.md)) |

## 웹 데모 열어보기

**`index.html`을 크롬에서 열면 됩니다.** 빌드 과정 없는 단일 HTML 파일이고, 외부 의존성은 Google Fonts(Roboto / DM Sans) 뿐입니다.

- Finder에서 `index.html` 더블클릭, 또는
- 터미널: `open index.html`

## 크롬 확장 설치

1. 크롬 `chrome://extensions` → 우상단 **개발자 모드** 켜기
2. **압축해제된 확장 프로그램을 로드합니다(Load unpacked)** → `extension/` 폴더 선택
3. 아무 페이지나 열면 우하단에 FAB 등장 · 클릭 = Explore 페이지 / 호버 = 즐겨찾기 스택

웹 데모의 CTA 버튼 **Get the Chrome extension** 도 이 폴더로 연결됩니다.

## 내려받기

- [github.com/rimkim02/atlas-explore](https://github.com/rimkim02/atlas-explore) 페이지에서 **Code → Download ZIP**
- 또는 `git clone https://github.com/rimkim02/atlas-explore.git`

## 구현 내용

| 영역 | 내용 |
|---|---|
| 언어 | 전체 영문 UI |
| 히어로 카피 | `Explore` / `Your Design Sites` (§6 v3) — DM Sans, ~58px, letter-spacing −4% |
| 히어로 배경 | ThreeUI `PredictiveArcCanvas` (data-pixel variant) — 라임 픽셀 아크 애니메이션. 최대 픽셀 opacity 60%, MIT 소스에서 vanilla로 이식 (`threeui-predictive-arc.js/.css`) |
| 히어로 이미지 | `Image.svg` — 텍스트/CTA 컨테이너 우측에 병렬, 하단이 Download/CTA 버튼 하단과 수평 정렬 |
| Explore 3그룹 | Reference / Visual Asset Explore / Experimental Design Opensource (§7-3). 여러 그룹에 걸치면 `Visual Asset Explore → Reference → Experimental` 우선순위로 1개 배치 |
| 인페이지 네비 | 세그먼트 컨트롤(pill, 60px, 선택 시 라임 채움): **All / Starred / Reference / Design Asset / Tools** |
| 최근 방문 (Recent) | 검색바 아래 이름 칩(라운드·stroke만) + 삭제 아이콘. 웹 데모 `localStorage`(`atlas.recent`) / 확장 `chrome.storage.local`, 최대 12개 |
| 태그 필터 | 22개 Type 태그(10개 색상군), AND 조합. `Web + Motion + Inspiration` = 세 태그 모두 보유 |
| CTA 버튼 | 히어로 설명 아래 — 메인 컬러(라임) pill, 호버 시 그라디언트/lift |
| 즐겨찾기 (Favorites) | 카드 ★ 버튼. 웹 데모 `localStorage`(`atlas.favorites`) / 확장 `chrome.storage.local` (모든 탭 동기화) |
| FAB | Atlas 마크 SVG 인라인. **클릭** → Explore / **호버·포커스** → 즐겨찾기 스택 (§8). 확장에서는 모든 페이지에 Shadow DOM 주입 |
| 카드 스타일 | corner radius 24px, 카드 간격 4px, 외곽 스트로크 없음. 상단에 웹사이트 썸네일(mShots 스크린샷, radius 16, 안쪽 여백 8) |
| 커서 | 사이트 전역 커서를 `custom cursor.svg`로 교체 (hotspot 좌측 팁) |
| 로그인 | 헤더 우상단 `Sign up` 텍스트 버튼만, 기능 미구현 |
| 데이터 | 사이트 180개를 22개 태그로 분류 + 영문 설명 (`index.html`·`extension/data.js`에 인라인) |

## 파일

```
index.html                   웹 데모
extension/                    크롬 확장 (MV3) — manifest, content script, Explore 페이지
threeui-predictive-arc.js/.css  히어로 배경 애니메이션 (ThreeUI PredictiveArcCanvas, MIT — 이식본)
Image.svg                    히어로 우측 이미지
custom cursor.svg            전역 커서
FAB.svg                      FAB 아이콘
Logo.svg                     헤더 로고
atlas-design-system.html     디자인 시스템 스펙
Atlas_기획문서.md            기획 문서
Atlas - 시트1.csv            원본 사이트 목록
```

## 서드파티

- 히어로 배경 애니메이션은 [@designcodeio/threeui](https://threeui.com) 의 `PredictiveArcCanvas` (data-pixel variant, MIT)에서 이식했습니다. 원본은 React 컴포넌트라 이 프로젝트(번들러 없는 정적 HTML)에서 쓸 수 없어 렌더러 + 마운트 로직만 vanilla로 옮겼고, 색을 라임(#DAFF48)으로, 최대 픽셀 불투명도를 60%로 조정했습니다. 상세는 `threeui-predictive-arc.js` 헤더 주석 참고.

## 참고

- 즐겨찾기·최근 방문은 이 브라우저(또는 확장)에만 저장되며 서버로 전송되지 않습니다.
- `Sign up`은 UI만 있고 동작하지 않습니다.
