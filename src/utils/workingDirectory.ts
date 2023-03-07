import * as vscode from 'vscode';

interface IWorkspace {
    liquidDirectory: boolean | undefined,
    fileName: string | undefined
}

export const workingDirectory = ():IWorkspace => {
    const textEditor = vscode.window.activeTextEditor;
    const currentFile = textEditor?.document.fileName;

    return {
        liquidDirectory: currentFile?.endsWith(".liquid"),
        fileName: currentFile
    };
};