import * as vscode from 'vscode';

import fs = require("fs");
import liquid = require("liquidjs");
import path = require('path');

import { workingDirectory } from "./workingDirectory";
import { liquidParser } from './liquidParser';

let jsonFile = "";

export const liquidEngine = async (workspaceFolder: readonly vscode.WorkspaceFolder[]) => {
    const workspacePath = workingDirectory().fileName;
    if (workspacePath !== undefined) {
        const content = fs.readFileSync(workspacePath, 'utf-8');
        
        const engine = new liquid.Liquid({
            root: [workspacePath, path.join(workspaceFolder[0].uri.fsPath, 'snippets')],
            greedy: false,
            dynamicPartials: true,
            extname: '.liquid'
        });

        engine.registerTag('schema', {
            parse: function (_, remainTokens) {
                this.tokens = [];
                while(remainTokens.length) {
                    let token = remainTokens.shift();
                    if (token instanceof liquid.TagToken && token.input === "{% endschema %}") { break; };
                    this.tokens.push(token);
                }
            },
            render: () => { return ''; }
        });

        const setJSONFile = (file: string) => { 
            jsonFile = file;
        };

        const parsedContent = await liquidParser({content, jsonFile, setJSONFile});

        if (parsedContent) {
            return await engine.parseAndRender(parsedContent).then((html: string) => {
                html = html.replace('<script src="', '<script src="./assets/');
                return html;
            });
        }
    }
};