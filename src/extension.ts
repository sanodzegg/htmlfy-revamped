import * as vscode from 'vscode';

import { initializeStatusbar } from './utils/statusBar';

export const activate = (context: vscode.ExtensionContext) => {
	initializeStatusbar();

	let disposable = vscode.commands.registerCommand('htmlfy.activate', () => {
		vscode.window.showInformationMessage('Activated htmlfy_revamped!');
	});

	context.subscriptions.push(disposable);
};

export const deactivate = () => {};