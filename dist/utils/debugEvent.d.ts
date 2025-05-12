interface IDebugEvent<T = unknown> {
    action: string;
    data: T;
}
/**
 * Définit des données de test accessibles globalement en mode développement.
 * @param key Clé d'accès (ex: 'adminAccount')
 * @param value Valeur à stocker (ex: { username, password })
 */
export declare const debugData: (key: string, value: any) => void;
/**
 * Récupère une donnée de test par sa clé (ou undefined si absente).
 * @param key Clé d'accès
 */
export declare const getDebugData: <T = any>(key: string) => T | undefined;
/**
 * Déclenche des événements personnalisés pour le debug en mode navigateur.
 * @param events Liste des événements à simuler.
 * @param timer Délai entre chaque événement (ms).
 */
export declare const DebugEvent: <P>(events: IDebugEvent<P>[], timer?: number) => void;
export {};
