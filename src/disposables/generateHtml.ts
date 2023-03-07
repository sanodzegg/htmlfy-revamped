import * as vscode from 'vscode';
import path = require('path');
import { liquidEngine } from '../utils/liquidEngine';

export const generateHTML = (): vscode.Disposable => {
    return vscode.commands.registerCommand('htmlfy.run', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders;
        if (workspaceFolder) {
            const htmlFilePath = path.join(workspaceFolder[0].uri.fsPath, 'index.html');
            const parsedLiquid = await liquidEngine(workspaceFolder);
            console.log(parsedLiquid);
            
        } else {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        };
    });
};