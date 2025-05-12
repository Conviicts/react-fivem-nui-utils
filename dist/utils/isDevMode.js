"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsDevMode = void 0;
var IsDevMode = function () { return !window.invokeNative; };
exports.IsDevMode = IsDevMode;
