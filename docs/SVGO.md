# SVGO (SVG Optimizer) 기능 정리

> 참고: https://github.com/svg/svgo, https://svgo.dev

## 개요

SVGO는 Node.js 기반의 SVG 최적화 도구입니다. 벡터 편집기(Figma, Illustrator, Sketch 등)에서 내보낸 SVG 파일의 불필요한 정보를 제거하여 파일 크기를 줄입니다.

---

## Preset-Default 플러그인 (33개)

기본으로 활성화되는 플러그인 목록입니다.

### 문서 정리

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `removeDoctype` | `<!DOCTYPE>` 선언 제거 | ⬜ |
| `removeXMLProcInst` | `<?xml ?>` 선언 제거 | ✅ |
| `removeComments` | HTML 주석 (`<!-- -->`) 제거 | ✅ |
| `removeMetadata` | `<metadata>` 요소 제거 | ⬜ |
| `removeEditorsNSData` | 편집기 네임스페이스 데이터 제거 (Inkscape, Sketch 등) | ⬜ |

### 속성 정리

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `cleanupAttrs` | 속성 값의 공백/줄바꿈 정리 | ⬜ |
| `cleanupIds` | 사용되지 않는 ID 제거, ID 축약 | ⬜ |
| `cleanupNumericValues` | 숫자 정밀도 최적화 (`0.5` → `.5`, `0px` → `0`) | ⬜ |
| `removeEmptyAttrs` | 빈 속성 제거 (`attr=""`) | ⬜ |
| `removeUnusedNS` | 사용되지 않는 네임스페이스 제거 | ✅ |

### 스타일 최적화

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `mergeStyles` | 여러 `<style>` 요소를 하나로 병합 | ⬜ |
| `inlineStyles` | `<style>` 블록을 인라인 style 속성으로 변환 | ⬜ |
| `minifyStyles` | CSS 코드 압축 | ⬜ |
| `convertColors` | 색상 값 최적화 (`#ff0000` → `red`, `rgb()` → `#hex`) | ⬜ |

### 요소 제거

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `removeUselessDefs` | 참조되지 않는 `<defs>` 내용 제거 | ⬜ |
| `removeHiddenElems` | 숨겨진 요소 제거 (`display:none`, `opacity:0` 등) | ⬜ |
| `removeEmptyText` | 빈 `<text>` 요소 제거 | ⬜ |
| `removeEmptyContainers` | 빈 컨테이너 요소 제거 (`<g>`, `<defs>`, `<pattern>`) | ⬜ |
| `removeDesc` | `<desc>` 요소 제거 | ⬜ |

### 도형/경로 변환

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `convertShapeToPath` | 기본 도형을 `<path>`로 변환 (`<rect>`, `<circle>`, `<polygon>`) | ⬜ |
| `convertEllipseToCircle` | 정원인 `<ellipse>`를 `<circle>`로 변환 | ⬜ |
| `convertPathData` | path의 d 속성 최적화 (상대/절대 좌표, 불필요한 명령 제거) | ⬜ |
| `convertTransform` | transform 속성 최적화 (행렬 계산, 단위 변환) | ⬜ |
| `mergePaths` | 연속된 `<path>` 요소 병합 | ⬜ |

### 그룹 최적화

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `collapseGroups` | 불필요한 `<g>` 그룹 제거 | ⬜ |
| `moveElemsAttrsToGroup` | 자식 요소의 공통 속성을 부모 그룹으로 이동 | ⬜ |
| `moveGroupAttrsToElems` | 그룹 속성을 자식 요소로 분배 | ⬜ |
| `removeNonInheritableGroupAttrs` | 그룹에서 상속 불가능한 속성 제거 | ⬜ |
| `removeUselessStrokeAndFill` | 렌더링에 영향 없는 stroke/fill 제거 | ⬜ |

### 정렬

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `sortAttrs` | 속성을 알파벳 순으로 정렬 | ⬜ |
| `sortDefsChildren` | `<defs>` 자식 요소 정렬 | ⬜ |

---

## 추가 플러그인 (Preset-Default 미포함)

필요 시 수동으로 활성화해야 하는 플러그인입니다.

### 속성 관련

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `removeAttrs` | 지정한 속성 제거 (정규식 지원) | ⬜ |
| `removeAttributesBySelector` | CSS 선택자로 속성 제거 | ⬜ |
| `addAttributesToSVGElement` | SVG 루트에 속성 추가 | ⬜ |
| `addClassesToSVGElement` | SVG 루트에 클래스 추가 | ⬜ |
| `prefixIds` | ID/클래스에 접두사 추가 (충돌 방지) | ⬜ |
| `cleanupEnableBackground` | 불필요한 `enable-background` 속성 제거 | ⬜ |

### 요소 관련

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `removeTitle` | `<title>` 요소 제거 | ⬜ |
| `removeXMLNS` | `xmlns` 속성 제거 (인라인 SVG용) | ✅ |
| `removeDimensions` | `width`/`height` 속성 제거 | ✅ |
| `removeViewBox` | `viewBox` 속성 제거 | ✅ |
| `removeScriptElement` | `<script>` 요소 제거 | ⬜ |
| `removeStyleElement` | `<style>` 요소 제거 | ⬜ |
| `removeOffCanvasPaths` | 캔버스 밖 경로 제거 | ⬜ |
| `removeRasterImages` | 래스터 이미지 (`<image>`) 제거 | ⬜ |
| `removeElementsByAttr` | 특정 속성을 가진 요소 제거 | ⬜ |

### 변환 관련

| 플러그인 | 기능 | 구현 |
|----------|------|:----:|
| `convertStyleToAttrs` | style 속성을 개별 SVG 속성으로 변환 | ⬜ |
| `convertOneStopGradients` | 단일 stop 그라디언트를 단색으로 변환 | ⬜ |
| `reusePaths` | 동일 path를 `<use>`로 재사용 | ⬜ |

---

## 현재 프로젝트 구현 현황

### 구현 완료 (6개)

```
✅ removeXMLProcInst - XML 선언 제거
✅ removeComments - 주석 제거
✅ removeUnusedNS (xmlns) - xmlns 속성 제거
✅ removeDimensions - width/height 제거 (icon 모드)
✅ removeViewBox - viewBox 제거 (옵션)
✅ style 속성 제거 (커스텀)
```

### 구현 우선순위

#### 높음 (자주 사용됨)
- [ ] `removeDoctype` - DOCTYPE 제거
- [ ] `removeMetadata` - 메타데이터 제거
- [ ] `removeEditorsNSData` - 편집기 데이터 제거
- [ ] `cleanupAttrs` - 속성 공백 정리
- [ ] `removeEmptyAttrs` - 빈 속성 제거
- [ ] `prefixIds` - ID 접두사 (충돌 방지)

#### 중간 (유용함)
- [ ] `cleanupIds` - ID 정리
- [ ] `cleanupNumericValues` - 숫자 최적화
- [ ] `convertColors` - 색상 최적화
- [ ] `removeHiddenElems` - 숨겨진 요소 제거
- [ ] `removeEmptyContainers` - 빈 컨테이너 제거
- [ ] `collapseGroups` - 그룹 축소

#### 낮음 (복잡함)
- [ ] `convertPathData` - path 데이터 최적화
- [ ] `mergePaths` - path 병합
- [ ] `convertTransform` - transform 최적화
- [ ] `convertShapeToPath` - 도형을 path로 변환

---

## 참고

- SVGO GitHub: https://github.com/svg/svgo
- SVGO 문서: https://svgo.dev
- 플러그인 목록: https://svgo.dev/docs/plugins/
