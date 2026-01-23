# SVGR Node Options Guide

A comprehensive guide to all options available in the n8n SVGR node.

## Table of Contents

- [Basic Options](#basic-options)
- [Code Generation Options](#code-generation-options)
- [Component Wrapping Options](#component-wrapping-options)
- [Props Options](#props-options)
- [Accessibility Options](#accessibility-options)
- [React Native Options](#react-native-options)

---

## Basic Options

### componentName

- **Type:** `string`
- **Default:** `SvgComponent`
- **Description:** Specifies the name of the generated React component.

```jsx
// componentName: "MyIcon"
const MyIcon = (props) => { ... }
export default MyIcon;
```

### icon

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `width` and `height` attributes from SVG, allowing size control via CSS.

### dimensions

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Preserves the original SVG's `width` and `height` attributes. Ignored when `icon` is `true`.

### removeViewBox

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes the `viewBox` attribute from SVG. Generally, keeping `viewBox` is recommended.

### svgo

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Applies SVGO optimizations. Removes `xmlns`, `style`, and `shape-rendering` attributes.

### prettier

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Formats the generated code with proper indentation.

### addFillCurrentColor

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Adds `fill="currentColor"` to the SVG element. Existing `fill` attributes are removed. This allows controlling icon color via CSS `color` property.

```jsx
// addFillCurrentColor: true
<svg fill="currentColor" {...props}>
```

---

## Code Generation Options

### typescript

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Generates TypeScript code with `SVGProps<SVGSVGElement>` type.

```tsx
// typescript: true
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => { ... }
```

### jsxRuntime

- **Type:** `'classic' | 'automatic'`
- **Default:** `classic`
- **Description:** Selects the JSX runtime.
  - `classic`: Requires React import (React 16 and below)
  - `automatic`: No React import needed (React 17+)

```jsx
// jsxRuntime: 'classic'
import * as React from 'react';

// jsxRuntime: 'automatic'
// (No React import)
```

### exportType

- **Type:** `'default' | 'named'`
- **Default:** `default`
- **Description:** Selects the component export method.

```jsx
// exportType: 'default'
export default SvgComponent;

// exportType: 'named'
export { SvgComponent };
```

---

## Component Wrapping Options

### ref

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Wraps the component with `forwardRef` to allow passing a ref to the SVG element.

```tsx
// ref: true (TypeScript)
import { forwardRef, Ref, SVGProps } from 'react';
const SvgComponent = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => {
	return (
		<svg ref={ref} {...props}>
			...
		</svg>
	);
});
```

### memo

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Wraps the component with `React.memo` to prevent unnecessary re-renders.

```jsx
// memo: true
import { memo } from "react";
const SvgComponent = memo((props) => { ... });
```

### ref + memo combination

When both options are enabled, the component is generated as `memo(forwardRef(...))`.

```jsx
const SvgComponent = memo(forwardRef((props, ref) => { ... }));
```

---

## Props Options

### expandProps

- **Type:** `'start' | 'end' | 'none'`
- **Default:** `end`
- **Description:** Specifies the position of `{...props}` spread.

```jsx
// expandProps: 'start'
<svg {...props} viewBox="0 0 24 24">

// expandProps: 'end'
<svg viewBox="0 0 24 24" {...props}>

// expandProps: 'none'
<svg viewBox="0 0 24 24">  // No props spread
```

### svgProps

- **Type:** `{ name: string, value: string }[]`
- **Description:** Specifies custom attributes to add to the SVG element.

```jsx
// svgProps: [{ name: "role", value: "img" }, { name: "aria-label", value: "Icon" }]
<svg role="img" aria-label="Icon" {...props}>
```

### replaceAttrValues

- **Type:** `{ from: string, to: string }[]`
- **Description:** Replaces attribute values within the SVG. Useful for dynamically changing color values.

```jsx
// replaceAttrValues: [{ from: "#000", to: "currentColor" }]
// Input: <path fill="#000" />
// Output: <path fill="currentColor" />
```

---

## Accessibility Options

### titleProp

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Adds `title` and `titleId` props for improved accessibility. The `aria-labelledby` attribute is automatically added.

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

// Usage
<SvgComponent title="Home Icon" titleId="home-icon-title" />;
```

### descProp

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Adds `desc` and `descId` props for improved accessibility. The `aria-describedby` attribute is automatically added.

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

// Usage
<SvgComponent desc="Home icon that navigates to main page" descId="home-icon-desc" />;
```

---

## React Native Options

### native

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Generates React Native SVG compatible code using the `react-native-svg` library.

```jsx
// native: true
import { Circle, Path, Svg } from 'react-native-svg';

const SvgComponent = (props) => {
	return (
		<Svg {...props}>
			<Circle cx="12" cy="12" r="10" />
			<Path d="M0 0 L10 10" />
		</Svg>
	);
};
```

**Supported React Native SVG Components:**

- `Svg`, `Circle`, `Ellipse`, `G`, `Text`, `TSpan`, `TextPath`
- `Path`, `Polygon`, `Polyline`, `Line`, `Rect`
- `Use`, `Image`, `Symbol`, `Defs`
- `LinearGradient`, `RadialGradient`, `Stop`
- `ClipPath`, `Pattern`, `Mask`, `Marker`
- `ForeignObject`, `Filter`, and more

### native + typescript combination

```tsx
// native: true, typescript: true
import { Circle, Svg } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => {
	return (
		<Svg {...props}>
			<Circle cx="12" cy="12" r="10" />
		</Svg>
	);
};
```

---

## Option Combination Examples

### Production Web Icons

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

### Accessible Icons

```
componentName: "AccessibleIcon"
typescript: true
titleProp: true
descProp: true
svgProps: [{ name: "role", value: "img" }]
```

### React Native App Icons

```
componentName: "MobileIcon"
native: true
typescript: true
memo: true
icon: true
```

---

## References

- [SVGR Official Documentation](https://react-svgr.com/docs/options/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
