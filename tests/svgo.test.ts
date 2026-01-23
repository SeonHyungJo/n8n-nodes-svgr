/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it, expect } from 'vitest';
import { optimizeSvg } from '../nodes/Svgr/svgo';

describe('optimizeSvg', () => {
	describe('Document Cleanup Plugins', () => {
		it('should remove DOCTYPE declaration', () => {
			const svg = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"><svg><circle /></svg>';
			const result = optimizeSvg(svg, { removeDoctype: true });

			expect(result).not.toContain('DOCTYPE');
			expect(result).toContain('<svg');
		});

		it('should remove XML declaration', () => {
			const svg = '<?xml version="1.0" encoding="UTF-8"?><svg><circle /></svg>';
			const result = optimizeSvg(svg, { removeXMLProcInst: true });

			expect(result).not.toContain('<?xml');
			expect(result).toContain('<svg');
		});

		it('should remove HTML comments', () => {
			const svg = '<svg><!-- This is a comment --><circle /><!-- Another comment --></svg>';
			const result = optimizeSvg(svg, { removeComments: true });

			expect(result).not.toContain('<!--');
			expect(result).not.toContain('comment');
			expect(result).toContain('<circle');
		});

		it('should remove metadata element', () => {
			const svg = '<svg><metadata><rdf:RDF>...</rdf:RDF></metadata><circle /></svg>';
			const result = optimizeSvg(svg, { removeMetadata: true });

			expect(result).not.toContain('<metadata');
			expect(result).not.toContain('</metadata>');
			expect(result).toContain('<circle');
		});

		it('should remove editor namespace data (Inkscape)', () => {
			const svg = '<svg xmlns:inkscape="http://www.inkscape.org/namespaces" inkscape:version="1.0"><circle /></svg>';
			const result = optimizeSvg(svg, { removeEditorsNSData: true });

			expect(result).not.toContain('inkscape');
			expect(result).toContain('<circle');
		});

		it('should remove editor namespace data (Sketch)', () => {
			const svg = '<svg xmlns:sketch="http://www.bohemiancoding.com/sketch" sketch:type="MSPage"><circle /></svg>';
			const result = optimizeSvg(svg, { removeEditorsNSData: true });

			expect(result).not.toContain('sketch');
			expect(result).toContain('<circle');
		});

		it('should remove Figma data attributes', () => {
			const svg = '<svg data-figma-node-id="123"><circle /></svg>';
			const result = optimizeSvg(svg, { removeEditorsNSData: true });

			expect(result).not.toContain('data-figma');
			expect(result).toContain('<circle');
		});
	});

	describe('Attribute Cleanup Plugins', () => {
		it('should cleanup attribute whitespace', () => {
			const svg = '<svg viewBox="0   0   24   24"><circle /></svg>';
			const result = optimizeSvg(svg, { cleanupAttrs: true });

			expect(result).toContain('viewBox="0 0 24 24"');
		});

		it('should remove empty attributes', () => {
			const svg = '<svg class="" id=""><circle fill="" /></svg>';
			const result = optimizeSvg(svg, { removeEmptyAttrs: true });

			expect(result).not.toContain('class=""');
			expect(result).not.toContain('id=""');
		});

		it('should remove unused xmlns namespace', () => {
			const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle /></svg>';
			const result = optimizeSvg(svg, { removeUnusedNS: true });

			expect(result).not.toContain('xmlns=');
		});

		it('should prefix IDs when enabled', () => {
			const svg = '<svg><defs><linearGradient id="grad1" /></defs><circle fill="url(#grad1)" /></svg>';
			const result = optimizeSvg(svg, { prefixIds: 'icon_' });

			expect(result).toContain('id="icon_grad1"');
			expect(result).toContain('url(#icon_grad1)');
		});

		it('should prefix classes when prefixIds is enabled', () => {
			const svg = '<svg><circle class="cls-1 cls-2" /></svg>';
			const result = optimizeSvg(svg, { prefixIds: 'icon_' });

			expect(result).toContain('class="icon_cls-1 icon_cls-2"');
		});
	});

	describe('Element Removal Plugins', () => {
		it('should remove title element', () => {
			const svg = '<svg><title>My Icon</title><circle /></svg>';
			const result = optimizeSvg(svg, { removeTitle: true });

			expect(result).not.toContain('<title');
			expect(result).not.toContain('My Icon');
			expect(result).toContain('<circle');
		});

		it('should remove desc element', () => {
			const svg = '<svg><desc>Description of icon</desc><circle /></svg>';
			const result = optimizeSvg(svg, { removeDesc: true });

			expect(result).not.toContain('<desc');
			expect(result).not.toContain('Description');
			expect(result).toContain('<circle');
		});

		it('should remove empty containers', () => {
			const svg = '<svg><g></g><defs></defs><circle /></svg>';
			const result = optimizeSvg(svg, { removeEmptyContainers: true });

			expect(result).not.toContain('<g></g>');
			expect(result).not.toContain('<defs></defs>');
			expect(result).toContain('<circle');
		});

		it('should remove nested empty containers', () => {
			const svg = '<svg><g><g></g></g><circle /></svg>';
			const result = optimizeSvg(svg, { removeEmptyContainers: true });

			expect(result).not.toContain('<g>');
			expect(result).toContain('<circle');
		});

		it('should remove empty text elements', () => {
			const svg = '<svg><text></text><circle /></svg>';
			const result = optimizeSvg(svg, { removeEmptyText: true });

			expect(result).not.toContain('<text');
			expect(result).toContain('<circle');
		});
	});

	describe('Style Optimization Plugins', () => {
		it('should convert colors to shorter form', () => {
			const svg = '<svg><circle fill="#ff0000" stroke="#00ff00" /></svg>';
			const result = optimizeSvg(svg, { convertColors: true });

			expect(result).toContain('fill="red"');
			expect(result).toContain('stroke="lime"');
		});

		it('should shorten hex colors', () => {
			const svg = '<svg><circle fill="#ffffff" stroke="#000000" /></svg>';
			const result = optimizeSvg(svg, { convertColors: true });

			expect(result).toContain('fill="#fff"');
			expect(result).toContain('stroke="#000"');
		});

		it('should convert rgb to hex', () => {
			const svg = '<svg><circle fill="rgb(255, 0, 0)" /></svg>';
			const result = optimizeSvg(svg, { convertColors: true });

			expect(result).toContain('fill="red"');
		});

		it('should minify style content', () => {
			const svg = '<svg><style>  .cls-1 {   fill: red;   }  </style><circle /></svg>';
			const result = optimizeSvg(svg, { minifyStyles: true });

			expect(result).toContain('<style>.cls-1{fill:red;}</style>');
		});
	});

	describe('Numeric Value Cleanup', () => {
		it('should remove leading zeros', () => {
			const svg = '<svg opacity="0.5"><circle /></svg>';
			const result = optimizeSvg(svg, { cleanupNumericValues: true });

			expect(result).toContain('opacity=".5"');
		});

		it('should remove trailing zeros', () => {
			const svg = '<svg opacity="1.0"><circle /></svg>';
			const result = optimizeSvg(svg, { cleanupNumericValues: true });

			expect(result).toContain('opacity="1"');
		});

		it('should remove units from zero values', () => {
			const svg = '<svg><rect x="0px" y="0em" /></svg>';
			const result = optimizeSvg(svg, { cleanupNumericValues: true });

			expect(result).toContain('x="0"');
			expect(result).toContain('y="0"');
		});
	});

	describe('Group Optimization Plugins', () => {
		it('should collapse empty groups', () => {
			const svg = '<svg><g><circle /></g></svg>';
			const result = optimizeSvg(svg, { collapseGroups: true });

			expect(result).not.toContain('<g>');
			expect(result).toContain('<circle');
		});

		it('should preserve groups with attributes', () => {
			const svg = '<svg><g id="layer1"><circle /></g></svg>';
			const result = optimizeSvg(svg, { collapseGroups: true });

			// Groups with id should be preserved (they might be referenced)
			expect(result).toContain('<g id="layer1">');
		});
	});

	describe('Legacy Compatibility Options', () => {
		it('should remove style attribute', () => {
			const svg = '<svg style="background: red"><circle /></svg>';
			const result = optimizeSvg(svg, { removeStyleAttr: true });

			expect(result).not.toContain('style=');
		});

		it('should remove shape-rendering attribute', () => {
			const svg = '<svg shape-rendering="geometricPrecision"><circle /></svg>';
			const result = optimizeSvg(svg, { removeShapeRendering: true });

			expect(result).not.toContain('shape-rendering');
		});

		it('should remove dimensions', () => {
			const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><circle /></svg>';
			const result = optimizeSvg(svg, { removeDimensions: true });

			expect(result).not.toContain('width=');
			expect(result).not.toContain('height=');
			expect(result).toContain('viewBox');
		});

		it('should remove viewBox', () => {
			const svg = '<svg viewBox="0 0 24 24"><circle /></svg>';
			const result = optimizeSvg(svg, { removeViewBox: true });

			expect(result).not.toContain('viewBox');
		});
	});

	describe('Combined Optimizations', () => {
		it('should apply all document cleanup plugins', () => {
			const svg = `<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
<!-- Comment -->
<svg xmlns="http://www.w3.org/2000/svg">
  <metadata><rdf:RDF /></metadata>
  <circle cx="12" cy="12" r="10" />
</svg>`;

			const result = optimizeSvg(svg, {
				removeDoctype: true,
				removeXMLProcInst: true,
				removeComments: true,
				removeMetadata: true,
				removeUnusedNS: true,
			});

			expect(result).not.toContain('<?xml');
			expect(result).not.toContain('DOCTYPE');
			expect(result).not.toContain('<!--');
			expect(result).not.toContain('metadata');
			expect(result).not.toContain('xmlns=');
			expect(result).toContain('<circle');
		});

		it('should handle complex SVG with multiple optimizations', () => {
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <title>Icon</title>
  <desc>Description</desc>
  <g>
    <g>
      <circle fill="#ff0000" />
    </g>
  </g>
  <text></text>
</svg>`;

			const result = optimizeSvg(svg, {
				removeUnusedNS: true,
				removeDimensions: true,
				removeTitle: true,
				removeDesc: true,
				removeEmptyContainers: true,
				removeEmptyText: true,
				collapseGroups: true,
				convertColors: true,
			});

			expect(result).not.toContain('xmlns=');
			expect(result).not.toContain('width=');
			expect(result).not.toContain('height=');
			expect(result).not.toContain('<title');
			expect(result).not.toContain('<desc');
			expect(result).not.toContain('<g>');
			expect(result).not.toContain('<text');
			expect(result).toContain('fill="red"');
			expect(result).toContain('viewBox');
		});
	});

	describe('ID Cleanup Plugins', () => {
		it('should remove unused IDs', () => {
			const svg = '<svg><rect id="unused" /><circle id="used" /><use href="#used" /></svg>';
			const result = optimizeSvg(svg, { cleanupIds: true });

			expect(result).not.toContain('id="unused"');
			expect(result).toContain('id="used"');
		});

		it('should keep IDs referenced by url()', () => {
			const svg = '<svg><defs><linearGradient id="grad1" /></defs><rect fill="url(#grad1)" /></svg>';
			const result = optimizeSvg(svg, { cleanupIds: true });

			expect(result).toContain('id="grad1"');
		});
	});

	describe('Defs Cleanup Plugins', () => {
		it('should remove unreferenced defs content', () => {
			const svg = '<svg><defs><linearGradient id="unused" /><linearGradient id="used" /></defs><rect fill="url(#used)" /></svg>';
			const result = optimizeSvg(svg, { removeUselessDefs: true });

			expect(result).not.toContain('id="unused"');
			expect(result).toContain('id="used"');
		});
	});

	describe('Style Merge Plugins', () => {
		it('should merge multiple style elements', () => {
			const svg = '<svg><style>.a{fill:red;}</style><style>.b{fill:blue;}</style><circle /></svg>';
			const result = optimizeSvg(svg, { mergeStyles: true });

			expect(result).toContain('.a{fill:red;}.b{fill:blue;}');
			expect(result.match(/<style>/g)?.length).toBe(1);
		});

		it('should inline styles to elements', () => {
			const svg = '<svg><style>.cls{fill:red;}</style><circle class="cls" /></svg>';
			const result = optimizeSvg(svg, { inlineStyles: true });

			expect(result).toContain('style="fill:red"');
			expect(result).not.toContain('<style>');
		});
	});

	describe('Group Attribute Plugins', () => {
		it('should move common attributes to parent group', () => {
			const svg = '<svg><g><rect fill="red" /><circle fill="red" /></g></svg>';
			const result = optimizeSvg(svg, { moveElemsAttrsToGroup: true });

			expect(result).toContain('<g fill="red">');
		});

		it('should distribute group attributes to children', () => {
			const svg = '<svg><g fill="red"><rect /><circle /></g></svg>';
			const result = optimizeSvg(svg, { moveGroupAttrsToElems: true });

			expect(result).toContain('<rect fill="red"');
			expect(result).toContain('<circle fill="red"');
		});
	});

	describe('Path Optimization Plugins', () => {
		it('should optimize path data', () => {
			const svg = '<svg><path d="M 0 0 L 10 10 L 20 20" /></svg>';
			const result = optimizeSvg(svg, { convertPathData: true });

			expect(result).toContain('d="M0 0L10 10L20 20"');
		});

		it('should remove unnecessary transform', () => {
			const svg = '<svg><rect transform="translate(0,0)" /></svg>';
			const result = optimizeSvg(svg, { convertTransform: true });

			expect(result).not.toContain('transform');
		});

		it('should convert rect to path', () => {
			const svg = '<svg><rect x="0" y="0" width="10" height="10" /></svg>';
			const result = optimizeSvg(svg, { convertShapeToPath: true });

			expect(result).toContain('<path');
			expect(result).toContain('d="M0,0h10v10h-10z"');
			expect(result).not.toContain('<rect');
		});

		it('should convert circle to path', () => {
			const svg = '<svg><circle cx="10" cy="10" r="5" /></svg>';
			const result = optimizeSvg(svg, { convertShapeToPath: true });

			expect(result).toContain('<path');
			expect(result).not.toContain('<circle');
		});

		it('should convert line to path', () => {
			const svg = '<svg><line x1="0" y1="0" x2="10" y2="10" /></svg>';
			const result = optimizeSvg(svg, { convertShapeToPath: true });

			expect(result).toContain('<path');
			expect(result).toContain('d="M0,0L10,10"');
			expect(result).not.toContain('<line');
		});

		it('should merge consecutive paths with same attributes', () => {
			const svg = '<svg><path d="M0,0L10,10" fill="red"/><path d="M20,20L30,30" fill="red"/></svg>';
			const result = optimizeSvg(svg, { mergePaths: true });

			expect(result).toContain('d="M0,0L10,10 M20,20L30,30"');
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty SVG', () => {
			const svg = '<svg></svg>';
			const result = optimizeSvg(svg);

			expect(result).toBe('<svg></svg>');
		});

		it('should handle self-closing SVG', () => {
			const svg = '<svg />';
			const result = optimizeSvg(svg);

			expect(result).toBe('<svg />');
		});

		it('should preserve content when all plugins are disabled', () => {
			const svg = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><!-- comment --><circle /></svg>';
			const result = optimizeSvg(svg, {
				removeDoctype: false,
				removeXMLProcInst: false,
				removeComments: false,
				removeUnusedNS: false,
			});

			expect(result).toContain('<?xml');
			expect(result).toContain('xmlns=');
			expect(result).toContain('<!--');
		});
	});
});
