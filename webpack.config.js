const path = require('path');
const fs = require('fs');
const glob = require('glob');
const rimraf = require('rimraf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const IconfontPlugin = require('iconfont-plugin-webpack');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		main: [
			'./src/scripts/index.js',
			'./src/styles/index.scss'
		],
		sprite: glob.sync(path.resolve(__dirname, 'src/icons/**/*.svg'))
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
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(svg|eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							outputPath: 'fonts/'
						}
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-sprite-loader',
				include: path.resolve(__dirname, 'src/icons'),
				options: {
					extract: true,
					spriteFilename: 'sprite.svg'
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
			rimraf('dist/scripts/*sprite*', () => {});
		}),
		// new OptimizeCssAssetsPlugin({
		// 	cssProcessorOptions: {
		// 		map: {
		// 			inline: false,
		// 			annotation: true
		// 		}
		// 	}
		// }),
		new CopyWebpackPlugin([{
			from: 'src/images',
			to: 'images'
		}
		]),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new IconfontPlugin({
			src: './src/icons', // required - directory where your .svg files are located
			family: 'custom', // optional - the `font-family` name. if multiple iconfonts are generated, the dir names will be used.
			dest: {
				font: './dist/fonts/[family].[type]', // required - paths of generated font files
				css: './src/styles/_iconfont-[family].scss' // required - paths of generated css files
			},
			watch: {
				pattern: 'src/icons/**/*.svg', // required - watch these files to reload
				cwd: undefined // optional - current working dir for watching
			},
			cssTemplate: require('./src/iconfontSassTemplate') // optional - the function to generate css contents
		}),
		new SpriteLoaderPlugin()
	]
};
