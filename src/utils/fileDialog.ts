import * as vscode from 'vscode';
import fs = require("fs");

interface IGetJSONFILE {
    json: string,
    file: string
}

type TJsonFile = IGetJSONFILE | string | void;

export const getJSONFile = async (jsonFile: string): Promise<TJsonFile> => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    };
    const folderURI = vscode.Uri.joinPath(workspaceFolders[0].uri, 'templates');

    const files = await vscode.workspace.fs.readDirectory(folderURI);
    const fileNames = files.filter(file => file[1] === vscode.FileType.File).map(file => file[0]);
    
    if (jsonFile === "") {
        const fileName = await vscode.window.showInputBox({
            prompt: 'Select a template file:',
            placeHolder: 'File name',
            value: '',
            ignoreFocusOut: true,
            validateInput: value => {
                if (!value || !fileNames.includes(value)) {
                    return 'Invalid file name.';
                }
            }
        });
    
        if (fileName) {
            const filePath = vscode.Uri.joinPath(folderURI, fileName).fsPath;
            const jsondata = {
                json: fs.readFileSync(filePath, 'utf-8'),
                file: fileName
            };
            return jsondata;
        }
    } else {
        const filePath = vscode.Uri.joinPath(folderURI, jsonFile).fsPath;
        return fs.readFileSync(filePath, 'utf-8');
    }
};