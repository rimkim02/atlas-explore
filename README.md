# Atlas — Explore Design Resources

Atlas 웹 데모. 디자인 에셋 사이트를 저장 습관 그대로 두고, 다시 여는 순간만 빠르게 만드는 크롬 확장의 웹 버전입니다. 기획 문서(`Atlas_기획문서.md`)와 디자인 시스템(`atlas-design-system.html`)을 기준으로 구현했습니다.

## 열어보기

**`index.html`을 크롬에서 열면 됩니다.** 빌드 과정 없는 단일 HTML 파일이고, 외부 의존성은 Google Fonts(Roboto / DM Sans) 뿐입니다.

- Finder에서 `index.html` 더블클릭, 또는
- 터미널: `open index.html`

## 내려받기

- [github.com/rimkim02/atlas-explore](https://github.com/rimkim02/atlas-explore) 페이지에서 **Code → Download ZIP**
- 또는 `git clone https://github.com/rimkim02/atlas-explore.git`

## 구현 내용

| 영역 | 내용 |
|---|---|
| 언어 | 전체 영문 UI |
| 히어로 카피 | `Explore Design Resources` (기획문서 §6, v2) — DM Sans |
| Explore 3그룹 | Reference / Visual Asset Explore / Experimental Design Opensource (기획문서 §7-3). 사이트가 여러 그룹에 걸치면 우선순위 `Visual Asset Explore → Reference → Experimental Design Opensource`로 1개 그룹에 배치 |
| 태그 필터 | 22개 Type 태그(10개 색상군), AND 조합. `Web + Motion + Inspiration` = 세 태그 모두 보유한 사이트 |
| 즐겨찾기 (Favorites) | 카드의 ★ 버튼으로 지정. `localStorage`(`atlas.favorites`)에 도메인만 저장 — 브라우저 로컬 한정 (기획문서 §6, §9-1의 `favorite` 필드) |
| FAB | `FAB.svg`. **클릭** → Explore 그룹으로 스크롤 / **호버·포커스** → 즐겨찾기한 사이트가 버튼 스택으로 노출, 클릭 시 새 탭 (기획문서 §8) |
| 커서 | 사이트 전역 커서를 `custom cursor.svg`로 교체 |
| 로그인 | 헤더 우상단 `Sign up` 텍스트 버튼만 배치, 기능 미구현 |
| 데이터 | `Atlas - 시트1.csv`의 사이트 180개를 22개 태그로 분류 + 영문 설명 |

## 파일

```
index.html                 구현된 사이트 (단일 파일)
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
