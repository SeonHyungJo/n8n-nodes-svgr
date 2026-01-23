import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { transformSvg } from './svgTransformer';

export class Svgr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SVGR',
		name: 'svgr',
		icon: { light: 'file:../../icons/svgr.svg', dark: 'file:../../icons/svgr.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Transform SVG into React components using SVGR',
		defaults: {
			name: 'SVGR',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'SVG Code',
				name: 'svgCode',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				placeholder: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>',
				description: 'The SVG code to transform into a React component',
				required: true,
			},
			{
				displayName: 'Component Name',
				name: 'componentName',
				type: 'string',
				default: 'SvgComponent',
				placeholder: 'SvgComponent',
				description: 'The name of the React component to generate',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Add Fill Current Color',
						name: 'addFillCurrentColor',
						type: 'boolean',
						default: false,
						description: 'Whether to add fill="currentColor" to the SVG element (removes existing fill attributes)',
					},
					{
						displayName: 'Desc Prop',
						name: 'descProp',
						type: 'boolean',
						default: false,
						description: 'Whether to add desc and descId props for accessibility (adds aria-describedby)',
					},
					{
						displayName: 'Dimensions',
						name: 'dimensions',
						type: 'boolean',
						default: false,
						description: 'Whether to keep width and height attributes from the original SVG',
					},
					{
						displayName: 'Expand Props',
						name: 'expandProps',
						type: 'options',
						options: [
							{
								name: 'End (Default)',
								value: 'end',
								description: 'Add {...props} at the end of SVG attributes',
							},
							{
								name: 'Start',
								value: 'start',
								description: 'Add {...props} at the start of SVG attributes',
							},
							{
								name: 'None',
								value: 'none',
								description: 'Do not add props spread',
							},
						],
						default: 'end',
						description: 'Where to expand props on the SVG element',
					},
					{
						displayName: 'Export Type',
						name: 'exportType',
						type: 'options',
						options: [
							{
								name: 'Default Export',
								value: 'default',
								description: 'Use export default Component',
							},
							{
								name: 'Named Export',
								value: 'named',
								description: 'Use export { Component }',
							},
						],
						default: 'default',
						description: 'How to export the generated component',
					},
					{
						displayName: 'Icon',
						name: 'icon',
						type: 'boolean',
						default: true,
						description:
							'Whether to remove width and height attributes for scalable icons',
					},
					{
						displayName: 'JSX Runtime',
						name: 'jsxRuntime',
						type: 'options',
						options: [
							{
								name: 'Classic',
								value: 'classic',
								description: 'Use classic JSX runtime (requires React import)',
							},
							{
								name: 'Automatic',
								value: 'automatic',
								description: 'Use automatic JSX runtime (React 17+, minimal imports)',
							},
						],
						default: 'classic',
						description: 'Which JSX runtime to use for the generated component',
					},
					{
						displayName: 'Memo',
						name: 'memo',
						type: 'boolean',
						default: false,
						description: 'Whether to wrap the component with React.memo for performance optimization',
					},
					{
						displayName: 'Native (React Native)',
						name: 'native',
						type: 'boolean',
						default: false,
						description: 'Whether to generate React Native SVG compatible code using react-native-svg',
					},
					{
						displayName: 'Prettier',
						name: 'prettier',
						type: 'boolean',
						default: true,
						description: 'Whether to format the output code',
					},
					{
						displayName: 'Ref (ForwardRef)',
						name: 'ref',
						type: 'boolean',
						default: false,
						description: 'Whether to forward ref to the SVG element using forwardRef',
					},
					{
						displayName: 'Remove View Box',
						name: 'removeViewBox',
						type: 'boolean',
						default: false,
						description: 'Whether to remove the viewBox attribute',
					},
					{
						displayName: 'SVGO',
						name: 'svgo',
						type: 'boolean',
						default: true,
						description: 'Whether to apply SVGO optimizations (removes xmlns, style, shape-rendering attributes)',
					},
					{
						displayName: 'Title Prop',
						name: 'titleProp',
						type: 'boolean',
						default: false,
						description: 'Whether to add title and titleId props for accessibility (adds aria-labelledby)',
					},
					{
						displayName: 'TypeScript',
						name: 'typescript',
						type: 'boolean',
						default: false,
						description: 'Whether to generate TypeScript code with SVGProps type',
					},
				],
			},
			{
				displayName: 'Replace Attribute Values',
				name: 'replaceAttrValues',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Replacement',
				default: {},
				options: [
					{
						name: 'replacements',
						displayName: 'Replacements',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'string',
								default: '',
								placeholder: '#000',
								description: 'The attribute value to replace',
							},
							{
								displayName: 'To',
								name: 'to',
								type: 'string',
								default: '',
								placeholder: 'currentColor',
								description: 'The new value to use',
							},
						],
					},
				],
				description: 'Replace attribute values in the SVG (e.g., #000 → currentColor)',
			},
			{
				displayName: 'SVG Props',
				name: 'svgProps',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add SVG Prop',
				default: {},
				options: [
					{
						name: 'props',
						displayName: 'Props',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								placeholder: 'role',
								description: 'The prop name to add',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'img',
								description: 'The prop value',
							},
						],
					},
				],
				description: 'Add custom props to the SVG element (e.g., role="img", aria-label)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const svgCode = this.getNodeParameter('svgCode', itemIndex, '') as string;

				if (!svgCode || svgCode.trim() === '') {
					throw new NodeOperationError(
						this.getNode(),
						'SVG Code is required and cannot be empty',
						{ itemIndex }
					);
				}

				const componentName = this.getNodeParameter('componentName', itemIndex, 'SvgComponent') as string;

				const options = this.getNodeParameter('options', itemIndex, {}) as {
					icon?: boolean;
					typescript?: boolean;
					prettier?: boolean;
					dimensions?: boolean;
					addFillCurrentColor?: boolean;
					svgo?: boolean;
					removeViewBox?: boolean;
					jsxRuntime?: 'classic' | 'automatic';
					ref?: boolean;
					memo?: boolean;
					expandProps?: 'start' | 'end' | 'none';
					titleProp?: boolean;
					descProp?: boolean;
					native?: boolean;
					exportType?: 'default' | 'named';
				};

				const replaceAttrValuesRaw = this.getNodeParameter('replaceAttrValues', itemIndex, {}) as {
					replacements?: Array<{ from: string; to: string }>;
				};

				const svgPropsRaw = this.getNodeParameter('svgProps', itemIndex, {}) as {
					props?: Array<{ name: string; value: string }>;
				};

				// Convert replaceAttrValues array to object
				const replaceAttrValues: Record<string, string> = {};
				if (replaceAttrValuesRaw.replacements) {
					for (const replacement of replaceAttrValuesRaw.replacements) {
						if (replacement.from && replacement.to) {
							replaceAttrValues[replacement.from] = replacement.to;
						}
					}
				}

				// Convert svgProps array to object
				const svgProps: Record<string, string> = {};
				if (svgPropsRaw.props) {
					for (const prop of svgPropsRaw.props) {
						if (prop.name && prop.value) {
							svgProps[prop.name] = prop.value;
						}
					}
				}

				// Handle expandProps conversion (none -> false)
				const expandProps: 'start' | 'end' | false = options.expandProps === 'none' ? false : (options.expandProps || 'end');

				const transformOptions = {
					componentName,
					icon: options.icon !== undefined ? options.icon : true,
					typescript: options.typescript !== undefined ? options.typescript : false,
					prettier: options.prettier !== undefined ? options.prettier : true,
					dimensions: options.dimensions !== undefined ? options.dimensions : false,
					addFillCurrentColor: options.addFillCurrentColor !== undefined ? options.addFillCurrentColor : false,
					svgo: options.svgo !== undefined ? options.svgo : true,
					removeViewBox: options.removeViewBox !== undefined ? options.removeViewBox : false,
					jsxRuntime: options.jsxRuntime || 'classic',
					ref: options.ref !== undefined ? options.ref : false,
					memo: options.memo !== undefined ? options.memo : false,
					replaceAttrValues: Object.keys(replaceAttrValues).length > 0 ? replaceAttrValues : undefined,
					svgProps: Object.keys(svgProps).length > 0 ? svgProps : undefined,
					expandProps,
					titleProp: options.titleProp !== undefined ? options.titleProp : false,
					descProp: options.descProp !== undefined ? options.descProp : false,
					native: options.native !== undefined ? options.native : false,
					exportType: options.exportType || 'default',
				};

				const reactCode = transformSvg(svgCode, transformOptions);

				const item: INodeExecutionData = {
					json: {
						reactCode,
						svgCode,
						componentName,
						options: transformOptions,
					},
					pairedItem: itemIndex,
				};

				returnData.push(item);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
