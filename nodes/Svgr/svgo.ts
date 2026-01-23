/**
 * SVGO (SVG Optimizer) module
 * Lightweight SVG optimization without external dependencies
 */

export interface SvgoOptions {
	// 문서 정리
	removeDoctype?: boolean;
	removeXMLProcInst?: boolean;
	removeComments?: boolean;
	removeMetadata?: boolean;
	removeEditorsNSData?: boolean;

	// 속성 정리
	cleanupAttrs?: boolean;
	cleanupIds?: boolean;
	removeEmptyAttrs?: boolean;
	removeUnusedNS?: boolean;
	prefixIds?: boolean | string;

	// 요소 제거
	removeTitle?: boolean;
	removeDesc?: boolean;
	removeHiddenElems?: boolean;
	removeEmptyContainers?: boolean;
	removeEmptyText?: boolean;
	removeUselessDefs?: boolean;

	// 스타일 최적화
	convertColors?: boolean;
	minifyStyles?: boolean;
	inlineStyles?: boolean;
	mergeStyles?: boolean;

	// 숫자 최적화
	cleanupNumericValues?: boolean;

	// 그룹 최적화
	collapseGroups?: boolean;
	moveElemsAttrsToGroup?: boolean;
	moveGroupAttrsToElems?: boolean;

	// 경로/변환 최적화
	convertPathData?: boolean;
	convertTransform?: boolean;
	convertShapeToPath?: boolean;
	mergePaths?: boolean;

	// 기존 옵션 (svgTransformer와 호환)
	removeXmlns?: boolean;
	removeStyleAttr?: boolean;
	removeShapeRendering?: boolean;
	removeDimensions?: boolean;
	removeViewBox?: boolean;
}

// 기본 옵션
const defaultOptions: SvgoOptions = {
	removeDoctype: true,
	removeXMLProcInst: true,
	removeComments: true,
	removeMetadata: true,
	removeEditorsNSData: true,
	cleanupAttrs: true,
	cleanupIds: false,
	removeEmptyAttrs: true,
	removeUnusedNS: true,
	prefixIds: false,
	removeTitle: false,
	removeDesc: false,
	removeHiddenElems: true,
	removeEmptyContainers: true,
	removeEmptyText: true,
	removeUselessDefs: false,
	convertColors: true,
	minifyStyles: true,
	inlineStyles: false,
	mergeStyles: false,
	cleanupNumericValues: true,
	collapseGroups: true,
	moveElemsAttrsToGroup: false,
	moveGroupAttrsToElems: false,
	convertPathData: false,
	convertTransform: false,
	convertShapeToPath: false,
	mergePaths: false,
	removeXmlns: true,
	removeStyleAttr: true,
	removeShapeRendering: true,
	removeDimensions: false,
	removeViewBox: false,
};

// ============================================
// 3.1 문서 정리 플러그인
// ============================================

/**
 * DOCTYPE 선언 제거
 */
function removeDoctype(svg: string): string {
	return svg.replace(/<!DOCTYPE[^>]*>/gi, '');
}

/**
 * XML 선언 제거
 */
function removeXMLProcInst(svg: string): string {
	return svg.replace(/<\?xml[^?]*\?>\s*/gi, '');
}

/**
 * HTML 주석 제거
 */
function removeComments(svg: string): string {
	return svg.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * metadata 요소 제거
 */
function removeMetadata(svg: string): string {
	return svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
}

/**
 * 편집기 네임스페이스 데이터 제거 (Inkscape, Sketch, Illustrator 등)
 */
function removeEditorsNSData(svg: string): string {
	let result = svg;

	// Inkscape 네임스페이스 및 속성
	result = result.replace(/\s+xmlns:inkscape="[^"]*"/gi, '');
	result = result.replace(/\s+inkscape:[a-z-]+="[^"]*"/gi, '');

	// Sodipodi 네임스페이스 및 속성
	result = result.replace(/\s+xmlns:sodipodi="[^"]*"/gi, '');
	result = result.replace(/\s+sodipodi:[a-z-]+="[^"]*"/gi, '');

	// Sketch 네임스페이스 및 속성
	result = result.replace(/\s+xmlns:sketch="[^"]*"/gi, '');
	result = result.replace(/\s+sketch:[a-z-]+="[^"]*"/gi, '');

	// Adobe Illustrator 네임스페이스 및 속성
	result = result.replace(/\s+xmlns:i="[^"]*"/gi, '');
	result = result.replace(/\s+i:[a-z-]+="[^"]*"/gi, '');
	result = result.replace(/\s+xmlns:x="[^"]*"/gi, '');

	// Figma 관련
	result = result.replace(/\s+data-figma[a-z-]*="[^"]*"/gi, '');

	// 일반적인 편집기 데이터 속성
	result = result.replace(/\s+data-name="[^"]*"/gi, '');

	return result;
}

// ============================================
// 3.2 속성 정리 플러그인
// ============================================

/**
 * 속성 값의 공백/줄바꿈 정리
 */
function cleanupAttrs(svg: string): string {
	// 속성 값 내의 연속 공백을 단일 공백으로
	return svg.replace(/(\w+)="([^"]*)"/g, (match, attr, value) => {
		const cleaned = value.replace(/\s+/g, ' ').trim();
		return `${attr}="${cleaned}"`;
	});
}

/**
 * 빈 속성 제거 (attr="")
 */
function removeEmptyAttrs(svg: string): string {
	return svg.replace(/\s+[\w-]+=""/g, '');
}

/**
 * 미사용 네임스페이스 제거
 */
function removeUnusedNS(svg: string): string {
	let result = svg;

	// xmlns 속성 제거 (기본)
	result = result.replace(/\s+xmlns="[^"]*"/g, '');

	// xlink 네임스페이스 (사용하지 않으면 제거)
	if (!result.includes('xlink:') && !result.includes('xlinkHref')) {
		result = result.replace(/\s+xmlns:xlink="[^"]*"/g, '');
	}

	return result;
}

/**
 * ID/클래스에 접두사 추가 (충돌 방지)
 */
function prefixIds(svg: string, prefix: string): string {
	if (!prefix) return svg;

	let result = svg;

	// ID 속성에 접두사 추가
	result = result.replace(/\bid="([^"]*)"/g, `id="${prefix}$1"`);

	// ID 참조에도 접두사 추가 (url(#id), href="#id")
	result = result.replace(/url\(#([^)]*)\)/g, `url(#${prefix}$1)`);
	result = result.replace(/href="#([^"]*)"/g, `href="#${prefix}$1"`);
	result = result.replace(/xlink:href="#([^"]*)"/g, `xlink:href="#${prefix}$1"`);

	// class 속성에 접두사 추가
	result = result.replace(/\bclass="([^"]*)"/g, (match, classes) => {
		const prefixedClasses = classes
			.split(/\s+/)
			.map((cls: string) => (cls ? `${prefix}${cls}` : ''))
			.join(' ');
		return `class="${prefixedClasses}"`;
	});

	return result;
}

/**
 * 사용되지 않는 ID 제거 및 ID 축약
 */
function cleanupIds(svg: string): string {
	let result = svg;

	// 모든 ID 추출
	const idMatches = result.matchAll(/\bid="([^"]*)"/g);
	const definedIds = new Set<string>();
	for (const match of idMatches) {
		definedIds.add(match[1]);
	}

	// 참조되는 ID 추출
	const referencedIds = new Set<string>();

	// url(#id) 참조
	const urlRefs = result.matchAll(/url\(#([^)]*)\)/g);
	for (const match of urlRefs) {
		referencedIds.add(match[1]);
	}

	// href="#id" 참조
	const hrefRefs = result.matchAll(/href="#([^"]*)"/g);
	for (const match of hrefRefs) {
		referencedIds.add(match[1]);
	}

	// xlink:href="#id" 참조
	const xlinkRefs = result.matchAll(/xlink:href="#([^"]*)"/g);
	for (const match of xlinkRefs) {
		referencedIds.add(match[1]);
	}

	// 사용되지 않는 ID 제거
	for (const id of definedIds) {
		if (!referencedIds.has(id)) {
			result = result.replace(new RegExp(`\\s+id="${id}"`, 'g'), '');
		}
	}

	return result;
}

// ============================================
// 3.3 요소 제거 플러그인
// ============================================

/**
 * title 요소 제거
 */
function removeTitle(svg: string): string {
	return svg.replace(/<title[\s\S]*?<\/title>/gi, '');
}

/**
 * desc 요소 제거
 */
function removeDesc(svg: string): string {
	return svg.replace(/<desc[\s\S]*?<\/desc>/gi, '');
}

/**
 * 숨겨진 요소 제거 (display:none, visibility:hidden, opacity:0)
 */
function removeHiddenElems(svg: string): string {
	let result = svg;

	// display:none 속성을 가진 요소 제거
	result = result.replace(/<[^>]+display\s*:\s*none[^>]*>[\s\S]*?<\/[^>]+>/gi, '');
	result = result.replace(/<[^>]+display\s*=\s*["']none["'][^>]*\/?>/gi, '');

	// visibility:hidden 속성을 가진 요소 제거
	result = result.replace(/<[^>]+visibility\s*:\s*hidden[^>]*>[\s\S]*?<\/[^>]+>/gi, '');
	result = result.replace(/<[^>]+visibility\s*=\s*["']hidden["'][^>]*\/?>/gi, '');

	// opacity="0" 속성을 가진 요소 제거
	result = result.replace(/<[^>]+\s+opacity\s*=\s*["']0["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '');
	result = result.replace(/<[^>]+\s+opacity\s*=\s*["']0["'][^>]*\/>/gi, '');

	return result;
}

/**
 * 빈 컨테이너 요소 제거 (<g>, <defs>, <pattern>, <clipPath> 등)
 */
function removeEmptyContainers(svg: string): string {
	let result = svg;
	let prevResult = '';

	// 반복적으로 빈 컨테이너 제거 (중첩된 빈 컨테이너 처리)
	while (result !== prevResult) {
		prevResult = result;

		// 빈 <g> 태그 제거
		result = result.replace(/<g[^>]*>\s*<\/g>/gi, '');

		// 빈 <defs> 태그 제거
		result = result.replace(/<defs[^>]*>\s*<\/defs>/gi, '');

		// 빈 <pattern> 태그 제거
		result = result.replace(/<pattern[^>]*>\s*<\/pattern>/gi, '');

		// 빈 <clipPath> 태그 제거
		result = result.replace(/<clipPath[^>]*>\s*<\/clipPath>/gi, '');

		// 빈 <mask> 태그 제거
		result = result.replace(/<mask[^>]*>\s*<\/mask>/gi, '');

		// 빈 <symbol> 태그 제거
		result = result.replace(/<symbol[^>]*>\s*<\/symbol>/gi, '');
	}

	return result;
}

/**
 * 빈 텍스트 요소 제거
 */
function removeEmptyText(svg: string): string {
	return svg.replace(/<text[^>]*>\s*<\/text>/gi, '');
}

/**
 * 참조되지 않는 defs 내용 제거
 */
function removeUselessDefs(svg: string): string {
	let result = svg;

	// defs 내의 요소들 ID 추출
	const defsMatch = result.match(/<defs[^>]*>([\s\S]*?)<\/defs>/gi);
	if (!defsMatch) return result;

	// 참조되는 ID 수집
	const referencedIds = new Set<string>();

	// url(#id) 참조
	const urlRefs = result.matchAll(/url\(#([^)]*)\)/g);
	for (const match of urlRefs) {
		referencedIds.add(match[1]);
	}

	// href="#id" 참조
	const hrefRefs = result.matchAll(/href="#([^"]*)"/g);
	for (const match of hrefRefs) {
		referencedIds.add(match[1]);
	}

	// xlink:href="#id" 참조 (defs 내부 참조 제외)
	const xlinkRefs = result.matchAll(/xlink:href="#([^"]*)"/g);
	for (const match of xlinkRefs) {
		referencedIds.add(match[1]);
	}

	// defs 내의 참조되지 않는 요소 제거
	for (const defsContent of defsMatch) {
		let newDefsContent = defsContent;

		// defs 내의 각 요소 확인
		const elementsWithId = defsContent.matchAll(
			/<(\w+)[^>]*\s+id="([^"]*)"[^>]*(?:\/>|>[\s\S]*?<\/\1>)/gi,
		);
		for (const elemMatch of elementsWithId) {
			const fullElement = elemMatch[0];
			const elementId = elemMatch[2];

			// 참조되지 않으면 제거
			if (!referencedIds.has(elementId)) {
				newDefsContent = newDefsContent.replace(fullElement, '');
			}
		}

		result = result.replace(defsContent, newDefsContent);
	}

	return result;
}

// ============================================
// 3.4 스타일 최적화 플러그인
// ============================================

/**
 * 색상 값 최적화
 * - rgb(r,g,b) -> #hex
 * - 이름 있는 색상으로 변환 (가능한 경우)
 * - #rrggbb -> #rgb (가능한 경우)
 */
function convertColors(svg: string): string {
	let result = svg;

	// rgb(r, g, b) -> #hex (먼저 변환)
	result = result.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, (_, r, g, b) => {
		const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	});

	// 흔한 색상을 이름으로 변환 (먼저 긴 형식부터)
	const colorMap: Record<string, string> = {
		'#000000': '#000',
		'#ffffff': '#fff',
		'#ff0000': 'red',
		'#00ff00': 'lime',
		'#0000ff': 'blue',
		'#ffff00': 'yellow',
		'#00ffff': 'cyan',
		'#ff00ff': 'magenta',
	};

	for (const [hex, name] of Object.entries(colorMap)) {
		const regex = new RegExp(hex, 'gi');
		result = result.replace(regex, name);
	}

	// #RRGGBB -> #RGB (가능한 경우, 위에서 처리되지 않은 것만)
	result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/gi, '#$1$2$3');

	return result;
}

/**
 * CSS 스타일 압축
 */
function minifyStyles(svg: string): string {
	// <style> 블록 내용 압축
	return svg.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, content) => {
		let minified = content;
		// 주석 제거
		minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
		// 불필요한 공백 제거
		minified = minified.replace(/\s+/g, ' ');
		// 세미콜론 뒤 공백 제거
		minified = minified.replace(/;\s+/g, ';');
		// 콜론 뒤 공백 제거
		minified = minified.replace(/:\s+/g, ':');
		// 중괄호 주변 공백 제거
		minified = minified.replace(/\s*{\s*/g, '{');
		minified = minified.replace(/\s*}\s*/g, '}');
		minified = minified.trim();

		return `<style>${minified}</style>`;
	});
}

/**
 * <style> 블록을 인라인 style 속성으로 변환
 */
function inlineStyles(svg: string): string {
	let result = svg;

	// <style> 블록에서 규칙 추출
	const styleMatch = result.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
	if (!styleMatch) return result;

	const styleContent = styleMatch[1];
	const rules: Record<string, string> = {};

	// CSS 규칙 파싱 (간단한 선택자만 지원: .class, #id, element)
	// minifyStyles 후 형식: .cls{fill:red;} 또는 원본 형식: .cls { fill: red; }
	const ruleMatches = styleContent.matchAll(/([.#]?[\w-]+)\s*\{\s*([^}]*?)\s*\}/g);
	for (const match of ruleMatches) {
		const selector = match[1].trim();
		let declarations = match[2].trim();
		// 마지막 세미콜론 제거
		if (declarations.endsWith(';')) {
			declarations = declarations.slice(0, -1);
		}
		rules[selector] = declarations;
	}

	// 클래스 선택자 처리 (.className)
	for (const [selector, declarations] of Object.entries(rules)) {
		if (selector.startsWith('.')) {
			const className = selector.slice(1);
			// 해당 클래스를 가진 요소에 스타일 적용
			// class 속성 값에서 해당 클래스를 찾아서 style 추가
			result = result.replace(
				new RegExp(`(<\\w+\\s+[^>]*?class="[^"]*${className}[^"]*"[^>]*?)(\\s*\\/?>)`, 'gi'),
				(match, before, closing) => {
					// 기존 style 속성이 있으면 병합
					if (before.includes('style="')) {
						return before.replace(/style="([^"]*)"/, `style="$1;${declarations}"`) + closing;
					}
					return `${before} style="${declarations}"${closing}`;
				},
			);
		}
	}

	// ID 선택자 처리 (#idName)
	for (const [selector, declarations] of Object.entries(rules)) {
		if (selector.startsWith('#')) {
			const idName = selector.slice(1);
			result = result.replace(
				new RegExp(`(<[^>]*\\bid="${idName}"[^>]*?)(\\s*\\/?>)`, 'gi'),
				(match, before, closing) => {
					if (before.includes('style="')) {
						return before.replace(/style="([^"]*)"/, `style="$1;${declarations}"`) + closing;
					}
					return `${before} style="${declarations}"${closing}`;
				},
			);
		}
	}

	// 요소 선택자 처리 (element)
	for (const [selector, declarations] of Object.entries(rules)) {
		if (!selector.startsWith('.') && !selector.startsWith('#')) {
			result = result.replace(
				new RegExp(`(<${selector}\\b[^>]*?)(\\s*\\/?>)`, 'gi'),
				(match, before, closing) => {
					if (before.includes('style="')) {
						return before.replace(/style="([^"]*)"/, `style="$1;${declarations}"`) + closing;
					}
					return `${before} style="${declarations}"${closing}`;
				},
			);
		}
	}

	// <style> 블록 제거
	result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

	return result;
}

/**
 * 여러 <style> 요소를 하나로 병합
 */
function mergeStyles(svg: string): string {
	const styleMatches = svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
	const allStyles: string[] = [];

	for (const match of styleMatches) {
		allStyles.push(match[1].trim());
	}

	if (allStyles.length <= 1) return svg;

	// 모든 style 태그 제거
	let result = svg.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

	// 병합된 style 태그 삽입 (첫 번째 자식 위치에)
	const mergedStyle = `<style>${allStyles.join('')}</style>`;
	result = result.replace(/(<svg[^>]*>)/, `$1${mergedStyle}`);

	return result;
}

// ============================================
// 3.5 숫자 최적화 플러그인
// ============================================

/**
 * 숫자 정밀도 최적화
 * - 0.5 -> .5
 * - 1.0 -> 1
 * - 0px -> 0
 */
function cleanupNumericValues(svg: string): string {
	let result = svg;

	// 속성 값 내에서만 처리
	result = result.replace(/="([^"]*)"/g, (match, value) => {
		let cleaned = value;

		// 0.xxx -> .xxx (앞의 0 제거)
		cleaned = cleaned.replace(/\b0+\.(\d)/g, '.$1');

		// x.0 -> x (뒤의 .0 제거)
		cleaned = cleaned.replace(/(\d)\.0+\b/g, '$1');

		// 0px, 0em, 0% 등 -> 0
		cleaned = cleaned.replace(/\b0(px|em|ex|pt|pc|cm|mm|in|%)\b/gi, '0');

		// 연속된 공백을 단일 공백으로
		cleaned = cleaned.replace(/\s+/g, ' ');

		return `="${cleaned}"`;
	});

	return result;
}

// ============================================
// 3.6 그룹 최적화 플러그인
// ============================================

/**
 * 불필요한 그룹 제거 (속성 없는 단일 자식 그룹)
 */
function collapseGroups(svg: string): string {
	let result = svg;
	let prevResult = '';

	// 반복적으로 처리 (중첩된 그룹)
	while (result !== prevResult) {
		prevResult = result;

		// 속성 없는 <g> 태그 제거 (내용은 유지)
		result = result.replace(/<g>\s*([\s\S]*?)\s*<\/g>/gi, '$1');

		// id만 있는 <g> 태그는 유지 (참조될 수 있음)
	}

	return result;
}

/**
 * 자식 요소의 공통 속성을 부모 그룹으로 이동
 */
function moveElemsAttrsToGroup(svg: string): string {
	let result = svg;

	// 프리젠테이션 속성 목록
	const presentationAttrs = [
		'fill',
		'stroke',
		'stroke-width',
		'stroke-linecap',
		'stroke-linejoin',
		'stroke-dasharray',
		'stroke-dashoffset',
		'stroke-miterlimit',
		'stroke-opacity',
		'fill-opacity',
		'fill-rule',
		'opacity',
		'font-family',
		'font-size',
		'font-weight',
		'text-anchor',
		'dominant-baseline',
	];

	// 그룹 내 자식 요소들의 공통 속성 찾기
	result = result.replace(/<g([^>]*)>([\s\S]*?)<\/g>/gi, (match, groupAttrs, content) => {
		// 자식 요소들 추출
		const childElements = content.match(/<\w+[^>]*(?:\/>|>[^<]*<\/\w+>)/g);
		if (!childElements || childElements.length < 2) return match;

		// 각 자식의 속성 추출
		const childAttrsArray: Record<string, string>[] = [];
		for (const child of childElements) {
			const attrs: Record<string, string> = {};
			const attrMatches = child.matchAll(/\s([\w-]+)="([^"]*)"/g);
			for (const attrMatch of attrMatches) {
				if (presentationAttrs.includes(attrMatch[1])) {
					attrs[attrMatch[1]] = attrMatch[2];
				}
			}
			childAttrsArray.push(attrs);
		}

		// 공통 속성 찾기
		const commonAttrs: Record<string, string> = {};
		for (const attr of presentationAttrs) {
			const firstValue = childAttrsArray[0]?.[attr];
			if (firstValue && childAttrsArray.every((attrs) => attrs[attr] === firstValue)) {
				commonAttrs[attr] = firstValue;
			}
		}

		// 공통 속성이 없으면 원본 반환
		if (Object.keys(commonAttrs).length === 0) return match;

		// 자식에서 공통 속성 제거
		let newContent = content;
		for (const [attr, value] of Object.entries(commonAttrs)) {
			newContent = newContent.replace(new RegExp(`\\s${attr}="${value}"`, 'g'), '');
		}

		// 그룹에 공통 속성 추가
		const commonAttrsStr = Object.entries(commonAttrs)
			.map(([attr, value]) => ` ${attr}="${value}"`)
			.join('');

		return `<g${groupAttrs}${commonAttrsStr}>${newContent}</g>`;
	});

	return result;
}

/**
 * 그룹 속성을 자식 요소로 분배
 */
function moveGroupAttrsToElems(svg: string): string {
	let result = svg;

	// 프리젠테이션 속성 목록
	const presentationAttrs = [
		'fill',
		'stroke',
		'stroke-width',
		'stroke-linecap',
		'stroke-linejoin',
		'stroke-dasharray',
		'stroke-dashoffset',
		'stroke-miterlimit',
		'stroke-opacity',
		'fill-opacity',
		'fill-rule',
		'opacity',
		'font-family',
		'font-size',
		'font-weight',
		'text-anchor',
		'dominant-baseline',
	];

	// 그룹의 프리젠테이션 속성을 자식에게 분배
	result = result.replace(/<g([^>]*)>([\s\S]*?)<\/g>/gi, (match, groupAttrs, content) => {
		// 그룹 속성 추출
		const groupPresentationAttrs: Record<string, string> = {};
		let remainingGroupAttrs = groupAttrs;

		for (const attr of presentationAttrs) {
			const attrMatch = groupAttrs.match(new RegExp(`\\s${attr}="([^"]*)"`));
			if (attrMatch) {
				groupPresentationAttrs[attr] = attrMatch[1];
				remainingGroupAttrs = remainingGroupAttrs.replace(attrMatch[0], '');
			}
		}

		// 분배할 속성이 없으면 원본 반환
		if (Object.keys(groupPresentationAttrs).length === 0) return match;

		// 자식 요소에 속성 추가 (self-closing과 일반 태그 모두 처리)
		const newContent = content.replace(
			/<(\w+)((?:\s+[\w-]+="[^"]*")*)\s*(\/?)>/g,
			(_elemMatch: string, tag: string, attrs: string, selfClose: string) => {
				let newAttrs = attrs;
				for (const [attr, value] of Object.entries(groupPresentationAttrs)) {
					// 자식에 해당 속성이 없으면 추가
					if (!attrs.includes(`${attr}="`)) {
						newAttrs += ` ${attr}="${value}"`;
					}
				}
				return `<${tag}${newAttrs}${selfClose ? ' />' : '>'}`;
			},
		);

		return `<g${remainingGroupAttrs}>${newContent}</g>`;
	});

	return result;
}

// ============================================
// 3.7 경로/변환 최적화 플러그인
// ============================================

/**
 * path d 속성 최적화
 * - 상대/절대 좌표 최적화
 * - 불필요한 공백 제거
 * - 명령어 축약
 */
function convertPathData(svg: string): string {
	return svg.replace(/\sd="([^"]*)"/g, (match, d) => {
		let optimized = d;

		// 연속 공백을 단일 공백으로
		optimized = optimized.replace(/\s+/g, ' ');

		// 명령어와 숫자 사이 불필요한 공백 제거
		optimized = optimized.replace(/([MLHVCSQTAZ])\s+/gi, '$1');

		// 숫자/명령어 앞 불필요한 공백 제거
		optimized = optimized.replace(/\s+([MLHVCSQTAZ])/gi, '$1');

		// 숫자와 음수 사이 공백 제거 (콤마가 없을 때)
		optimized = optimized.replace(/(\d)\s+(-)/g, '$1$2');

		// 콤마 주변 공백 제거
		optimized = optimized.replace(/\s*,\s*/g, ',');

		// 콤마를 공백으로 대체 가능한 경우 (짧은 표기)
		optimized = optimized.replace(/,/g, ' ');

		// 연속 공백 다시 정리
		optimized = optimized.replace(/\s+/g, ' ').trim();

		// 0.xxx -> .xxx
		optimized = optimized.replace(/\b0+\.(\d)/g, '.$1');

		// 소수점 이하 불필요한 0 제거
		optimized = optimized.replace(/(\.\d*?)0+(\s|$|[A-Za-z])/g, '$1$2');

		// .0 제거
		optimized = optimized.replace(/\.(\s|$|[A-Za-z])/g, '$1');

		return ` d="${optimized}"`;
	});
}

/**
 * transform 속성 최적화
 * - translate(0,0) 제거
 * - rotate(0) 제거
 * - scale(1) 제거
 * - 행렬 단순화
 */
function convertTransform(svg: string): string {
	return svg.replace(/\stransform="([^"]*)"/g, (match, transform) => {
		let optimized = transform;

		// translate(0) 또는 translate(0,0) 제거
		optimized = optimized.replace(/translate\(\s*0\s*(,\s*0\s*)?\)/gi, '');

		// rotate(0) 제거
		optimized = optimized.replace(/rotate\(\s*0\s*(,\s*[\d.]+\s*,\s*[\d.]+\s*)?\)/gi, '');

		// scale(1) 또는 scale(1,1) 제거
		optimized = optimized.replace(/scale\(\s*1\s*(,\s*1\s*)?\)/gi, '');

		// skewX(0), skewY(0) 제거
		optimized = optimized.replace(/skew[XY]\(\s*0\s*\)/gi, '');

		// 연속 공백 정리
		optimized = optimized.replace(/\s+/g, ' ').trim();

		// transform이 비어있으면 속성 자체를 제거
		if (!optimized) return '';

		return ` transform="${optimized}"`;
	});
}

/**
 * 기본 도형을 path로 변환
 */
function convertShapeToPath(svg: string): string {
	let result = svg;

	// rect를 path로 변환
	result = result.replace(/<rect([^>]*)\/>/gi, (match, attrs) => {
		const x = parseFloat(attrs.match(/\sx="([^"]*)"/)?.[1] || '0');
		const y = parseFloat(attrs.match(/\sy="([^"]*)"/)?.[1] || '0');
		const width = parseFloat(attrs.match(/\swidth="([^"]*)"/)?.[1] || '0');
		const height = parseFloat(attrs.match(/\sheight="([^"]*)"/)?.[1] || '0');
		const rx = parseFloat(attrs.match(/\srx="([^"]*)"/)?.[1] || '0');
		const ry = parseFloat(attrs.match(/\sry="([^"]*)"/)?.[1] || rx.toString());

		if (width === 0 || height === 0) return match;

		// 다른 속성들 유지 (x, y, width, height, rx, ry 제외)
		const otherAttrs = attrs
			.replace(/\s[xy]="[^"]*"/g, '')
			.replace(/\swidth="[^"]*"/g, '')
			.replace(/\sheight="[^"]*"/g, '')
			.replace(/\sr[xy]="[^"]*"/g, '');

		let d: string;
		if (rx > 0 || ry > 0) {
			// 둥근 모서리 rect
			const r = Math.min(rx, width / 2, height / 2);
			d = `M${x + r},${y}h${width - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${height - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${width - 2 * r}a${r},${r} 0 0 1 -${r},-${r}v-${height - 2 * r}a${r},${r} 0 0 1 ${r},-${r}z`;
		} else {
			// 일반 rect
			d = `M${x},${y}h${width}v${height}h-${width}z`;
		}

		return `<path${otherAttrs} d="${d}"/>`;
	});

	// circle을 path로 변환
	result = result.replace(/<circle([^>]*)\/>/gi, (match, attrs) => {
		const cx = parseFloat(attrs.match(/\scx="([^"]*)"/)?.[1] || '0');
		const cy = parseFloat(attrs.match(/\scy="([^"]*)"/)?.[1] || '0');
		const r = parseFloat(attrs.match(/\sr="([^"]*)"/)?.[1] || '0');

		if (r === 0) return match;

		const otherAttrs = attrs.replace(/\sc[xy]="[^"]*"/g, '').replace(/\sr="[^"]*"/g, '');

		const d = `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 -${2 * r},0`;

		return `<path${otherAttrs} d="${d}"/>`;
	});

	// ellipse를 path로 변환
	result = result.replace(/<ellipse([^>]*)\/>/gi, (match, attrs) => {
		const cx = parseFloat(attrs.match(/\scx="([^"]*)"/)?.[1] || '0');
		const cy = parseFloat(attrs.match(/\scy="([^"]*)"/)?.[1] || '0');
		const rx = parseFloat(attrs.match(/\srx="([^"]*)"/)?.[1] || '0');
		const ry = parseFloat(attrs.match(/\sry="([^"]*)"/)?.[1] || '0');

		if (rx === 0 || ry === 0) return match;

		const otherAttrs = attrs.replace(/\sc[xy]="[^"]*"/g, '').replace(/\sr[xy]="[^"]*"/g, '');

		const d = `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 -${2 * rx},0`;

		return `<path${otherAttrs} d="${d}"/>`;
	});

	// line을 path로 변환
	result = result.replace(/<line([^>]*)\/>/gi, (match, attrs) => {
		const x1 = parseFloat(attrs.match(/\sx1="([^"]*)"/)?.[1] || '0');
		const y1 = parseFloat(attrs.match(/\sy1="([^"]*)"/)?.[1] || '0');
		const x2 = parseFloat(attrs.match(/\sx2="([^"]*)"/)?.[1] || '0');
		const y2 = parseFloat(attrs.match(/\sy2="([^"]*)"/)?.[1] || '0');

		const otherAttrs = attrs.replace(/\s[xy][12]="[^"]*"/g, '');

		const d = `M${x1},${y1}L${x2},${y2}`;

		return `<path${otherAttrs} d="${d}"/>`;
	});

	// polygon을 path로 변환
	result = result.replace(/<polygon([^>]*)\/>/gi, (match, attrs) => {
		const points = attrs.match(/\spoints="([^"]*)"/)?.[1];
		if (!points) return match;

		const otherAttrs = attrs.replace(/\spoints="[^"]*"/g, '');

		const pointArray = points.trim().split(/[\s,]+/);
		if (pointArray.length < 4) return match;

		let d = `M${pointArray[0]},${pointArray[1]}`;
		for (let i = 2; i < pointArray.length; i += 2) {
			d += `L${pointArray[i]},${pointArray[i + 1]}`;
		}
		d += 'z';

		return `<path${otherAttrs} d="${d}"/>`;
	});

	// polyline을 path로 변환
	result = result.replace(/<polyline([^>]*)\/>/gi, (match, attrs) => {
		const points = attrs.match(/\spoints="([^"]*)"/)?.[1];
		if (!points) return match;

		const otherAttrs = attrs.replace(/\spoints="[^"]*"/g, '');

		const pointArray = points.trim().split(/[\s,]+/);
		if (pointArray.length < 4) return match;

		let d = `M${pointArray[0]},${pointArray[1]}`;
		for (let i = 2; i < pointArray.length; i += 2) {
			d += `L${pointArray[i]},${pointArray[i + 1]}`;
		}

		return `<path${otherAttrs} d="${d}"/>`;
	});

	return result;
}

/**
 * 연속된 path 요소 병합
 */
function mergePaths(svg: string): string {
	let result = svg;

	// 연속된 path 요소 찾기 (같은 속성을 가진 경우만)
	result = result.replace(
		/(<path\s+)([^>]*d="[^"]*")([^>]*)(\/?>)\s*(<path\s+)([^>]*d="[^"]*")([^>]*)(\/?>)/gi,
		(match, p1Start, p1D, p1Rest, p1End, p2Start, p2D, p2Rest) => {
			// 속성 비교 (d 제외)
			const attrs1 = (p1Rest || '').trim();
			const attrs2 = (p2Rest || '').trim();

			// 속성이 다르면 병합하지 않음
			if (attrs1 !== attrs2) return match;

			// d 속성 추출
			const d1 = p1D.match(/d="([^"]*)"/)?.[1] || '';
			const d2 = p2D.match(/d="([^"]*)"/)?.[1] || '';

			// d 속성 병합
			const mergedD = `${d1} ${d2}`;

			return `${p1Start}d="${mergedD}"${p1Rest}${p1End}`;
		},
	);

	return result;
}

// ============================================
// 기존 호환 함수
// ============================================

/**
 * style 속성 제거
 */
function removeStyleAttr(svg: string): string {
	return svg.replace(/\s+style="[^"]*"/g, '');
}

/**
 * shape-rendering 속성 제거
 */
function removeShapeRendering(svg: string): string {
	let result = svg;
	result = result.replace(/\s+shape-rendering="[^"]*"/g, '');
	result = result.replace(/\s+shapeRendering="[^"]*"/g, '');
	return result;
}

/**
 * width/height 속성 제거
 */
function removeDimensions(svg: string): string {
	let result = svg;
	result = result.replace(/\s+width="[^"]*"/g, '');
	result = result.replace(/\s+height="[^"]*"/g, '');
	return result;
}

/**
 * viewBox 속성 제거
 */
function removeViewBox(svg: string): string {
	return svg.replace(/\s+viewBox="[^"]*"/g, '');
}

// ============================================
// 메인 함수
// ============================================

/**
 * SVG 최적화 메인 함수
 */
export function optimizeSvg(svg: string, options: Partial<SvgoOptions> = {}): string {
	const opts = { ...defaultOptions, ...options };
	let result = svg.trim();

	// removeUnusedNS가 명시적으로 false인 경우 removeXmlns도 비활성화
	const shouldRemoveNS =
		options.removeUnusedNS !== false && (opts.removeUnusedNS || opts.removeXmlns);

	// 3.1 문서 정리
	if (opts.removeDoctype) result = removeDoctype(result);
	if (opts.removeXMLProcInst) result = removeXMLProcInst(result);
	if (opts.removeComments) result = removeComments(result);
	if (opts.removeMetadata) result = removeMetadata(result);
	if (opts.removeEditorsNSData) result = removeEditorsNSData(result);

	// 3.2 속성 정리
	if (opts.cleanupAttrs) result = cleanupAttrs(result);
	if (opts.cleanupIds) result = cleanupIds(result);
	if (opts.removeEmptyAttrs) result = removeEmptyAttrs(result);
	if (shouldRemoveNS) result = removeUnusedNS(result);
	if (opts.prefixIds) {
		const prefix = typeof opts.prefixIds === 'string' ? opts.prefixIds : 'svgr_';
		result = prefixIds(result, prefix);
	}

	// 3.3 요소 제거
	if (opts.removeTitle) result = removeTitle(result);
	if (opts.removeDesc) result = removeDesc(result);
	if (opts.removeHiddenElems) result = removeHiddenElems(result);
	if (opts.removeEmptyText) result = removeEmptyText(result);
	if (opts.removeUselessDefs) result = removeUselessDefs(result);

	// 3.4 스타일 최적화
	if (opts.convertColors) result = convertColors(result);
	if (opts.mergeStyles) result = mergeStyles(result);
	if (opts.minifyStyles) result = minifyStyles(result);
	if (opts.inlineStyles) result = inlineStyles(result);

	// 3.5 숫자 최적화
	if (opts.cleanupNumericValues) result = cleanupNumericValues(result);

	// 3.6 그룹 최적화
	if (opts.moveElemsAttrsToGroup) result = moveElemsAttrsToGroup(result);
	if (opts.moveGroupAttrsToElems) result = moveGroupAttrsToElems(result);
	if (opts.collapseGroups) result = collapseGroups(result);
	if (opts.removeEmptyContainers) result = removeEmptyContainers(result);

	// 3.7 경로/변환 최적화
	if (opts.convertShapeToPath) result = convertShapeToPath(result);
	if (opts.convertPathData) result = convertPathData(result);
	if (opts.convertTransform) result = convertTransform(result);
	if (opts.mergePaths) result = mergePaths(result);

	// 기존 호환 옵션 (removeXmlns는 이미 shouldRemoveNS에서 처리됨)
	// inlineStyles가 활성화되면 removeStyleAttr은 비활성화 (인라인 스타일 유지)
	if (opts.removeStyleAttr && !opts.inlineStyles) result = removeStyleAttr(result);
	if (opts.removeShapeRendering) result = removeShapeRendering(result);
	if (opts.removeDimensions) result = removeDimensions(result);
	if (opts.removeViewBox) result = removeViewBox(result);

	return result;
}

/**
 * 기본 최적화 (기존 svgTransformer와 호환)
 */
export function optimizeSvgBasic(
	svg: string,
	options: {
		icon?: boolean;
		dimensions?: boolean;
		removeViewBox?: boolean;
		addFillCurrentColor?: boolean;
	} = {},
): string {
	return optimizeSvg(svg, {
		// 기본 문서 정리
		removeDoctype: true,
		removeXMLProcInst: true,
		removeComments: true,
		removeMetadata: true,
		removeEditorsNSData: true,

		// 속성 정리
		removeUnusedNS: true,
		removeStyleAttr: true,
		removeShapeRendering: true,

		// 조건부 옵션
		removeDimensions: options.icon || !options.dimensions,
		removeViewBox: options.removeViewBox,

		// 나머지는 비활성화 (기존 동작 유지)
		cleanupAttrs: false,
		removeEmptyAttrs: false,
		prefixIds: false,
		removeTitle: false,
		removeDesc: false,
		removeHiddenElems: false,
		removeEmptyContainers: false,
		removeEmptyText: false,
		convertColors: false,
		minifyStyles: false,
		cleanupNumericValues: false,
		collapseGroups: false,
	});
}
