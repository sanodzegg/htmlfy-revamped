import { extractFonts } from "./extractFontFaces";

export const htmlTemplate = (htmlHead: string, result: string) => {
    const fontFaces = extractFonts();

    let fontFaceStyle = '';

    if (fontFaces) {
        for (let fontFace of fontFaces) {
            fontFaceStyle += fontFace;
        }
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            ${(htmlHead !== '' || htmlHead !== undefined) && htmlHead}
            ${ fontFaceStyle !== '' ? `<style>${fontFaceStyle}</style>` : '' }
        </head>
        <body>
            ${(result !== '' || result !== undefined) && result}
        </body>
        </html>
    `;
};