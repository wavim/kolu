"use strict";
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const terserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "none",
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		library: "Kolu",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new terserPlugin()],
	},
};
