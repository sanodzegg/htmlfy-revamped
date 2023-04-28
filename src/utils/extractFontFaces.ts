import * as vscode from 'vscode';
import path = require("path");
import fs = require("fs");

type FontName = RegExpMatchArray | string | null;

export const extractFonts = (): null | string[] => {
    const workspaceFolder = vscode.workspace.workspaceFolders;
    if (!workspaceFolder) { return null; }

    const themeFile = path.join(workspaceFolder[0].uri.fsPath, '/layout/theme.liquid');
    const content = fs.readFileSync(themeFile, "utf-8");

    const matcherExpression = /@font-face\s*{[\s\S]*?}(?=\s*@font-face|\s*<\/style>)/g;
    const fontFaceMatches = content.match(matcherExpression);

    if (fontFaceMatches && fontFaceMatches.length > 0) {
        for (let fontFace of fontFaceMatches) {
            const fontFaceLines = fontFace.match(/{{\s*'([^']*)'\s*\|\s*asset_url\s*}}/g);

            if (fontFaceLines) {
                for (let line of fontFaceLines) {
                    let fontName:FontName = line.match(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/);

                    if (fontName && fontName[1]) {
                        fontName = fontName[1];
                        // replace it
                    }
                }
            }
        }
        return [''];
    } else {
        return null;
    }
};