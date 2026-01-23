# SVGO 옵션 가이드

SVG 최적화를 위한 SVGO 플러그인 옵션에 대한 상세 설명입니다.

## 목차

- [문서 정리 옵션](#문서-정리-옵션)
- [속성 정리 옵션](#속성-정리-옵션)
- [요소 제거 옵션](#요소-제거-옵션)
- [스타일 최적화 옵션](#스타일-최적화-옵션)
- [그룹 최적화 옵션](#그룹-최적화-옵션)
- [경로/변환 최적화 옵션](#경로변환-최적화-옵션)
- [기존 호환 옵션](#기존-호환-옵션)

---

## 문서 정리 옵션

### removeDoctype
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `<!DOCTYPE>` 선언을 제거합니다.

```xml
<!-- 입력 -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
<svg>...</svg>

<!-- 출력 (removeDoctype: true) -->
<svg>...</svg>
```

### removeXMLProcInst
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** XML 선언 (`<?xml ?>`)을 제거합니다.

```xml
<!-- 입력 -->
<?xml version="1.0" encoding="UTF-8"?>
<svg>...</svg>

<!-- 출력 (removeXMLProcInst: true) -->
<svg>...</svg>
```

### removeComments
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** HTML 주석을 제거합니다.

```xml
<!-- 입력 -->
<svg>
  <!-- 이것은 주석입니다 -->
  <circle />
</svg>

<!-- 출력 (removeComments: true) -->
<svg><circle /></svg>
```

### removeMetadata
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `<metadata>` 요소를 제거합니다.

```xml
<!-- 입력 -->
<svg>
  <metadata><rdf:RDF>...</rdf:RDF></metadata>
  <circle />
</svg>

<!-- 출력 (removeMetadata: true) -->
<svg><circle /></svg>
```

### removeEditorsNSData
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 편집기(Inkscape, Sketch, Illustrator, Figma 등)의 네임스페이스와 속성을 제거합니다.

```xml
<!-- 입력 -->
<svg xmlns:inkscape="http://www.inkscape.org" inkscape:version="1.0">
  <circle data-figma-node-id="123" />
</svg>

<!-- 출력 (removeEditorsNSData: true) -->
<svg><circle /></svg>
```

---

## 속성 정리 옵션

### cleanupAttrs
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 속성 값 내의 연속 공백을 단일 공백으로 정리합니다.

```xml
<!-- 입력 -->
<svg viewBox="0   0   24   24">...</svg>

<!-- 출력 (cleanupAttrs: true) -->
<svg viewBox="0 0 24 24">...</svg>
```

### cleanupIds
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 참조되지 않는 ID를 제거합니다.

```xml
<!-- 입력 -->
<svg>
  <rect id="unused" />
  <circle id="used" />
  <use href="#used" />
</svg>

<!-- 출력 (cleanupIds: true) -->
<svg>
  <rect />
  <circle id="used" />
  <use href="#used" />
</svg>
```

### removeEmptyAttrs
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 빈 속성(`attr=""`)을 제거합니다.

```xml
<!-- 입력 -->
<svg class="" id=""><circle fill="" /></svg>

<!-- 출력 (removeEmptyAttrs: true) -->
<svg><circle /></svg>
```

### removeUnusedNS
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 사용되지 않는 네임스페이스를 제거합니다.

```xml
<!-- 입력 -->
<svg xmlns="http://www.w3.org/2000/svg"><circle /></svg>

<!-- 출력 (removeUnusedNS: true) -->
<svg><circle /></svg>
```

### prefixIds
- **타입:** `boolean | string`
- **기본값:** `false`
- **설명:** ID와 클래스에 접두사를 추가하여 충돌을 방지합니다. `true`이면 `svgr_` 접두사가 사용되고, 문자열을 지정하면 해당 문자열이 접두사로 사용됩니다.

```xml
<!-- 입력 -->
<svg>
  <defs><linearGradient id="grad1" /></defs>
  <circle fill="url(#grad1)" class="cls-1" />
</svg>

<!-- 출력 (prefixIds: "icon_") -->
<svg>
  <defs><linearGradient id="icon_grad1" /></defs>
  <circle fill="url(#icon_grad1)" class="icon_cls-1" />
</svg>
```

### cleanupNumericValues
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 숫자 값을 최적화합니다.

```xml
<!-- 입력 -->
<svg opacity="0.5"><rect x="0px" y="0em" opacity="1.0" /></svg>

<!-- 출력 (cleanupNumericValues: true) -->
<svg opacity=".5"><rect x="0" y="0" opacity="1" /></svg>
```

---

## 요소 제거 옵션

### removeTitle
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `<title>` 요소를 제거합니다.

```xml
<!-- 입력 -->
<svg><title>아이콘</title><circle /></svg>

<!-- 출력 (removeTitle: true) -->
<svg><circle /></svg>
```

### removeDesc
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `<desc>` 요소를 제거합니다.

```xml
<!-- 입력 -->
<svg><desc>아이콘 설명</desc><circle /></svg>

<!-- 출력 (removeDesc: true) -->
<svg><circle /></svg>
```

### removeHiddenElems
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 숨겨진 요소(`display:none`, `visibility:hidden`, `opacity:0`)를 제거합니다.

```xml
<!-- 입력 -->
<svg>
  <rect display="none" />
  <circle visibility="hidden" />
  <path opacity="0" />
  <ellipse />
</svg>

<!-- 출력 (removeHiddenElems: true) -->
<svg><ellipse /></svg>
```

### removeEmptyContainers
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 빈 컨테이너 요소(`<g>`, `<defs>`, `<pattern>`, `<clipPath>`, `<mask>`, `<symbol>`)를 제거합니다.

```xml
<!-- 입력 -->
<svg><g></g><defs></defs><circle /></svg>

<!-- 출력 (removeEmptyContainers: true) -->
<svg><circle /></svg>
```

### removeEmptyText
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 빈 `<text>` 요소를 제거합니다.

```xml
<!-- 입력 -->
<svg><text></text><circle /></svg>

<!-- 출력 (removeEmptyText: true) -->
<svg><circle /></svg>
```

### removeUselessDefs
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 참조되지 않는 `<defs>` 내용을 제거합니다.

```xml
<!-- 입력 -->
<svg>
  <defs>
    <linearGradient id="unused" />
    <linearGradient id="used" />
  </defs>
  <rect fill="url(#used)" />
</svg>

<!-- 출력 (removeUselessDefs: true) -->
<svg>
  <defs>
    <linearGradient id="used" />
  </defs>
  <rect fill="url(#used)" />
</svg>
```

---

## 스타일 최적화 옵션

### convertColors
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 색상 값을 최적화합니다.

```xml
<!-- 입력 -->
<svg>
  <circle fill="#ff0000" stroke="#ffffff" />
  <rect fill="rgb(0, 255, 0)" />
</svg>

<!-- 출력 (convertColors: true) -->
<svg>
  <circle fill="red" stroke="#fff" />
  <rect fill="lime" />
</svg>
```

### minifyStyles
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `<style>` 블록의 CSS를 압축합니다.

```xml
<!-- 입력 -->
<svg>
  <style>
    .cls-1 {
      fill: red;
    }
  </style>
</svg>

<!-- 출력 (minifyStyles: true) -->
<svg><style>.cls-1{fill:red;}</style></svg>
```

### inlineStyles
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `<style>` 블록의 스타일을 인라인 style 속성으로 변환합니다.

```xml
<!-- 입력 -->
<svg>
  <style>.cls{fill:red;}</style>
  <circle class="cls" />
</svg>

<!-- 출력 (inlineStyles: true) -->
<svg><circle class="cls" style="fill:red" /></svg>
```

### mergeStyles
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 여러 `<style>` 요소를 하나로 병합합니다.

```xml
<!-- 입력 -->
<svg>
  <style>.a{fill:red;}</style>
  <style>.b{fill:blue;}</style>
</svg>

<!-- 출력 (mergeStyles: true) -->
<svg><style>.a{fill:red;}.b{fill:blue;}</style></svg>
```

---

## 그룹 최적화 옵션

### collapseGroups
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 속성이 없는 불필요한 `<g>` 그룹을 제거합니다. ID가 있는 그룹은 유지됩니다.

```xml
<!-- 입력 -->
<svg><g><circle /></g></svg>

<!-- 출력 (collapseGroups: true) -->
<svg><circle /></svg>
```

### moveElemsAttrsToGroup
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 자식 요소들의 공통 속성을 부모 그룹으로 이동합니다.

```xml
<!-- 입력 -->
<svg>
  <g>
    <rect fill="red" />
    <circle fill="red" />
  </g>
</svg>

<!-- 출력 (moveElemsAttrsToGroup: true) -->
<svg>
  <g fill="red">
    <rect />
    <circle />
  </g>
</svg>
```

### moveGroupAttrsToElems
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 그룹의 프리젠테이션 속성을 자식 요소로 분배합니다.

```xml
<!-- 입력 -->
<svg>
  <g fill="red">
    <rect />
    <circle />
  </g>
</svg>

<!-- 출력 (moveGroupAttrsToElems: true) -->
<svg>
  <g>
    <rect fill="red" />
    <circle fill="red" />
  </g>
</svg>
```

---

## 경로/변환 최적화 옵션

### convertPathData
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** path의 d 속성을 최적화합니다 (불필요한 공백 제거, 숫자 정리).

```xml
<!-- 입력 -->
<svg><path d="M 0 0 L 10 10 L 20 20" /></svg>

<!-- 출력 (convertPathData: true) -->
<svg><path d="M0 0L10 10L20 20" /></svg>
```

### convertTransform
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 불필요한 transform을 제거합니다 (`translate(0,0)`, `rotate(0)`, `scale(1)`).

```xml
<!-- 입력 -->
<svg><rect transform="translate(0,0) rotate(0) scale(1)" /></svg>

<!-- 출력 (convertTransform: true) -->
<svg><rect /></svg>
```

### convertShapeToPath
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 기본 도형을 `<path>`로 변환합니다 (rect, circle, ellipse, line, polygon, polyline).

```xml
<!-- 입력 -->
<svg>
  <rect x="0" y="0" width="10" height="10" />
  <circle cx="20" cy="20" r="5" />
</svg>

<!-- 출력 (convertShapeToPath: true) -->
<svg>
  <path d="M0,0h10v10h-10z" />
  <path d="M15,20a5,5 0 1 0 10,0a5,5 0 1 0 -10,0" />
</svg>
```

### mergePaths
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 같은 속성을 가진 연속된 `<path>` 요소를 병합합니다.

```xml
<!-- 입력 -->
<svg>
  <path d="M0,0L10,10" fill="red"/>
  <path d="M20,20L30,30" fill="red"/>
</svg>

<!-- 출력 (mergePaths: true) -->
<svg><path d="M0,0L10,10 M20,20L30,30" fill="red"/></svg>
```

---

## 기존 호환 옵션

### removeXmlns
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `xmlns` 속성을 제거합니다. `removeUnusedNS`의 별칭입니다.

### removeStyleAttr
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `style` 속성을 제거합니다. `inlineStyles`가 활성화되면 자동으로 비활성화됩니다.

### removeShapeRendering
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** `shape-rendering` 속성을 제거합니다.

### removeDimensions
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `width`와 `height` 속성을 제거합니다.

### removeViewBox
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `viewBox` 속성을 제거합니다.

---

## 사용 예시

### 기본 최적화

```javascript
import { optimizeSvg } from './svgo';

const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <!-- 아이콘 -->
  <circle cx="12" cy="12" r="10" fill="#ff0000" />
</svg>`;

const result = optimizeSvg(svg);
// 출력: <svg><circle cx="12" cy="12" r="10" fill="red"/></svg>
```

### 사용자 정의 옵션

```javascript
const result = optimizeSvg(svg, {
  removeComments: false,     // 주석 유지
  convertColors: false,      // 색상 변환 비활성화
  prefixIds: 'myIcon_',      // ID에 접두사 추가
  convertShapeToPath: true,  // 도형을 path로 변환
});
```
