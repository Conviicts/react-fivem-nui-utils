"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugEvent = exports.getDebugData = exports.debugData = void 0;
var isDevMode_1 = require("./isDevMode");
/**
 * Stockage global des données de test pour le développement.
 */
var __DEBUG_DATA__ = {};
/**
 * Définit des données de test accessibles globalement en mode développement.
 * @param key Clé d'accès (ex: 'adminAccount')
 * @param value Valeur à stocker (ex: { username, password })
 */
var debugData = function (key, value) {
    if ((0, isDevMode_1.IsDevMode)()) {
        __DEBUG_DATA__[key] = value;
    }
};
exports.debugData = debugData;
/**
 * Récupère une donnée de test par sa clé (ou undefined si absente).
 * @param key Clé d'accès
 */
var getDebugData = function (key) {
    if ((0, isDevMode_1.IsDevMode)()) {
        return __DEBUG_DATA__[key];
    }
    return undefined;
};
exports.getDebugData = getDebugData;
/**
 * Déclenche des événements personnalisés pour le debug en mode navigateur.
 * @param events Liste des événements à simuler.
 * @param timer Délai entre chaque événement (ms).
 */
var DebugEvent = function (events, timer) {
    if (timer === void 0) { timer = 1000; }
    // Utilise process.env.NODE_ENV à la place de import.meta.env.MODE
    if (process.env.NODE_ENV === "development" && (0, isDevMode_1.IsDevMode)()) {
        events.forEach(function (event, idx) {
            setTimeout(function () {
                window.dispatchEvent(new MessageEvent("message", {
                    data: {
                        action: event.action,
                        data: event.data,
                    },
                }));
            }, timer * idx);
        });
    }
};
exports.DebugEvent = DebugEvent;
