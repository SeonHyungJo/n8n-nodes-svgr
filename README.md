# n8n-nodes-svgr

This is an n8n community node that transforms SVG code into React components.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## ✅ n8n Cloud Compatible

This node has **no external dependencies** and is fully compatible with both:

- ✅ n8n Cloud
- ✅ Self-hosted n8n instances

## Features

- Transform SVG code into React components
- **Basic Options**: icon, dimensions, svgo, prettier, removeViewBox, addFillCurrentColor
- **Code Generation**: typescript, jsxRuntime (classic/automatic), exportType (default/named)
- **Component Wrapping**: ref (forwardRef), memo (React.memo)
- **Props Control**: expandProps, svgProps, replaceAttrValues
- **Accessibility**: titleProp, descProp (aria-labelledby, aria-describedby)
- **React Native**: native mode with react-native-svg support

## Documentation

- [Options Guide (English)](docs/OPTIONS_EN.md)
- [옵션 가이드 (한국어)](docs/OPTIONS_KO.md)
- [SVGO Options (English)](docs/SVGO_OPTIONS_EN.md)
- [SVGO 옵션 (한국어)](docs/SVGO_OPTIONS_KO.md)

## Installation

### n8n Cloud

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-svgr`
4. Click **Install**

### Self-Hosted n8n

Install via npm in your n8n installation directory:

```bash
npm install n8n-nodes-svgr
```

Or install through the n8n UI:

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-svgr`
4. Click **Install**

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the node:
   ```bash
   pnpm run build
   ```
4. Link to your n8n installation or copy `dist/` to your n8n's `node_modules/n8n-nodes-svgr/`

## Usage

1. Add the **SVGR** node to your workflow
2. Enter your SVG code in the **SVG Code** field
3. Set the **Component Name** (default: `SvgComponent`)
4. Configure options as needed (see [Options Guide](docs/OPTIONS_EN.md) for details)
5. Execute the node to get the transformed React component

### Quick Options Reference

| Option     | Default   | Description                            |
| ---------- | --------- | -------------------------------------- |
| icon       | `true`    | Remove width/height for scalable icons |
| typescript | `false`   | Generate TypeScript code               |
| jsxRuntime | `classic` | JSX runtime (`classic` or `automatic`) |
| ref        | `false`   | Wrap with forwardRef                   |
| memo       | `false`   | Wrap with React.memo                   |
| native     | `false`   | Generate React Native SVG code         |
| exportType | `default` | Export type (`default` or `named`)     |

### Example

**Input (SVG Code):**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
</svg>
```

**Output (reactCode):**

```jsx
import * as React from 'react';
const SvgComponent = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
		<path d="M12 2 2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
	</svg>
);
export default SvgComponent;
```

## Development

### Setup

```bash
pnpm install
```

### Development Mode

Start n8n with hot reload:

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

This compiles the TypeScript code to JavaScript. The node uses a custom SVG→JSX transformer with no external dependencies.

### Lint

```bash
pnpm run lint
pnpm run lint:fix
```

### Testing

Run unit tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage:

```bash
pnpm test -- --coverage
```

Test your node in n8n:

```bash
pnpm run dev
```

Then test your node in n8n workflows at http://localhost:5678

## Compatibility

| n8n Version | Compatibility |
| ----------- | ------------- |
| 1.0+        | ✅ Compatible |
| n8n Cloud   | ✅ Compatible |

**No external dependencies required!** This node uses a custom SVG→JSX transformer built specifically for n8n, making it fully compatible with n8n Cloud.

## Technical Details

This node uses a custom-built SVG→JSX transformer that:

- Converts HTML attributes to React JSX syntax (e.g., `class` → `className`, `stroke-width` → `strokeWidth`)
- Handles style attributes by converting them to React style objects
- Supports icon mode (removes dimensions for scalable icons)
- Generates TypeScript-compatible code when enabled
- Formats output with basic prettification
- Includes built-in SVGO optimization (27 plugins for SVG cleanup)

The transformer is built without external dependencies, making it fully compatible with n8n Cloud restrictions.

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)

## Version History

### 0.1.0

- Initial release
- Transform SVG to React components
- Configurable options (Icon, TypeScript, Prettier, Dimensions)
- Self-hosted n8n support

## License

[MIT](LICENSE.md)

## Author

**SeonHyungjo**

- Email: seonhyung.jo@gmail.com
- GitHub: [@SeonHyungjo](https://github.com/SeonHyungjo)

## Contributing

Issues and pull requests are welcome! Please feel free to contribute.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/SeonHyungjo/n8n-nodes-svgr/issues) page
2. Create a new issue if your problem isn't already listed
3. Visit the [n8n Community Forum](https://community.n8n.io/)
