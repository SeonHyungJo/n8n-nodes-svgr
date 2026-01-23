/**
 * SVG to JSX transformer utility
 * This is a lightweight implementation without external dependencies
 * for n8n Cloud compatibility
 */

import { optimizeSvg, type SvgoOptions } from './svgo';

export interface TransformOptions {
	icon?: boolean;
	typescript?: boolean;
	prettier?: boolean;
	dimensions?: boolean;
	componentName?: string;
	addFillCurrentColor?: boolean;
	removeViewBox?: boolean;
	svgo?: boolean;
	svgoOptions?: Partial<SvgoOptions>;
	jsxRuntime?: 'classic' | 'automatic';
	ref?: boolean;
	memo?: boolean;
	replaceAttrValues?: Record<string, string>;
	svgProps?: Record<string, string>;
	expandProps?: 'start' | 'end' | false;
	titleProp?: boolean;
	descProp?: boolean;
	native?: boolean;
	exportType?: 'default' | 'named';
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
 * Remove fill attributes (for addFillCurrentColor option)
 */
function removeFillAttributes(svg: string): string {
	return svg.replace(/\s+fill="[^"]*"/g, '');
}

/**
 * Add fill="currentColor" to SVG element
 */
function addFillAttribute(svg: string): string {
	// Add fill="currentColor" to the SVG tag
	return svg.replace('<svg', '<svg fill="currentColor"');
}

/**
 * Replace attribute values based on mapping
 */
function replaceAttributeValues(svg: string, replacements: Record<string, string>): string {
	let result = svg;
	for (const [from, to] of Object.entries(replacements)) {
		// Escape special regex characters in the "from" value
		const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// Replace attribute values (within quotes)
		const regex = new RegExp(`(\\w+)="${escaped}"`, 'g');
		result = result.replace(regex, `$1="${to}"`);
	}
	return result;
}

/**
 * Add custom props to SVG tag
 */
function addSvgProps(svg: string, svgProps: Record<string, string>): string {
	if (!svgProps || Object.keys(svgProps).length === 0) return svg;

	const propsString = Object.entries(svgProps)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');

	return svg.replace('<svg', `<svg ${propsString}`);
}

/**
 * Add title element to SVG
 */
function addTitleElement(svg: string): string {
	// Add title element right after the opening svg tag
	return svg.replace(
		/(<svg[^>]*>)/,
		'$1{title ? <title id={titleId}>{title}</title> : null}'
	);
}

/**
 * Add desc element to SVG
 */
function addDescElement(svg: string): string {
	// Add desc element right after the opening svg tag (or after title if present)
	if (svg.includes('{title ?')) {
		return svg.replace(
			/(\{title \? <title id=\{titleId\}>\{title\}<\/title> : null\})/,
			'$1{desc ? <desc id={descId}>{desc}</desc> : null}'
		);
	}
	return svg.replace(
		/(<svg[^>]*>)/,
		'$1{desc ? <desc id={descId}>{desc}</desc> : null}'
	);
}

/**
 * Add aria-labelledby attribute for title
 */
function addAriaLabelledBy(svg: string): string {
	return svg.replace('<svg', '<svg aria-labelledby={titleId}');
}

/**
 * Add aria-describedby attribute for desc
 */
function addAriaDescribedBy(svg: string): string {
	return svg.replace('<svg', '<svg aria-describedby={descId}');
}

/**
 * SVG element to React Native SVG component mapping
 */
const SVG_NATIVE_ELEMENTS: Record<string, string> = {
	svg: 'Svg',
	circle: 'Circle',
	ellipse: 'Ellipse',
	g: 'G',
	text: 'Text',
	tspan: 'TSpan',
	textPath: 'TextPath',
	path: 'Path',
	polygon: 'Polygon',
	polyline: 'Polyline',
	line: 'Line',
	rect: 'Rect',
	use: 'Use',
	image: 'Image',
	symbol: 'Symbol',
	defs: 'Defs',
	linearGradient: 'LinearGradient',
	radialGradient: 'RadialGradient',
	stop: 'Stop',
	clipPath: 'ClipPath',
	pattern: 'Pattern',
	mask: 'Mask',
	marker: 'Marker',
	foreignObject: 'ForeignObject',
	filter: 'Filter',
	feGaussianBlur: 'FeGaussianBlur',
	feOffset: 'FeOffset',
	feBlend: 'FeBlend',
	feColorMatrix: 'FeColorMatrix',
	feComposite: 'FeComposite',
	feMerge: 'FeMerge',
	feMergeNode: 'FeMergeNode',
	feFlood: 'FeFlood',
};

/**
 * Convert SVG to React Native SVG format
 */
function convertToReactNative(svg: string): string {
	let result = svg;

	// Convert opening tags (including self-closing)
	for (const [htmlTag, nativeTag] of Object.entries(SVG_NATIVE_ELEMENTS)) {
		// Match opening tag: <tagName or <tagName> or <tagName />
		const openingRegex = new RegExp(`<${htmlTag}(\\s|>|/>)`, 'g');
		result = result.replace(openingRegex, `<${nativeTag}$1`);

		// Match closing tag: </tagName>
		const closingRegex = new RegExp(`</${htmlTag}>`, 'g');
		result = result.replace(closingRegex, `</${nativeTag}>`);
	}

	return result;
}

/**
 * Get list of React Native SVG components used in the SVG
 */
function getUsedNativeComponents(svg: string): string[] {
	const usedComponents: Set<string> = new Set();

	for (const [, nativeTag] of Object.entries(SVG_NATIVE_ELEMENTS)) {
		// Check if component is used (opening tag)
		const regex = new RegExp(`<${nativeTag}(\\s|>|/>)`, 'g');
		if (regex.test(svg)) {
			usedComponents.add(nativeTag);
		}
	}

	return Array.from(usedComponents).sort();
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
 * Generate import statements based on options
 */
function generateImports(options: TransformOptions, nativeComponents?: string[]): string {
	const {
		typescript = false,
		jsxRuntime = 'classic',
		ref = false,
		memo = false,
		native = false,
	} = options;

	const imports: string[] = [];

	if (native) {
		// React Native SVG imports
		if (nativeComponents && nativeComponents.length > 0) {
			imports.push(`import { ${nativeComponents.join(', ')} } from "react-native-svg";`);
		}

		// React imports for memo/forwardRef
		const reactImports: string[] = [];
		if (ref) reactImports.push('forwardRef');
		if (memo) reactImports.push('memo');
		if (reactImports.length > 0) {
			imports.push(`import { ${reactImports.join(', ')} } from "react";`);
		}

		// TypeScript types
		if (typescript) {
			imports.push(`import type { SvgProps } from "react-native-svg";`);
			if (ref) {
				imports.push(`import type { Ref } from "react";`);
			}
		}
	} else if (jsxRuntime === 'classic') {
		if (typescript) {
			// TypeScript with classic runtime
			const typeImports: string[] = ['SVGProps'];
			if (ref) typeImports.push('Ref');
			imports.push(`import { ${typeImports.join(', ')} } from "react";`);

			const reactImports: string[] = [];
			if (ref) reactImports.push('forwardRef');
			if (memo) reactImports.push('memo');
			if (reactImports.length > 0) {
				imports.push(`import { ${reactImports.join(', ')} } from "react";`);
			}
		} else {
			// JavaScript with classic runtime
			const reactImports: string[] = [];
			if (ref) reactImports.push('forwardRef');
			if (memo) reactImports.push('memo');

			if (reactImports.length > 0) {
				imports.push(`import { ${reactImports.join(', ')} } from "react";`);
			} else {
				imports.push('import * as React from "react";');
			}
		}
	} else {
		// automatic runtime - minimal imports
		if (typescript) {
			const typeImports: string[] = ['SVGProps'];
			if (ref) typeImports.push('Ref');
			imports.push(`import type { ${typeImports.join(', ')} } from "react";`);
		}

		const reactImports: string[] = [];
		if (ref) reactImports.push('forwardRef');
		if (memo) reactImports.push('memo');
		if (reactImports.length > 0) {
			imports.push(`import { ${reactImports.join(', ')} } from "react";`);
		}
	}

	return imports.join('\n');
}

/**
 * Generate props interface/type based on options
 */
function generatePropsType(options: TransformOptions): string {
	const { typescript = false, titleProp = false, descProp = false, native = false } = options;

	if (!typescript) return '';

	const additionalProps: string[] = [];
	if (titleProp) {
		additionalProps.push('title?: string');
		additionalProps.push('titleId?: string');
	}
	if (descProp) {
		additionalProps.push('desc?: string');
		additionalProps.push('descId?: string');
	}

	const baseType = native ? 'SvgProps' : 'SVGProps<SVGSVGElement>';

	if (additionalProps.length > 0) {
		return `interface Props extends ${baseType} {
  ${additionalProps.join(';\n  ')};
}`;
	}

	return '';
}

/**
 * Generate the React component code using custom template
 */
function generateComponentCode(svgJsx: string, options: TransformOptions, nativeComponents?: string[]): string {
	const componentName = options.componentName || 'SvgComponent';
	const {
		typescript = false,
		ref = false,
		memo: useMemo = false,
		titleProp = false,
		descProp = false,
		native = false,
		exportType = 'default',
	} = options;

	const imports = generateImports(options, nativeComponents);
	const propsType = generatePropsType(options);

	// Determine props type string
	const basePropsType = native ? 'SvgProps' : 'SVGProps<SVGSVGElement>';
	const refType = native ? 'Ref<Svg>' : 'Ref<SVGSVGElement>';

	// Determine props parameter
	let propsParam: string;
	if (typescript) {
		if (titleProp || descProp) {
			const destructured: string[] = [];
			if (titleProp) destructured.push('title', 'titleId');
			if (descProp) destructured.push('desc', 'descId');
			propsParam = `{ ${destructured.join(', ')}, ...props }: Props`;
		} else {
			propsParam = `props: ${basePropsType}`;
		}
	} else {
		if (titleProp || descProp) {
			const destructured: string[] = [];
			if (titleProp) destructured.push('title', 'titleId');
			if (descProp) destructured.push('desc', 'descId');
			propsParam = `{ ${destructured.join(', ')}, ...props }`;
		} else {
			propsParam = 'props';
		}
	}

	// Build component body
	let componentDef: string;

	if (ref) {
		const refParam = typescript ? `ref: ${refType}` : 'ref';
		if (useMemo) {
			componentDef = `const ${componentName} = memo(forwardRef((${propsParam}, ${refParam}) => {
  return (
${svgJsx}
  );
}));`;
		} else {
			componentDef = `const ${componentName} = forwardRef((${propsParam}, ${refParam}) => {
  return (
${svgJsx}
  );
});`;
		}
	} else {
		if (useMemo) {
			componentDef = `const ${componentName} = memo((${propsParam}) => {
  return (
${svgJsx}
  );
});`;
		} else {
			componentDef = `const ${componentName} = (${propsParam}) => {
  return (
${svgJsx}
  );
};`;
		}
	}

	// Determine export statement based on exportType
	let exportStatement: string;
	if (exportType === 'named') {
		exportStatement = `export { ${componentName} };`;
	} else {
		exportStatement = `export default ${componentName};`;
	}

	// Combine all parts
	const parts: string[] = [imports];
	if (propsType) parts.push(propsType);
	parts.push(componentDef);
	parts.push(exportStatement);

	return parts.filter(Boolean).join('\n');
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
		svgoOptions = {},
		jsxRuntime = 'classic',
		ref = false,
		memo = false,
		replaceAttrValues,
		svgProps,
		expandProps = 'end',
		titleProp = false,
		descProp = false,
		native = false,
		exportType = 'default',
	} = options;

	// Clean and process SVG
	let processedSvg = svgCode.trim();

	// Apply SVGO optimizations
	if (svgo) {
		processedSvg = optimizeSvg(processedSvg, {
			// 기본 활성화
			removeDoctype: true,
			removeXMLProcInst: true,
			removeComments: true,
			removeMetadata: true,
			removeEditorsNSData: true,
			removeUnusedNS: true,
			removeStyleAttr: true,
			removeShapeRendering: true,

			// 기본 비활성화 (기존 동작 유지)
			cleanupAttrs: false,
			removeEmptyAttrs: false,
			removeHiddenElems: false,
			removeEmptyContainers: false,
			removeEmptyText: false,
			convertColors: false,
			minifyStyles: false,
			cleanupNumericValues: false,
			collapseGroups: false,

			// 조건부 옵션
			removeDimensions: icon || !dimensions,
			removeViewBox: removeViewBox,

			// 사용자 정의 옵션 병합
			...svgoOptions,
		});
	}

	// Replace attribute values if provided
	if (replaceAttrValues && Object.keys(replaceAttrValues).length > 0) {
		processedSvg = replaceAttributeValues(processedSvg, replaceAttrValues);
	}

	// Add fill="currentColor" if requested
	if (addFillCurrentColor) {
		processedSvg = removeFillAttributes(processedSvg);
		processedSvg = addFillAttribute(processedSvg);
	}

	// Convert HTML attributes to JSX
	processedSvg = htmlToJsx(processedSvg);

	// Add custom svgProps
	if (svgProps && Object.keys(svgProps).length > 0) {
		processedSvg = addSvgProps(processedSvg, svgProps);
	}

	// Add aria attributes for title/desc (not for native)
	if (!native) {
		if (titleProp) {
			processedSvg = addAriaLabelledBy(processedSvg);
		}
		if (descProp) {
			processedSvg = addAriaDescribedBy(processedSvg);
		}
	}

	// Add props spread based on expandProps option
	if (expandProps !== false && !processedSvg.includes('{...props}')) {
		if (expandProps === 'start') {
			// Add props spread at the beginning of attributes
			processedSvg = processedSvg.replace('<svg', '<svg {...props}');
		} else {
			// Default 'end': add props spread at the end (before >)
			processedSvg = processedSvg.replace(/(<svg[^>]*)(>)/, '$1 {...props}$2');
		}
	}

	// Add ref if enabled
	if (ref) {
		processedSvg = processedSvg.replace('<svg', '<svg ref={ref}');
	}

	// Add title element if titleProp is enabled (not for native)
	if (titleProp && !native) {
		processedSvg = addTitleElement(processedSvg);
	}

	// Add desc element if descProp is enabled (not for native)
	if (descProp && !native) {
		processedSvg = addDescElement(processedSvg);
	}

	// Convert to React Native SVG format if native option is enabled
	let nativeComponents: string[] | undefined;
	if (native) {
		processedSvg = convertToReactNative(processedSvg);
		nativeComponents = getUsedNativeComponents(processedSvg);
	}

	// Indent SVG for proper formatting (remove empty lines)
	const svgLines = processedSvg.split('\n').filter((line) => line.trim() !== '');
	const indentedSvg = svgLines.map((line) => '    ' + line.trim()).join('\n');

	// Generate component code using template
	const componentCode = generateComponentCode(indentedSvg, {
		typescript,
		componentName,
		jsxRuntime,
		ref,
		memo,
		titleProp: native ? false : titleProp,
		descProp: native ? false : descProp,
		native,
		exportType,
	} as TransformOptions, nativeComponents);

	// Format if prettier is enabled
	return formatCode(componentCode, { prettier } as TransformOptions);
}
