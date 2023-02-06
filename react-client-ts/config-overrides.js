/**
 * react-scripts 采用 5.0.1 版本，该版本 webpack@^5.0.0，
 * webpack@^5.0.0 无需手动配置 wasm-loader
 */

const {
	override,
	disableEsLint,
	setWebpackOptimizationSplitChunks,
	addWebpackAlias,
	addWebpackResolve,
	addWebpackModuleRule,
	addBabelPlugin
} = require('customize-cra');

const path = require('path');

/**
 * customize-cra 的 addLessLoader 在 webpack5 中存在 bug，
 * 因此这里使用 addWebpackModuleRule 进行替换
 */
function addLessLoader(options) {
	return addWebpackModuleRule({
		test: /\.less$/,
		use: [
			'style-loader',
			'css-loader',
			'postcss-loader',
			{
				loader: 'less-loader',
				options,
			},
		],
	});
}

module.exports = {
	webpack: override(
		disableEsLint(),
		// 抽出公共模块
		setWebpackOptimizationSplitChunks({
			// 这里设置为 all 会出现 bug
			chunks: 'async',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
				},
			},
		}),
		// 别名添加， tsconfig.json也需要添加该别名。
		addWebpackAlias({
			src: path.resolve(__dirname, './src'),
		}),
		// 忽略后缀
		addWebpackResolve({
			extensions: ['.ts', '.tsx', '.js'],
		}),
		addLessLoader({
			lessOptions: {
				javascriptEnabled: true,
			},
		}),
		addBabelPlugin('lodash')
	),
};
