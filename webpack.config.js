"use strict";
/**
 * @name
 * @description
 *
 * @author xuyuanxiang
 * @date 2016/10/27
 */
var webpack_1 = require("webpack");
var DedupePlugin = webpack_1.optimize.DedupePlugin, OccurrenceOrderPlugin = webpack_1.optimize.OccurrenceOrderPlugin;
var path_1 = require("path");
var fs_1 = require('fs');
var files = fs_1.readdirSync('./src');
var entry = {};
files.forEach(function (file) { return entry[file.replace('.ts', '')] = "./src/" + file; });
var Configs = (function () {
    function Configs() {
        this.entry = entry;
        this.output = {
            path: path_1.resolve("./"),
            filename: "[name]/index.js",
            libraryTarget: "commonjs"
        };
        this.externals = {
            "yeoman-generator": true
        };
        this.resolve = {
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        };
        this.module = {
            loaders: [
                {
                    test: /\.ts?$/,
                    exclude: /node_modules/,
                    loader: "ts"
                }
            ]
        };
        this.plugins = [
            new DedupePlugin(),
            new OccurrenceOrderPlugin(true)
        ];
    }
    return Configs;
}());
var configs = new Configs();
module.exports = configs;
