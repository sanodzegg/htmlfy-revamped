import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import pretty = require("pretty");

import { liquidEngine } from '../utils/liquidEngine';
import { htmlTemplate } from '../utils/htmlTemplate';

export const generateHTML = (): vscode.Disposable => {
    return vscode.commands.registerCommand('htmlfy.run', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders;
        if (workspaceFolder) {
            const htmlFilePath = path.join(workspaceFolder[0].uri.fsPath, 'index.html');
            const parsedLiquid = await liquidEngine(workspaceFolder);

            let assetFiles:string[] = [];
            let head = '';

            try {
                assetFiles = fs.readdirSync(path.join(workspaceFolder[0].uri.fsPath, "/assets/"));
                if (assetFiles) {
                    assetFiles.forEach((fileName: string) => {
                        if (fileName.endsWith(".css")) {
                            head += `<link rel="stylesheet" href="/assets/${fileName}" />\n`;
                        } else if (fileName.endsWith(".js")) {
                            head += `<script src="/assets/${fileName}" defer></script>\n`;
                        }
                    });
                }
            } catch (err) {
                vscode.window.showWarningMessage("No assets folder found.");
            }

            if (parsedLiquid) {
                head = head.split("\n").sort().join("\n");
                
                const html = htmlTemplate(head, parsedLiquid);
                const formatted = pretty(html);
                fs.writeFileSync(htmlFilePath, formatted);
            }
        } else {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        };
    });
};