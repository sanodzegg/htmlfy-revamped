import * as vscode from 'vscode';
import path = require("path");

import { getJSONFile } from "./fileDialog";
import { workingDirectory } from "./workingDirectory";

interface ILiquidParser {
    content: string,
    jsonFile: string,
    setJSONFile: (file: string) => void
}

interface ISections {
    type: string,
    settings: {
        [key: string]: string
    }
}

export const liquidParser = async ({ content, jsonFile, setJSONFile }: ILiquidParser) => {
    const sectionMatcher = /{{{0,1}\s*section\.settings\.[^\s}]+\s*}}{0,1}/g;
    const sectionMatches = content.match(sectionMatcher);

    if (sectionMatches) {
        const parsedMatches = sectionMatches.map(tag => tag.replaceAll(' ', '').replaceAll('{', '').replaceAll('}', ''));
        const filteredMatches = parsedMatches.map(e => e.split(".").pop());
        
        const jsonData = await getJSONFile(jsonFile);

        if (jsonData === undefined) {
            return;
        }

        let jsonToParse = "";

        if (typeof jsonData === "string") {
            jsonToParse = jsonData;
        } else {
            jsonToParse = jsonData.json;
            setJSONFile(jsonData.file);
        }

        const json = JSON.parse(jsonToParse);

        const workspacePath = workingDirectory().fileName;
        if (workspacePath) {
            let workFolder = path.basename(workspacePath);
            workFolder = workFolder.replace(".liquid", "");

            const sections: ISections[] = Object.values(json.sections);

            const cor = sections.find(e => e.type === workFolder);
           
            console.log(cor);
            
            if (cor) {
                filteredMatches.forEach((key, index) => {
                    if (key !== undefined) {
                        content = content.replace(sectionMatches[index], cor.settings[key]);
                    }
                });
            } else {
                const result = await vscode.window.showWarningMessage("Template file doesn't seem to match with the current working liquid file.", "Select File");
                if (result === "Select File") {
                    jsonFile = "";
                    const jsonData = await getJSONFile(jsonFile);

                    if (jsonData && typeof jsonData !== "string") {
                        setJSONFile(jsonData.file);
                    }
                };
            }
        }
    }
    return content;
};