/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/home",{

/***/ "(pages-dir-browser)/./src/components/UserHeader.js":
/*!**************************************!*\
  !*** ./src/components/UserHeader.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(pages-dir-browser)/./src/components/UserLayout.js":
/*!**************************************!*\
  !*** ./src/components/UserLayout.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ UserLayout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _UserSidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UserSidebar */ \"(pages-dir-browser)/./src/components/UserSidebar.js\");\n/* harmony import */ var _UserHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserHeader */ \"(pages-dir-browser)/./src/components/UserHeader.js\");\n/* harmony import */ var _UserHeader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_UserHeader__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/UserLayout.module.css */ \"(pages-dir-browser)/./src/styles/UserLayout.module.css\");\n/* harmony import */ var _styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconsole.log(\"UserSidebar:\", _UserSidebar__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\nconsole.log(\"UserHeader:\", (_UserHeader__WEBPACK_IMPORTED_MODULE_2___default()));\nfunction UserLayout(param) {\n    let { children } = param;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (_styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3___default().layout),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_UserSidebar__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {}, void 0, false, {\n                fileName: \"D:\\\\restaurant-management-system\\\\src\\\\components\\\\UserLayout.js\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3___default().contentWrapper),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_UserHeader__WEBPACK_IMPORTED_MODULE_2___default()), {}, void 0, false, {\n                        fileName: \"D:\\\\restaurant-management-system\\\\src\\\\components\\\\UserLayout.js\",\n                        lineNumber: 13,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                        className: (_styles_UserLayout_module_css__WEBPACK_IMPORTED_MODULE_3___default().mainContent),\n                        children: children\n                    }, void 0, false, {\n                        fileName: \"D:\\\\restaurant-management-system\\\\src\\\\components\\\\UserLayout.js\",\n                        lineNumber: 14,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\restaurant-management-system\\\\src\\\\components\\\\UserLayout.js\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\restaurant-management-system\\\\src\\\\components\\\\UserLayout.js\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, this);\n}\n_c = UserLayout;\nvar _c;\n$RefreshReg$(_c, \"UserLayout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL1VzZXJMYXlvdXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQXdDO0FBQ0Y7QUFDZTtBQUVyREcsUUFBUUMsR0FBRyxDQUFDLGdCQUFnQkosb0RBQVdBO0FBQ3ZDRyxRQUFRQyxHQUFHLENBQUMsZUFBZUgsb0RBQVVBO0FBRXRCLFNBQVNJLFdBQVcsS0FBWTtRQUFaLEVBQUVDLFFBQVEsRUFBRSxHQUFaO0lBQ2pDLHFCQUNFLDhEQUFDQztRQUFJQyxXQUFXTiw2RUFBYTs7MEJBQzNCLDhEQUFDRixvREFBV0E7Ozs7OzBCQUNaLDhEQUFDTztnQkFBSUMsV0FBV04scUZBQXFCOztrQ0FDbkMsOERBQUNELG9EQUFVQTs7Ozs7a0NBQ1gsOERBQUNVO3dCQUFLSCxXQUFXTixrRkFBa0I7a0NBQUdJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJOUM7S0FWd0JEIiwic291cmNlcyI6WyJEOlxccmVzdGF1cmFudC1tYW5hZ2VtZW50LXN5c3RlbVxcc3JjXFxjb21wb25lbnRzXFxVc2VyTGF5b3V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVc2VyU2lkZWJhciBmcm9tIFwiLi9Vc2VyU2lkZWJhclwiO1xyXG5pbXBvcnQgVXNlckhlYWRlciBmcm9tIFwiLi9Vc2VySGVhZGVyXCI7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSBcIi4uL3N0eWxlcy9Vc2VyTGF5b3V0Lm1vZHVsZS5jc3NcIjtcclxuXHJcbmNvbnNvbGUubG9nKFwiVXNlclNpZGViYXI6XCIsIFVzZXJTaWRlYmFyKTtcclxuY29uc29sZS5sb2coXCJVc2VySGVhZGVyOlwiLCBVc2VySGVhZGVyKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVzZXJMYXlvdXQoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMubGF5b3V0fT5cclxuICAgICAgPFVzZXJTaWRlYmFyIC8+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGVudFdyYXBwZXJ9PlxyXG4gICAgICAgIDxVc2VySGVhZGVyIC8+XHJcbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPXtzdHlsZXMubWFpbkNvbnRlbnR9PntjaGlsZHJlbn08L21haW4+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiVXNlclNpZGViYXIiLCJVc2VySGVhZGVyIiwic3R5bGVzIiwiY29uc29sZSIsImxvZyIsIlVzZXJMYXlvdXQiLCJjaGlsZHJlbiIsImRpdiIsImNsYXNzTmFtZSIsImxheW91dCIsImNvbnRlbnRXcmFwcGVyIiwibWFpbiIsIm1haW5Db250ZW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./src/components/UserLayout.js\n"));

/***/ })

});