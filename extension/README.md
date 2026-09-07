# Atlas — Chrome Extension (FAB)

기획 문서 §8의 FAB 인터랙션을 크롬 확장(Manifest V3)으로 구현한 것입니다.

| 동작 | 결과 |
|---|---|
| **FAB 클릭** (또는 툴바 아이콘 클릭) | Explore 페이지를 새 탭으로 엽니다 (3그룹 + 태그 필터 + 세그먼트 네비) |
| **FAB 호버 / 포커스** | 즐겨찾기한 사이트가 버튼 스택으로 노출 → 클릭 시 새 탭 |
| Explore 페이지에서 ★ | 즐겨찾기 토글. `chrome.storage.local`에 저장되어 모든 탭의 FAB가 즉시 동기화 |

FAB는 모든 `http(s)` 페이지에 Shadow DOM으로 주입되어 사이트 CSS와 충돌하지 않습니다.

## 설치 (개발자 모드, 압축 해제된 확장)

1. 크롬에서 `chrome://extensions` 열기
2. 우상단 **개발자 모드(Developer mode)** 켜기
3. **압축해제된 확장 프로그램을 로드합니다(Load unpacked)** → 이 `extension/` 폴더 선택
4. 아무 웹페이지나 열면 우하단에 Atlas FAB가 나타납니다

업데이트하려면 `extension/` 내용을 교체하고 `chrome://extensions`에서 새로고침 아이콘을 누르세요.

## 파일

```
manifest.json      MV3 매니페스트 (permissions: storage)
background.js      service worker — 툴바 아이콘 클릭 시 Explore 열기
content.js         모든 페이지에 FAB 주입 (Shadow DOM), 즐겨찾기 스택
explore.html/.css/.js   FAB 클릭 시 열리는 Explore 페이지
                   (2열 히어로 + Download CTA + Starred 탭 + 스크롤 탑 버튼)
data.js            공유 데이터 — 180개 사이트, 태그 색상, 3그룹 정의
Image.png          히어로 우측 이미지
custom cursor.svg  Explore 페이지 전역 커서
icons/             16 / 48 / 128 px 아이콘 (Atlas 마크)
```

## 웹 데모와의 관계

- `../index.html` : 공개용 랜딩 + 라이브러리 (즐겨찾기는 `localStorage`)
- `extension/`    : 실제 확장. 즐겨찾기는 `chrome.storage.local`, FAB는 실제로 모든 페이지에 주입

`data.js`의 사이트 배열은 `../index.html`의 목록과 동일합니다. 목록을 바꾸면 두 곳 모두 반영해야 합니다.
