# SVGO Options Guide

Detailed documentation for SVGO plugin options used for SVG optimization.

## Table of Contents

- [Document Cleanup Options](#document-cleanup-options)
- [Attribute Cleanup Options](#attribute-cleanup-options)
- [Element Removal Options](#element-removal-options)
- [Style Optimization Options](#style-optimization-options)
- [Group Optimization Options](#group-optimization-options)
- [Path/Transform Optimization Options](#pathtransform-optimization-options)
- [Legacy Compatibility Options](#legacy-compatibility-options)

---

## Document Cleanup Options

### removeDoctype
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `<!DOCTYPE>` declaration.

```xml
<!-- Input -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
<svg>...</svg>

<!-- Output (removeDoctype: true) -->
<svg>...</svg>
```

### removeXMLProcInst
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes XML declaration (`<?xml ?>`).

```xml
<!-- Input -->
<?xml version="1.0" encoding="UTF-8"?>
<svg>...</svg>

<!-- Output (removeXMLProcInst: true) -->
<svg>...</svg>
```

### removeComments
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes HTML comments.

```xml
<!-- Input -->
<svg>
  <!-- This is a comment -->
  <circle />
</svg>

<!-- Output (removeComments: true) -->
<svg><circle /></svg>
```

### removeMetadata
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `<metadata>` element.

```xml
<!-- Input -->
<svg>
  <metadata><rdf:RDF>...</rdf:RDF></metadata>
  <circle />
</svg>

<!-- Output (removeMetadata: true) -->
<svg><circle /></svg>
```

### removeEditorsNSData
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes editor-specific namespaces and attributes (Inkscape, Sketch, Illustrator, Figma, etc.).

```xml
<!-- Input -->
<svg xmlns:inkscape="http://www.inkscape.org" inkscape:version="1.0">
  <circle data-figma-node-id="123" />
</svg>

<!-- Output (removeEditorsNSData: true) -->
<svg><circle /></svg>
```

---

## Attribute Cleanup Options

### cleanupAttrs
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Cleans up consecutive whitespace in attribute values.

```xml
<!-- Input -->
<svg viewBox="0   0   24   24">...</svg>

<!-- Output (cleanupAttrs: true) -->
<svg viewBox="0 0 24 24">...</svg>
```

### cleanupIds
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes unreferenced IDs.

```xml
<!-- Input -->
<svg>
  <rect id="unused" />
  <circle id="used" />
  <use href="#used" />
</svg>

<!-- Output (cleanupIds: true) -->
<svg>
  <rect />
  <circle id="used" />
  <use href="#used" />
</svg>
```

### removeEmptyAttrs
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes empty attributes (`attr=""`).

```xml
<!-- Input -->
<svg class="" id=""><circle fill="" /></svg>

<!-- Output (removeEmptyAttrs: true) -->
<svg><circle /></svg>
```

### removeUnusedNS
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes unused namespaces.

```xml
<!-- Input -->
<svg xmlns="http://www.w3.org/2000/svg"><circle /></svg>

<!-- Output (removeUnusedNS: true) -->
<svg><circle /></svg>
```

### prefixIds
- **Type:** `boolean | string`
- **Default:** `false`
- **Description:** Adds a prefix to IDs and classes to prevent collisions. When `true`, uses `svgr_` as prefix. When a string is provided, uses that string as prefix.

```xml
<!-- Input -->
<svg>
  <defs><linearGradient id="grad1" /></defs>
  <circle fill="url(#grad1)" class="cls-1" />
</svg>

<!-- Output (prefixIds: "icon_") -->
<svg>
  <defs><linearGradient id="icon_grad1" /></defs>
  <circle fill="url(#icon_grad1)" class="icon_cls-1" />
</svg>
```

### cleanupNumericValues
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Optimizes numeric values.

```xml
<!-- Input -->
<svg opacity="0.5"><rect x="0px" y="0em" opacity="1.0" /></svg>

<!-- Output (cleanupNumericValues: true) -->
<svg opacity=".5"><rect x="0" y="0" opacity="1" /></svg>
```

---

## Element Removal Options

### removeTitle
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes `<title>` element.

```xml
<!-- Input -->
<svg><title>Icon</title><circle /></svg>

<!-- Output (removeTitle: true) -->
<svg><circle /></svg>
```

### removeDesc
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes `<desc>` element.

```xml
<!-- Input -->
<svg><desc>Icon description</desc><circle /></svg>

<!-- Output (removeDesc: true) -->
<svg><circle /></svg>
```

### removeHiddenElems
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes hidden elements (`display:none`, `visibility:hidden`, `opacity:0`).

```xml
<!-- Input -->
<svg>
  <rect display="none" />
  <circle visibility="hidden" />
  <path opacity="0" />
  <ellipse />
</svg>

<!-- Output (removeHiddenElems: true) -->
<svg><ellipse /></svg>
```

### removeEmptyContainers
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes empty container elements (`<g>`, `<defs>`, `<pattern>`, `<clipPath>`, `<mask>`, `<symbol>`).

```xml
<!-- Input -->
<svg><g></g><defs></defs><circle /></svg>

<!-- Output (removeEmptyContainers: true) -->
<svg><circle /></svg>
```

### removeEmptyText
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes empty `<text>` elements.

```xml
<!-- Input -->
<svg><text></text><circle /></svg>

<!-- Output (removeEmptyText: true) -->
<svg><circle /></svg>
```

### removeUselessDefs
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes unreferenced `<defs>` content.

```xml
<!-- Input -->
<svg>
  <defs>
    <linearGradient id="unused" />
    <linearGradient id="used" />
  </defs>
  <rect fill="url(#used)" />
</svg>

<!-- Output (removeUselessDefs: true) -->
<svg>
  <defs>
    <linearGradient id="used" />
  </defs>
  <rect fill="url(#used)" />
</svg>
```

---

## Style Optimization Options

### convertColors
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Optimizes color values.

```xml
<!-- Input -->
<svg>
  <circle fill="#ff0000" stroke="#ffffff" />
  <rect fill="rgb(0, 255, 0)" />
</svg>

<!-- Output (convertColors: true) -->
<svg>
  <circle fill="red" stroke="#fff" />
  <rect fill="lime" />
</svg>
```

### minifyStyles
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Minifies CSS in `<style>` blocks.

```xml
<!-- Input -->
<svg>
  <style>
    .cls-1 {
      fill: red;
    }
  </style>
</svg>

<!-- Output (minifyStyles: true) -->
<svg><style>.cls-1{fill:red;}</style></svg>
```

### inlineStyles
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Converts `<style>` block styles to inline style attributes.

```xml
<!-- Input -->
<svg>
  <style>.cls{fill:red;}</style>
  <circle class="cls" />
</svg>

<!-- Output (inlineStyles: true) -->
<svg><circle class="cls" style="fill:red" /></svg>
```

### mergeStyles
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Merges multiple `<style>` elements into one.

```xml
<!-- Input -->
<svg>
  <style>.a{fill:red;}</style>
  <style>.b{fill:blue;}</style>
</svg>

<!-- Output (mergeStyles: true) -->
<svg><style>.a{fill:red;}.b{fill:blue;}</style></svg>
```

---

## Group Optimization Options

### collapseGroups
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes unnecessary `<g>` groups without attributes. Groups with IDs are preserved.

```xml
<!-- Input -->
<svg><g><circle /></g></svg>

<!-- Output (collapseGroups: true) -->
<svg><circle /></svg>
```

### moveElemsAttrsToGroup
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Moves common attributes from child elements to parent group.

```xml
<!-- Input -->
<svg>
  <g>
    <rect fill="red" />
    <circle fill="red" />
  </g>
</svg>

<!-- Output (moveElemsAttrsToGroup: true) -->
<svg>
  <g fill="red">
    <rect />
    <circle />
  </g>
</svg>
```

### moveGroupAttrsToElems
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Distributes group's presentation attributes to child elements.

```xml
<!-- Input -->
<svg>
  <g fill="red">
    <rect />
    <circle />
  </g>
</svg>

<!-- Output (moveGroupAttrsToElems: true) -->
<svg>
  <g>
    <rect fill="red" />
    <circle fill="red" />
  </g>
</svg>
```

---

## Path/Transform Optimization Options

### convertPathData
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Optimizes path d attribute (removes unnecessary whitespace, cleans up numbers).

```xml
<!-- Input -->
<svg><path d="M 0 0 L 10 10 L 20 20" /></svg>

<!-- Output (convertPathData: true) -->
<svg><path d="M0 0L10 10L20 20" /></svg>
```

### convertTransform
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes unnecessary transforms (`translate(0,0)`, `rotate(0)`, `scale(1)`).

```xml
<!-- Input -->
<svg><rect transform="translate(0,0) rotate(0) scale(1)" /></svg>

<!-- Output (convertTransform: true) -->
<svg><rect /></svg>
```

### convertShapeToPath
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Converts basic shapes to `<path>` (rect, circle, ellipse, line, polygon, polyline).

```xml
<!-- Input -->
<svg>
  <rect x="0" y="0" width="10" height="10" />
  <circle cx="20" cy="20" r="5" />
</svg>

<!-- Output (convertShapeToPath: true) -->
<svg>
  <path d="M0,0h10v10h-10z" />
  <path d="M15,20a5,5 0 1 0 10,0a5,5 0 1 0 -10,0" />
</svg>
```

### mergePaths
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Merges consecutive `<path>` elements with the same attributes.

```xml
<!-- Input -->
<svg>
  <path d="M0,0L10,10" fill="red"/>
  <path d="M20,20L30,30" fill="red"/>
</svg>

<!-- Output (mergePaths: true) -->
<svg><path d="M0,0L10,10 M20,20L30,30" fill="red"/></svg>
```

---

## Legacy Compatibility Options

### removeXmlns
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `xmlns` attribute. Alias for `removeUnusedNS`.

### removeStyleAttr
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `style` attributes. Automatically disabled when `inlineStyles` is enabled.

### removeShapeRendering
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Removes `shape-rendering` attribute.

### removeDimensions
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes `width` and `height` attributes.

### removeViewBox
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Removes `viewBox` attribute.

---

## Usage Examples

### Basic Optimization

```javascript
import { optimizeSvg } from './svgo';

const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <!-- Icon -->
  <circle cx="12" cy="12" r="10" fill="#ff0000" />
</svg>`;

const result = optimizeSvg(svg);
// Output: <svg><circle cx="12" cy="12" r="10" fill="red"/></svg>
```

### Custom Options

```javascript
const result = optimizeSvg(svg, {
  removeComments: false,     // Keep comments
  convertColors: false,      // Disable color conversion
  prefixIds: 'myIcon_',      // Add prefix to IDs
  convertShapeToPath: true,  // Convert shapes to path
});
```
