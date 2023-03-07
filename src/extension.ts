import * as vscode from 'vscode';

// disposables
import { generateHTML } from './disposables/generateHtml';

// utilities
import { initializeStatusbar } from './utils/statusBar';
import { workingDirectory } from './utils/workingDirectory';

export const activate = async (context: vscode.ExtensionContext) => {
	let activated = false;
	initializeStatusbar();

	const activationDisposable = vscode.commands.registerCommand('htmlfy.activate', () => {
		activated = !activated;
		vscode.window.showInformationMessage(`Extension ${activated ? 'activated' : 'deactivated'}.`);
	});
	
	const htmlDisposable = generateHTML();
	
	context.subscriptions.push(activationDisposable, htmlDisposable, vscode.workspace.onDidSaveTextDocument(() => {
		const workspace = workingDirectory();
		if (activated && workspace.liquidDirectory) {
			vscode.commands.executeCommand('htmlfy.run');
		}
	}));
};

export const deactivate = () => {};