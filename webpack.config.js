const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

const iconScss = fs.readdirSync(path.join(__dirname, './src/icons'))
	.reduce((files, file) => {
		const fileName = path.basename(file, path.extname(file))

		return files.concat(`.icon-${fileName} { &::before { font-icon: url('../icons/${fileName}.svg'); } }`);
	}, '');

module.exports = {
	devtool: 'source-map',
	entry: {
		main: [
			'./src/scripts/index.js',
			'./src/styles/index.scss'
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'scripts/[name].bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: false,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: (loader) => [
							  new IconfontWebpackPlugin(loader)
							]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							// Inject
							data: iconScss,
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.svg/,
				use: {
					loader: 'svg-url-loader',
					options: {}
				}
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles/[name].bundle.css'
		}),
		new WebpackOnBuildPlugin(() => {
			// Do stuff after webpack has finished
		}),
		new OptimizeCssAssetsPlugin({
			cssProcessorOptions: {
				map: {
					inline: false,
					annotation: true
				}
			}
		}),
		new CopyWebpackPlugin([{
			from: 'src/images',
			to: 'images'
		}
		]),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	]
};
