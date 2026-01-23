# SVGR 노드 옵션 가이드

n8n SVGR 노드에서 사용 가능한 모든 옵션에 대한 상세 설명입니다.

## 목차

- [기본 옵션](#기본-옵션)
- [코드 생성 옵션](#코드-생성-옵션)
- [컴포넌트 래핑 옵션](#컴포넌트-래핑-옵션)
- [Props 옵션](#props-옵션)
- [접근성 옵션](#접근성-옵션)
- [React Native 옵션](#react-native-옵션)

---

## 기본 옵션

### componentName
- **타입:** `string`
- **기본값:** `SvgComponent`
- **설명:** 생성되는 React 컴포넌트의 이름을 지정합니다.

```jsx
// componentName: "MyIcon"
const MyIcon = (props) => { ... }
export default MyIcon;
```

### icon
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** SVG에서 `width`와 `height` 속성을 제거하여 CSS로 크기를 조절할 수 있게 합니다.

### dimensions
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** 원본 SVG의 `width`와 `height` 속성을 유지합니다. `icon`이 `true`일 때는 무시됩니다.

### removeViewBox
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** SVG의 `viewBox` 속성을 제거합니다. 일반적으로 `viewBox`는 유지하는 것이 좋습니다.

### svgo
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** SVGO 최적화를 적용합니다. `xmlns`, `style`, `shape-rendering` 속성을 제거합니다.

### prettier
- **타입:** `boolean`
- **기본값:** `true`
- **설명:** 생성된 코드를 포맷팅합니다.

### addFillCurrentColor
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** SVG 요소에 `fill="currentColor"`를 추가합니다. 기존 `fill` 속성은 제거됩니다. CSS의 `color` 속성으로 아이콘 색상을 제어할 수 있게 됩니다.

```jsx
// addFillCurrentColor: true
<svg fill="currentColor" {...props}>
```

---

## 코드 생성 옵션

### typescript
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** TypeScript 코드를 생성합니다. `SVGProps<SVGSVGElement>` 타입이 적용됩니다.

```tsx
// typescript: true
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => { ... }
```

### jsxRuntime
- **타입:** `'classic' | 'automatic'`
- **기본값:** `classic`
- **설명:** JSX 런타임을 선택합니다.
  - `classic`: React import 필요 (React 16 이하)
  - `automatic`: React import 불필요 (React 17+)

```jsx
// jsxRuntime: 'classic'
import * as React from "react";

// jsxRuntime: 'automatic'
// (React import 없음)
```

### exportType
- **타입:** `'default' | 'named'`
- **기본값:** `default`
- **설명:** 컴포넌트 export 방식을 선택합니다.

```jsx
// exportType: 'default'
export default SvgComponent;

// exportType: 'named'
export { SvgComponent };
```

---

## 컴포넌트 래핑 옵션

### ref
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `forwardRef`로 컴포넌트를 감싸서 SVG 요소에 ref를 전달할 수 있게 합니다.

```tsx
// ref: true (TypeScript)
import { forwardRef, Ref, SVGProps } from "react";
const SvgComponent = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => {
  return <svg ref={ref} {...props}>...</svg>;
});
```

### memo
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `React.memo`로 컴포넌트를 감싸서 불필요한 리렌더링을 방지합니다.

```jsx
// memo: true
import { memo } from "react";
const SvgComponent = memo((props) => { ... });
```

### ref + memo 조합
두 옵션을 함께 사용하면 `memo(forwardRef(...))` 형태로 생성됩니다.

```jsx
const SvgComponent = memo(forwardRef((props, ref) => { ... }));
```

---

## Props 옵션

### expandProps
- **타입:** `'start' | 'end' | 'none'`
- **기본값:** `end`
- **설명:** `{...props}` 스프레드의 위치를 지정합니다.

```jsx
// expandProps: 'start'
<svg {...props} viewBox="0 0 24 24">

// expandProps: 'end'
<svg viewBox="0 0 24 24" {...props}>

// expandProps: 'none'
<svg viewBox="0 0 24 24">  // props 스프레드 없음
```

### svgProps
- **타입:** `{ name: string, value: string }[]`
- **설명:** SVG 요소에 추가할 커스텀 속성을 지정합니다.

```jsx
// svgProps: [{ name: "role", value: "img" }, { name: "aria-label", value: "Icon" }]
<svg role="img" aria-label="Icon" {...props}>
```

### replaceAttrValues
- **타입:** `{ from: string, to: string }[]`
- **설명:** SVG 내의 속성값을 대체합니다. 색상 값을 동적으로 변경할 때 유용합니다.

```jsx
// replaceAttrValues: [{ from: "#000", to: "currentColor" }]
// 입력: <path fill="#000" />
// 출력: <path fill="currentColor" />
```

---

## 접근성 옵션

### titleProp
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `title`과 `titleId` props를 추가하여 접근성을 향상시킵니다. `aria-labelledby` 속성이 자동으로 추가됩니다.

```tsx
// titleProp: true (TypeScript)
interface Props extends SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

const SvgComponent = ({ title, titleId, ...props }: Props) => {
  return (
    <svg aria-labelledby={titleId} {...props}>
      {title ? <title id={titleId}>{title}</title> : null}
      ...
    </svg>
  );
};

// 사용 예시
<SvgComponent title="홈 아이콘" titleId="home-icon-title" />
```

### descProp
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** `desc`와 `descId` props를 추가하여 접근성을 향상시킵니다. `aria-describedby` 속성이 자동으로 추가됩니다.

```tsx
// descProp: true (TypeScript)
interface Props extends SVGProps<SVGSVGElement> {
  desc?: string;
  descId?: string;
}

const SvgComponent = ({ desc, descId, ...props }: Props) => {
  return (
    <svg aria-describedby={descId} {...props}>
      {desc ? <desc id={descId}>{desc}</desc> : null}
      ...
    </svg>
  );
};

// 사용 예시
<SvgComponent desc="메인 페이지로 이동하는 홈 아이콘" descId="home-icon-desc" />
```

---

## React Native 옵션

### native
- **타입:** `boolean`
- **기본값:** `false`
- **설명:** React Native SVG 호환 코드를 생성합니다. `react-native-svg` 라이브러리를 사용합니다.

```jsx
// native: true
import { Circle, Path, Svg } from "react-native-svg";

const SvgComponent = (props) => {
  return (
    <Svg {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M0 0 L10 10" />
    </Svg>
  );
};
```

**지원하는 React Native SVG 컴포넌트:**
- `Svg`, `Circle`, `Ellipse`, `G`, `Text`, `TSpan`, `TextPath`
- `Path`, `Polygon`, `Polyline`, `Line`, `Rect`
- `Use`, `Image`, `Symbol`, `Defs`
- `LinearGradient`, `RadialGradient`, `Stop`
- `ClipPath`, `Pattern`, `Mask`, `Marker`
- `ForeignObject`, `Filter` 등

### native + typescript 조합

```tsx
// native: true, typescript: true
import { Circle, Svg } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SvgComponent = (props: SvgProps) => {
  return (
    <Svg {...props}>
      <Circle cx="12" cy="12" r="10" />
    </Svg>
  );
};
```

---

## 옵션 조합 예시

### 웹 프로덕션용 아이콘

```
componentName: "HomeIcon"
typescript: true
jsxRuntime: "automatic"
memo: true
ref: true
icon: true
svgo: true
addFillCurrentColor: true
```

### 접근성이 필요한 아이콘

```
componentName: "AccessibleIcon"
typescript: true
titleProp: true
descProp: true
svgProps: [{ name: "role", value: "img" }]
```

### React Native 앱용 아이콘

```
componentName: "MobileIcon"
native: true
typescript: true
memo: true
icon: true
```

---

## 참고 자료

- [SVGR 공식 문서](https://react-svgr.com/docs/options/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
