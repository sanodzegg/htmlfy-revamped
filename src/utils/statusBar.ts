import * as vscode from 'vscode';

export const initializeStatusbar = () => {
    const activateButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    
    activateButton.text = "HTMLfy Liquid";
    activateButton.command = "htmlfy.activate";

    activateButton.show();
};