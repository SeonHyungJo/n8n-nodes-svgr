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
						displayName: 'Dimensions',
						name: 'dimensions',
						type: 'boolean',
						default: false,
						description: 'Whether to keep width and height attributes from the original SVG',
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
						displayName: 'Prettier',
						name: 'prettier',
						type: 'boolean',
						default: true,
						description: 'Whether to format the output code',
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
						displayName: 'TypeScript',
						name: 'typescript',
						type: 'boolean',
						default: false,
						description: 'Whether to generate TypeScript code with SVGProps type',
					},
				],
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
				};

				const transformOptions = {
					componentName,
					icon: options.icon !== undefined ? options.icon : true,
					typescript: options.typescript !== undefined ? options.typescript : false,
					prettier: options.prettier !== undefined ? options.prettier : true,
					dimensions: options.dimensions !== undefined ? options.dimensions : false,
					addFillCurrentColor: options.addFillCurrentColor !== undefined ? options.addFillCurrentColor : false,
					svgo: options.svgo !== undefined ? options.svgo : true,
					removeViewBox: options.removeViewBox !== undefined ? options.removeViewBox : false,
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
