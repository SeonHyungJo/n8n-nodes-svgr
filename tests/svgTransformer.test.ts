/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it, expect } from 'vitest';
import { transformSvg } from '../nodes/Svgr/svgTransformer';

describe('transformSvg', () => {
	describe('Basic SVG Transformation', () => {
		it('should transform a simple SVG to React component', () => {
			const svg = '<svg><circle cx="12" cy="12" r="10" /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('import * as React from "react"');
			expect(result).toContain('const SvgComponent');
			expect(result).toContain('export default SvgComponent');
			expect(result).toContain('<circle cx="12" cy="12" r="10" />');
		});

		it('should add props spread to SVG element', () => {
			const svg = '<svg viewBox="0 0 24 24"><rect /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('{...props}');
			expect(result).toContain('viewBox="0 0 24 24"');
		});

		it('should remove XML declaration', () => {
			const svg = '<?xml version="1.0" encoding="UTF-8"?><svg><circle /></svg>';
			const result = transformSvg(svg);

			expect(result).not.toContain('<?xml');
			expect(result).toContain('<svg');
		});

		it('should remove HTML comments', () => {
			const svg = '<svg><!-- This is a comment --><circle /></svg>';
			const result = transformSvg(svg);

			expect(result).not.toContain('<!--');
			expect(result).not.toContain('This is a comment');
		});
	});

	describe('HTML to JSX Attribute Conversion', () => {
		it('should convert stroke-width to strokeWidth', () => {
			const svg = '<svg stroke-width="2"><line /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('strokeWidth="2"');
			expect(result).not.toContain('stroke-width');
		});

		it('should convert stroke-linecap to strokeLinecap', () => {
			const svg = '<svg stroke-linecap="round"><line /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('strokeLinecap="round"');
			expect(result).not.toContain('stroke-linecap');
		});

		it('should convert stroke-linejoin to strokeLinejoin', () => {
			const svg = '<svg stroke-linejoin="round"><path /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('strokeLinejoin="round"');
			expect(result).not.toContain('stroke-linejoin');
		});

		it('should convert fill-rule to fillRule', () => {
			const svg = '<svg fill-rule="evenodd"><path /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('fillRule="evenodd"');
			expect(result).not.toContain('fill-rule');
		});

		it('should convert clip-path to clipPath', () => {
			const svg = '<svg clip-path="url(#clip)"><rect /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('clipPath="url(#clip)"');
			expect(result).not.toContain('clip-path');
		});

		it('should convert xlink:href to xlinkHref', () => {
			const svg = '<svg><use xlink:href="#icon" /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('xlinkHref="#icon"');
			expect(result).not.toContain('xlink:href');
		});

		it('should handle multiple hyphenated attributes', () => {
			const svg = `<svg stroke-width="2" stroke-linecap="round" fill-opacity="0.5">
				<path />
			</svg>`;
			const result = transformSvg(svg);

			expect(result).toContain('strokeWidth="2"');
			expect(result).toContain('strokeLinecap="round"');
			expect(result).toContain('fillOpacity="0.5"');
		});
	});

	describe('Icon Mode', () => {
		it('should remove width and height when icon is true', () => {
			const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { icon: true });

			expect(result).not.toContain('width="24"');
			expect(result).not.toContain('height="24"');
			expect(result).toContain('viewBox="0 0 24 24"');
		});

		it('should keep width and height when icon is false and dimensions is true', () => {
			const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { icon: false, dimensions: true });

			expect(result).toContain('width="24"');
			expect(result).toContain('height="24"');
		});

		it('should remove width and height when both icon and dimensions are false', () => {
			const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { icon: false, dimensions: false });

			expect(result).not.toContain('width="24"');
			expect(result).not.toContain('height="24"');
		});
	});

	describe('TypeScript Support', () => {
		it('should generate TypeScript props type when typescript is true', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { typescript: true });

			expect(result).toContain('SVGProps');
			expect(result).toContain('from "react"');
			expect(result).toContain('props: SVGProps<SVGSVGElement>');
		});

		it('should not include TypeScript types when typescript is false', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { typescript: false });

			expect(result).toContain('(props)');
			expect(result).not.toContain('SVGProps');
		});
	});

	describe('Prettier Formatting', () => {
		it('should format code when prettier is true', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { prettier: true });

			// Check for proper indentation
			expect(result).toContain('\n');
			expect(result.split('\n').length).toBeGreaterThan(3);
		});

		it('should return unformatted code when prettier is false', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { prettier: false });

			// Basic check that code is present
			expect(result).toContain('SvgComponent');
		});
	});

	describe('Complex SVG Examples', () => {
		it('should handle a complex icon with multiple elements', () => {
			const svg = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
			`;
			const result = transformSvg(svg, { icon: true });

			expect(result).toContain('strokeWidth="2"');
			expect(result).toContain('strokeLinecap="round"');
			expect(result).toContain('strokeLinejoin="round"');
			expect(result).toContain('<circle');
			expect(result).toContain('<line');
			expect(result).not.toContain('width="24"');
		});

		it('should handle SVG with gradients and defs', () => {
			const svg = `
				<svg viewBox="0 0 100 100">
					<defs>
						<linearGradient id="grad1">
							<stop offset="0%" stop-color="red" stop-opacity="1" />
							<stop offset="100%" stop-color="blue" stop-opacity="1" />
						</linearGradient>
					</defs>
					<rect fill="url(#grad1)" width="100" height="100" />
				</svg>
			`;
			const result = transformSvg(svg);

			expect(result).toContain('stopColor="red"');
			expect(result).toContain('stopOpacity="1"');
			expect(result).toContain('<defs>');
			expect(result).toContain('linearGradient');
		});

		it('should handle SVG with paths and multiple attributes', () => {
			const svg = `
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill-rule="evenodd" clip-rule="evenodd" />
				</svg>
			`;
			const result = transformSvg(svg);

			expect(result).toContain('fillRule="evenodd"');
			expect(result).toContain('clipRule="evenodd"');
			expect(result).toContain('d="M12 2L2 7v10');
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty SVG', () => {
			const svg = '<svg></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('SvgComponent');
			expect(result).toContain('<svg');
		});

		it('should handle SVG with only whitespace content', () => {
			const svg = '<svg>   \n   </svg>';
			const result = transformSvg(svg);

			expect(result).toContain('SvgComponent');
		});

		it('should handle SVG with self-closing tags', () => {
			const svg = '<svg><circle cx="12" cy="12" r="10" /><line x1="0" y1="0" x2="10" y2="10" /></svg>';
			const result = transformSvg(svg);

			expect(result).toContain('<circle');
			expect(result).toContain('<line');
		});

		it('should handle SVG with nested groups', () => {
			const svg = `
				<svg>
					<g fill="red">
						<g stroke="blue">
							<circle cx="10" cy="10" r="5" />
						</g>
					</g>
				</svg>
			`;
			const result = transformSvg(svg);

			expect(result).toContain('<g');
			expect(result).toContain('fill="red"');
			expect(result).toContain('stroke="blue"');
		});
	});

	describe('Default Options', () => {
		it('should use default options when none provided', () => {
			const svg = '<svg width="24" height="24"><circle /></svg>';
			const result = transformSvg(svg);

			// Default: icon = true (removes dimensions)
			expect(result).not.toContain('width="24"');
			expect(result).not.toContain('height="24"');

			// Default: typescript = false
			expect(result).toContain('(props)');
			expect(result).not.toContain('SVGProps');

			// Default: prettier = true (formatted)
			expect(result.split('\n').length).toBeGreaterThan(3);
		});

		it('should allow partial options override', () => {
			const svg = '<svg width="24" height="24"><circle /></svg>';
			const result = transformSvg(svg, { typescript: true });

			// Overridden option
			expect(result).toContain('SVGProps');
			expect(result).toContain('from "react"');

			// Default options still apply
			expect(result).not.toContain('width="24"'); // icon: true by default
		});
	});

	describe('Real-world SVG Icons', () => {
		it('should transform GitHub icon', () => {
			const svg = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
				</svg>
			`;
			const result = transformSvg(svg, { icon: true });

			expect(result).toContain('fillRule="evenodd"');
			expect(result).toContain('clipRule="evenodd"');
			expect(result).not.toContain('width="24"');
			expect(result).toContain('SvgComponent');
		});
	});

	describe('New Features', () => {
		it('should use custom component name', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { componentName: 'CustomIcon' });

			expect(result).toContain('const CustomIcon');
			expect(result).toContain('export default CustomIcon');
		});

		it('should add fill="currentColor" when requested', () => {
			const svg = '<svg fill="#000000"><circle /></svg>';
			const result = transformSvg(svg, { addFillCurrentColor: true });

			expect(result).toContain('fill="currentColor"');
			expect(result).not.toContain('fill="#000000"');
		});

		it('should remove attributes when SVGO is enabled', () => {
			const svg = '<svg xmlns="http://www.w3.org/2000/svg" style="color: red;" shape-rendering="auto"><circle /></svg>';
			const result = transformSvg(svg, { svgo: true });

			expect(result).not.toContain('xmlns');
			expect(result).not.toContain('style');
			expect(result).not.toContain('shape-rendering');
			expect(result).not.toContain('shapeRendering');
		});

		it('should keep attributes when SVGO is disabled', () => {
			const svg = '<svg xmlns="http://www.w3.org/2000/svg" style="color: red;"><circle /></svg>';
			const result = transformSvg(svg, { svgo: false });

			expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
			expect(result).toContain('style');
		});

		it('should remove viewBox when requested', () => {
			const svg = '<svg viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { removeViewBox: true, svgo: true });

			expect(result).not.toContain('viewBox');
		});

		it('should generate TypeScript template with SVGProps', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				typescript: true,
				componentName: 'BaseComponent'
			});

			expect(result).toContain('import');
			expect(result).toContain('SVGProps');
			expect(result).toContain('export default BaseComponent');
		});
	});

	describe('jsxRuntime Option', () => {
		it('should use classic JSX runtime by default', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { jsxRuntime: 'classic' });

			expect(result).toContain('import * as React from "react"');
		});

		it('should use automatic JSX runtime without React import', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { jsxRuntime: 'automatic' });

			expect(result).not.toContain('import * as React');
		});

		it('should use automatic JSX runtime with TypeScript (type import only)', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { jsxRuntime: 'automatic', typescript: true });

			expect(result).toContain('import type { SVGProps }');
		});
	});

	describe('ref (forwardRef) Option', () => {
		it('should wrap component with forwardRef when ref is true', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { ref: true });

			expect(result).toContain('forwardRef');
			expect(result).toContain('ref={ref}');
		});

		it('should include Ref type with TypeScript', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { ref: true, typescript: true });

			expect(result).toContain('Ref');
			expect(result).toContain('forwardRef');
			expect(result).toContain('ref: Ref<SVGSVGElement>');
		});
	});

	describe('memo Option', () => {
		it('should wrap component with memo when memo is true', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { memo: true });

			expect(result).toContain('memo');
			expect(result).toContain('memo(');
		});

		it('should combine memo and forwardRef', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { memo: true, ref: true });

			expect(result).toContain('memo(forwardRef(');
		});
	});

	describe('replaceAttrValues Option', () => {
		it('should replace attribute values', () => {
			const svg = '<svg fill="#000"><circle fill="#000" /></svg>';
			const result = transformSvg(svg, {
				replaceAttrValues: { '#000': 'currentColor' },
				svgo: false
			});

			expect(result).toContain('fill="currentColor"');
			expect(result).not.toContain('fill="#000"');
		});

		it('should replace multiple attribute values', () => {
			const svg = '<svg fill="#000" stroke="#fff"><circle /></svg>';
			const result = transformSvg(svg, {
				replaceAttrValues: {
					'#000': 'currentColor',
					'#fff': 'transparent'
				},
				svgo: false
			});

			expect(result).toContain('fill="currentColor"');
			expect(result).toContain('stroke="transparent"');
		});
	});

	describe('svgProps Option', () => {
		it('should add custom props to SVG element', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				svgProps: { role: 'img' }
			});

			expect(result).toContain('role="img"');
		});

		it('should add multiple custom props', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				svgProps: {
					role: 'img',
					'aria-label': 'Icon'
				}
			});

			expect(result).toContain('role="img"');
			expect(result).toContain('aria-label="Icon"');
		});
	});

	describe('expandProps Option', () => {
		it('should add props spread at end by default', () => {
			const svg = '<svg viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { expandProps: 'end' });

			// Props spread should be at the end
			expect(result).toContain('{...props}');
		});

		it('should add props spread at start', () => {
			const svg = '<svg viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { expandProps: 'start' });

			// Props spread should be near the start
			expect(result).toContain('<svg {...props}');
		});

		it('should not add props spread when expandProps is false', () => {
			const svg = '<svg viewBox="0 0 24 24"><circle /></svg>';
			const result = transformSvg(svg, { expandProps: false });

			expect(result).not.toContain('{...props}');
		});
	});

	describe('titleProp Option', () => {
		it('should add title prop support', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { titleProp: true });

			expect(result).toContain('title');
			expect(result).toContain('titleId');
			expect(result).toContain('<title');
			expect(result).toContain('aria-labelledby');
		});

		it('should include title in props interface with TypeScript', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { titleProp: true, typescript: true });

			expect(result).toContain('title?: string');
			expect(result).toContain('titleId?: string');
		});
	});

	describe('descProp Option', () => {
		it('should add desc prop support', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { descProp: true });

			expect(result).toContain('desc');
			expect(result).toContain('descId');
			expect(result).toContain('<desc');
			expect(result).toContain('aria-describedby');
		});

		it('should include desc in props interface with TypeScript', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { descProp: true, typescript: true });

			expect(result).toContain('desc?: string');
			expect(result).toContain('descId?: string');
		});
	});

	describe('Combined Options', () => {
		it('should handle jsxRuntime, ref, memo, replaceAttrValues together', () => {
			const svg = '<svg fill="#000"><circle /></svg>';
			const result = transformSvg(svg, {
				jsxRuntime: 'automatic',
				typescript: true,
				ref: true,
				memo: true,
				replaceAttrValues: { '#000': 'currentColor' },
				svgo: false
			});

			expect(result).toContain('import type { SVGProps, Ref }');
			expect(result).toContain('memo(forwardRef(');
			expect(result).toContain('fill="currentColor"');
		});

		it('should handle svgProps, expandProps, titleProp, descProp together', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				svgProps: { role: 'img' },
				expandProps: 'start',
				titleProp: true,
				descProp: true,
				typescript: true
			});

			expect(result).toContain('role="img"');
			expect(result).toContain('title');
			expect(result).toContain('desc');
			expect(result).toContain('aria-labelledby');
			expect(result).toContain('aria-describedby');
		});

		it('should handle all options combined', () => {
			const svg = '<svg fill="#000"><circle /></svg>';
			const result = transformSvg(svg, {
				componentName: 'MyIcon',
				jsxRuntime: 'automatic',
				typescript: true,
				ref: true,
				memo: true,
				replaceAttrValues: { '#000': 'currentColor' },
				svgProps: { role: 'img' },
				titleProp: true,
				descProp: true,
				svgo: false
			});

			expect(result).toContain('const MyIcon');
			expect(result).toContain('memo(forwardRef(');
			expect(result).toContain('fill="currentColor"');
			expect(result).toContain('role="img"');
			expect(result).toContain('title');
			expect(result).toContain('desc');
		});
	});

	describe('native Option', () => {
		it('should convert SVG elements to React Native SVG components', () => {
			const svg = '<svg><circle cx="12" cy="12" r="10" /></svg>';
			const result = transformSvg(svg, { native: true });

			expect(result).toContain('<Svg');
			expect(result).toContain('<Circle');
			expect(result).toContain('react-native-svg');
		});

		it('should convert path elements to Path components', () => {
			const svg = '<svg><path d="M0 0 L10 10" /></svg>';
			const result = transformSvg(svg, { native: true });

			expect(result).toContain('<Svg');
			expect(result).toContain('<Path');
		});

		it('should convert multiple elements correctly', () => {
			const svg = '<svg><rect /><line /><ellipse /><polygon /></svg>';
			const result = transformSvg(svg, { native: true });

			expect(result).toContain('<Rect');
			expect(result).toContain('<Line');
			expect(result).toContain('<Ellipse');
			expect(result).toContain('<Polygon');
		});

		it('should convert gradient elements', () => {
			const svg = `<svg>
				<defs>
					<linearGradient id="grad">
						<stop offset="0%" />
					</linearGradient>
				</defs>
			</svg>`;
			const result = transformSvg(svg, { native: true });

			expect(result).toContain('<Defs');
			expect(result).toContain('<LinearGradient');
			expect(result).toContain('<Stop');
		});

		it('should import only used components from react-native-svg', () => {
			const svg = '<svg><circle /><path /></svg>';
			const result = transformSvg(svg, { native: true });

			expect(result).toContain('import { Circle, Path, Svg }');
		});

		it('should use SvgProps type with TypeScript', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { native: true, typescript: true });

			expect(result).toContain('SvgProps');
			expect(result).toContain('props: SvgProps');
		});

		it('should work with forwardRef', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { native: true, ref: true });

			expect(result).toContain('forwardRef');
			expect(result).toContain('ref={ref}');
		});

		it('should work with memo', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { native: true, memo: true });

			expect(result).toContain('memo(');
		});
	});

	describe('exportType Option', () => {
		it('should use default export by default', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { exportType: 'default' });

			expect(result).toContain('export default SvgComponent');
		});

		it('should use named export when specified', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, { exportType: 'named' });

			expect(result).toContain('export { SvgComponent }');
			expect(result).not.toContain('export default');
		});

		it('should use named export with custom component name', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				componentName: 'MyIcon',
				exportType: 'named'
			});

			expect(result).toContain('export { MyIcon }');
		});
	});

	describe('Combined native and exportType', () => {
		it('should handle native with named export', () => {
			const svg = '<svg><circle /></svg>';
			const result = transformSvg(svg, {
				native: true,
				exportType: 'named',
				componentName: 'NativeIcon'
			});

			expect(result).toContain('<Svg');
			expect(result).toContain('<Circle');
			expect(result).toContain('export { NativeIcon }');
			expect(result).toContain('react-native-svg');
		});

		it('should handle native with TypeScript, memo, and ref', () => {
			const svg = '<svg><path d="M0 0" /></svg>';
			const result = transformSvg(svg, {
				native: true,
				typescript: true,
				memo: true,
				ref: true,
				componentName: 'NativePathIcon'
			});

			expect(result).toContain('<Svg');
			expect(result).toContain('<Path');
			expect(result).toContain('memo(forwardRef(');
			expect(result).toContain('SvgProps');
			expect(result).toContain('Ref<Svg>');
		});
	});
});
