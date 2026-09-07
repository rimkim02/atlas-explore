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
| 히어로 카피 | `Explore Design Resources` (기획문서 §6, v2) — DM Sans |
| Explore 3그룹 | Reference / Visual Asset Explore / Experimental Design Opensource (기획문서 §7-3). 사이트가 여러 그룹에 걸치면 우선순위 `Visual Asset Explore → Reference → Experimental Design Opensource`로 1개 그룹에 배치 |
| 인페이지 네비 | 카드 리스트 위 세그먼트 컨트롤(라운드): **All / Reference / Design Asset / Tools** — 각 탭이 3그룹에 매핑되어 해당 섹션만 노출 |
| 태그 필터 | 22개 Type 태그(10개 색상군), AND 조합. `Web + Motion + Inspiration` = 세 태그 모두 보유한 사이트 |
| CTA 버튼 | 히어로 설명 아래 `Get the Chrome extension` — 메인 컬러(라임) 필, 호버 시 lift + glow + 화살표 이동 |
| 즐겨찾기 (Favorites) | 카드의 ★ 버튼으로 지정. 웹 데모는 `localStorage`(`atlas.favorites`), 확장은 `chrome.storage.local` (기획문서 §6, §9-1 `favorite` 필드) |
| FAB | `FAB.svg`. **클릭** → Explore / **호버·포커스** → 즐겨찾기 버튼 스택, 클릭 시 새 탭 (기획문서 §8). 확장에서는 모든 페이지에 Shadow DOM으로 주입 |
| 카드 스타일 | corner radius 32px, 카드 간격 8px |
| 커서 | 사이트 전역 커서를 `custom cursor.svg`로 교체 (35×41, hotspot 좌측 팁) |
| 로그인 | 헤더 우상단 `Sign up` 텍스트 버튼만 배치, 기능 미구현 |
| 데이터 | `Atlas - 시트1.csv`의 사이트 180개를 22개 태그로 분류 + 영문 설명 |

## 파일

```
index.html                 웹 데모 (단일 파일)
extension/                  크롬 확장 (MV3) — manifest, content script, Explore 페이지
custom cursor.svg          전역 커서
FAB.svg                    FAB 아이콘
Logo.svg                   헤더 로고
atlas-design-system.html   디자인 시스템 스펙
Atlas_기획문서.md          기획 문서
Atlas - 시트1.csv          원본 사이트 목록
```

## 참고

- 즐겨찾기는 이 브라우저에만 저장되며 서버로 전송되지 않습니다.
- `Sign up`은 UI만 있고 동작하지 않습니다.
