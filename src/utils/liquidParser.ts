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
    },
    blocks: IBlocks
}

interface IBlocks {
    settings: {
        [key: string]: string
    },
}

export const liquidParser = async ({ content, jsonFile, setJSONFile }: ILiquidParser) => {
    const sectionMatcher = /{{{0,1}\s*section\.settings\.[^\s}]+\s*}}{0,1}/g;
    const sectionMatches = content.match(sectionMatcher);

    const blockMatcher = /{%\s*for\s+(\w+)\s+in\s+\w+\.[\w.]+\s*%}([\s\S]*?){%\s*endfor\s*%}/;
    const blockMatches = content.match(blockMatcher);

    let jsonData, json, workspacePath;
    if (sectionMatches || blockMatches) {
        jsonData = await getJSONFile(jsonFile);

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

        json = JSON.parse(jsonToParse);

        workspacePath = workingDirectory().fileName;
    }

    if (sectionMatches) {
        const parsedMatches = sectionMatches.map(tag => tag.replaceAll(' ', '').replaceAll('{', '').replaceAll('}', ''));
        const filteredMatches = parsedMatches.map(e => e.split(".").pop());

        if (jsonData === undefined) {
            return;
        }

        if (workspacePath) {
            let workFolder = path.basename(workspacePath);
            workFolder = workFolder.replace(".liquid", "");

            const sections: ISections[] = Object.values(json.sections);
            const cor = sections.find(e => e.type === workFolder);
           
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
    };

    if (blockMatches) {
        if (workspacePath) {
            let workFolder = path.basename(workspacePath);
            workFolder = workFolder.replace(".liquid", "");
            
            const sections: ISections[] = Object.values(json.sections);
            const cor = sections.find(e => e.type === workFolder);

            const loopIdentifier = blockMatches[1];
            const innerContent = blockMatches[2];

            const regex = new RegExp(`{{{0,1}\\s*${loopIdentifier}\\.settings\\.[^\\s}]+\\s*}}{0,1}`, 'g');
            const blockContent = innerContent.match(regex);
            if (cor) {
                const sectionBlocks: IBlocks[] = Object.values(cor.blocks);
                
                let newContent = '';
                sectionBlocks.forEach(block => {
                    const blockSettings = block.settings;
                    if (blockContent) {
                        
                        const parsedMatches = blockContent.map(tag => tag.replaceAll(' ', '').replaceAll('{', '').replaceAll('}', ''));
                        const filteredMatches = parsedMatches.map(e => e.split(".").pop());

                        filteredMatches.forEach((key, index) => {
                            if (key !== undefined) {
                                newContent += innerContent.replace(blockContent[index], blockSettings[key]);
                            }
                        });
                    }
                });

                content = content.replace(blockMatches[0], newContent);
            }
        }
    }

    return content;
};