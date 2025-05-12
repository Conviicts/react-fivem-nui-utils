import { IsDevMode } from "./isDevMode";
/**
 * Stockage global des données de test pour le développement.
 */
const __DEBUG_DATA__ = {};
/**
 * Définit des données de test accessibles globalement en mode développement.
 * @param key Clé d'accès (ex: 'adminAccount')
 * @param value Valeur à stocker (ex: { username, password })
 */
export const debugData = (key, value) => {
    if (IsDevMode()) {
        __DEBUG_DATA__[key] = value;
    }
};
/**
 * Récupère une donnée de test par sa clé (ou undefined si absente).
 * @param key Clé d'accès
 */
export const getDebugData = (key) => {
    if (IsDevMode()) {
        return __DEBUG_DATA__[key];
    }
    return undefined;
};
/**
 * Déclenche des événements personnalisés pour le debug en mode navigateur.
 * @param events Liste des événements à simuler.
 * @param timer Délai entre chaque événement (ms).
 */
export const DebugEvent = (events, timer = 1000) => {
    // Utilise process.env.NODE_ENV à la place de import.meta.env.MODE
    if (process.env.NODE_ENV === "development" && IsDevMode()) {
        events.forEach((event, idx) => {
            setTimeout(() => {
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
