/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeStatusbar = void 0;
const vscode = __webpack_require__(1);
const initializeStatusbar = () => {
    const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarButton.text = "HTMLfy Liquid";
    statusBarButton.command = "htmlfy.activate";
    statusBarButton.show();
};
exports.initializeStatusbar = initializeStatusbar;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const statusBar_1 = __webpack_require__(2);
const activate = (context) => {
    (0, statusBar_1.initializeStatusbar)();
    let disposable = vscode.commands.registerCommand('htmlfy.activate', () => {
        vscode.window.showInformationMessage('Activated htmlfy_revamped!');
    });
    context.subscriptions.push(disposable);
};
exports.activate = activate;
const deactivate = () => { };
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map