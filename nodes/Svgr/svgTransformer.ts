/**
 * SVG to JSX transformer utility
 * This is a lightweight implementation without external dependencies
 * for n8n Cloud compatibility
 */

export interface TransformOptions {
	icon?: boolean;
	typescript?: boolean;
	prettier?: boolean;
	dimensions?: boolean;
	componentName?: string;
	addFillCurrentColor?: boolean;
	removeViewBox?: boolean;
	svgo?: boolean;
}

/**
 * Convert HTML attributes to React JSX attributes
 */
function htmlToJsx(html: string): string {
	// Convert common HTML attributes to JSX
	const attributeMap: Record<string, string> = {
		class: 'className',
		for: 'htmlFor',
		'stroke-width': 'strokeWidth',
		'stroke-linecap': 'strokeLinecap',
		'stroke-linejoin': 'strokeLinejoin',
		'stroke-miterlimit': 'strokeMiterlimit',
		'stroke-dasharray': 'strokeDasharray',
		'stroke-dashoffset': 'strokeDashoffset',
		'fill-rule': 'fillRule',
		'fill-opacity': 'fillOpacity',
		'stroke-opacity': 'strokeOpacity',
		'clip-path': 'clipPath',
		'clip-rule': 'clipRule',
		'font-family': 'fontFamily',
		'font-size': 'fontSize',
		'font-weight': 'fontWeight',
		'text-anchor': 'textAnchor',
		'text-decoration': 'textDecoration',
		'dominant-baseline': 'dominantBaseline',
		'alignment-baseline': 'alignmentBaseline',
		'stop-color': 'stopColor',
		'stop-opacity': 'stopOpacity',
		'xlink:href': 'xlinkHref',
		'shape-rendering': 'shapeRendering',
	};

	let result = html;

	// Replace attributes
	for (const [htmlAttr, jsxAttr] of Object.entries(attributeMap)) {
		const regex = new RegExp(`\\b${htmlAttr.replace(':', '\\:')}=`, 'g');
		result = result.replace(regex, `${jsxAttr}=`);
	}

	// Convert style string to object (basic implementation)
	result = result.replace(/style="([^"]*)"/g, (_match, styleString) => {
		const styles = styleString
			.split(';')
			.filter((s: string) => s.trim())
			.map((s: string) => {
				const [key, value] = s.split(':').map((part: string) => part.trim());
				const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
				return `${camelKey}: "${value}"`;
			})
			.join(', ');
		return `style={{ ${styles} }}`;
	});

	return result;
}

/**
 * SVGO-like attribute removal
 */
function removeAttributes(svg: string, options: TransformOptions): string {
	let result = svg;

	// Remove xmlns
	result = result.replace(/\s+xmlns="[^"]*"/g, '');

	// Remove style attribute
	result = result.replace(/\s+style="[^"]*"/g, '');

	// Remove shape-rendering (will be converted to shapeRendering but we remove it)
	result = result.replace(/\s+shape-rendering="[^"]*"/g, '');
	result = result.replace(/\s+shapeRendering="[^"]*"/g, '');

	// Remove width and height (icon mode)
	if (options.icon || !options.dimensions) {
		result = result.replace(/\s+width="[^"]*"/g, '');
		result = result.replace(/\s+height="[^"]*"/g, '');
	}

	// Remove fill attribute if addFillCurrentColor is true (we'll add it back later)
	if (options.addFillCurrentColor) {
		result = result.replace(/\s+fill="[^"]*"/g, '');
	}

	// Remove viewBox if requested
	if (options.removeViewBox) {
		result = result.replace(/\s+viewBox="[^"]*"/g, '');
	}

	return result;
}

/**
 * Add fill="currentColor" to SVG element
 */
function addFillAttribute(svg: string): string {
	// Add fill="currentColor" to the SVG tag
	return svg.replace('<svg', '<svg fill="currentColor"');
}

/**
 * Format the component code with proper indentation
 */
function formatCode(code: string, options: TransformOptions): string {
	if (!options.prettier) {
		return code;
	}

	const lines = code.split('\n');
	let indentLevel = 0;
	const indentSize = 2;

	const formattedLines = lines
		.filter((line) => line.trim() !== '')
		.map((line) => {
		const trimmed = line.trim();

		// Decrease indent for closing braces/parentheses
		if (
			trimmed.startsWith('}') ||
			trimmed.startsWith(');') ||
			trimmed === ');' ||
			trimmed.startsWith('};')
		) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		// Decrease indent for closing JSX tags
		if (trimmed.startsWith('</')) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		const indented = ' '.repeat(indentLevel * indentSize) + trimmed;

		// Increase indent for opening braces
		if (trimmed.endsWith('{') || trimmed.includes('=> {') || trimmed.includes('((props:')) {
			indentLevel++;
		}

		// Increase indent for opening JSX tags (not self-closing)
		if (
			trimmed.startsWith('<') &&
			!trimmed.startsWith('</') &&
			!trimmed.endsWith('/>') &&
			!trimmed.includes('</')
		) {
			indentLevel++;
		}

		// Decrease indent after closing tags on same line
		if (trimmed.includes('</') && trimmed.endsWith('>') && !trimmed.endsWith('/>')) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		return indented;
	});

	return formattedLines.join('\n');
}

/**
 * Generate the React component code using custom template
 */
function generateComponentCode(svgJsx: string, options: TransformOptions): string {
	const componentName = options.componentName || 'SvgComponent';

	if (options.typescript) {
		// TypeScript template matching the user's original template
		return `import {SVGProps} from "react";
const ${componentName} = ((props: SVGProps<SVGSVGElement>) => {
  return (
${svgJsx}
  )
})
export default ${componentName};`;
	} else {
		// JavaScript template
		return `import * as React from "react";
const ${componentName} = ((props) => {
  return (
${svgJsx}
  )
})
export default ${componentName};`;
	}
}

/**
 * Transform SVG to React component
 */
export function transformSvg(svgCode: string, options: TransformOptions = {}): string {
	const {
		icon = true,
		typescript = false,
		prettier = true,
		dimensions = false,
		componentName = 'SvgComponent',
		addFillCurrentColor = false,
		removeViewBox = false,
		svgo = true,
	} = options;

	// Clean and process SVG
	let processedSvg = svgCode.trim();

	// Remove XML declaration if present
	processedSvg = processedSvg.replace(/<\?xml[^?]*\?>\s*/g, '');

	// Remove comments
	processedSvg = processedSvg.replace(/<!--[\s\S]*?-->/g, '');

	// Apply SVGO-like transformations
	if (svgo) {
		processedSvg = removeAttributes(processedSvg, {
			icon,
			dimensions,
			addFillCurrentColor,
			removeViewBox,
		});
	}

	// Add fill="currentColor" if requested
	if (addFillCurrentColor) {
		processedSvg = addFillAttribute(processedSvg);
	}

	// Convert HTML attributes to JSX
	processedSvg = htmlToJsx(processedSvg);

	// Add props spread to SVG tag
	if (!processedSvg.includes('{...props}')) {
		processedSvg = processedSvg.replace('<svg', '<svg {...props}');
	}

	// Indent SVG for proper formatting (remove empty lines)
	const svgLines = processedSvg.split('\n').filter((line) => line.trim() !== '');
	const indentedSvg = svgLines.map((line) => '    ' + line.trim()).join('\n');

	// Generate component code using template
	const componentCode = generateComponentCode(indentedSvg, {
		typescript,
		componentName,
	} as TransformOptions);

	// Format if prettier is enabled
	return formatCode(componentCode, { prettier } as TransformOptions);
}
