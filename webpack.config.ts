/**
 * @name
 * @description
 *
 * @author xuyuanxiang
 * @date 2016/10/27
 */
import {Configuration, Entry, Output, Module, Plugin, ExternalsElement, Resolve, optimize} from "webpack";
const {DedupePlugin, OccurrenceOrderPlugin} = optimize;
import {resolve} from "path";
import {readdirSync} from 'fs';

const files: string[] = readdirSync('./src');
const entry: Entry = {};
files.forEach((file: string)=>entry[file.replace('.ts', '')] = `./src/${file}`);

class Configs implements Configuration {
    entry: Entry = entry;
    output: Output = {
        path: resolve("./"),
        filename: "[name]/index.js",
        libraryTarget: "commonjs"
    };
    target: "node";
    externals: ExternalsElement = {
        "yeoman-generator": true,
    }
    resolve: Resolve = {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }
    module: Module = {
        loaders: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: "ts",
            }
        ]
    };
    plugins: Plugin[] = [
        new DedupePlugin(),
        new OccurrenceOrderPlugin(true)
    ]
}

const configs = new Configs();
export = configs;

