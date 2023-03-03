import * as vscode from 'vscode';

export const initializeStatusbar = () => {
    const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    
    statusBarButton.text = "HTMLfy Liquid";
    statusBarButton.command = "htmlfy.activate";

    statusBarButton.show();
};