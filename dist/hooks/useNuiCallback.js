import { useCallback, useContext, useRef, useState } from "react";
import { NuiContext } from "../context/NuiContext";
import { eventNameFactory } from "../utils/eventNameFactory";
import { useNuiEvent } from "./useNuiEvent";
/**
 * @callback nuiEventHandler
 * @param {any} responseData
 *
 * @callback nuiEventErrorHandler
 * @param {any} responseError
 *
 * @function nuiFetchFn
 * @param {any} data - Request body
 * @param {Object} options - Fetch options
 * @param {string} options.timeout - Timeout to stop waiting for callback response in milliseconds.
 */
/**
 * Make a callback to "myEvent" by sending back "myEventSuccess" or "myEventError" from the client
 * @param {string} app needs to be the same here and in the success and error response events
 * @param {string} method the event name which is sent to client
 * @param {nuiEventHandler} [handler] receive the data sent by the client when success
 * @param {nuiEventErrorHandler} [errHandler]  receive the data sent by the client when errored
 * @returns {[nuiFetchFn, { loading, error, response }]} [fetchFn, { loading, error, response }]
 * @example
 * const [user, setUser] = useState<IUser>(null)
 * const [fetchUser, { loading, error, response }] = useNuiCallback<number, IUser>("appname", "fetchUser", setUser);
 * useEffect(() => {
 *  fetchUser(11);
 * }, [fetchUser]);
 */
export const useNuiCallback = (app, method, handler, errHandler) => {
    const { sendAbortable, callbackTimeout } = useContext(NuiContext);
    const fetchRef = useRef(null);
    if (!app || !method) {
        throw new Error("App and method are required arguments.");
    }
    const timeoutRef = useRef(null);
    // These are Refs to avoid re renders.
    // We dont care if "app" and "method" arguments change.
    const eventNameRef = useRef(eventNameFactory(app, method));
    const methodNameRef = useRef(method);
    const appNameRef = useRef(app);
    // has timed out
    const [timedOut, setTimedOut] = useState(false);
    // has failed at network or browser level
    const [failed, setFailed] = useState(false);
    // is waiting for server callback response event
    const [loading, setLoading] = useState(false);
    // returned error from server callback event or network failure
    const [error, setError] = useState(null);
    // response from server callback event
    const [response, setResponse] = useState(null);
    const onSuccess = useCallback((data) => {
        if (!loading) {
            return;
        }
        // If we receive success event, clear timeout
        timeoutRef.current && clearTimeout(timeoutRef.current);
        // If already timed out, don't do shit :)
        if (timedOut) {
            return;
        }
        // Set new state after success event received
        setResponse(data);
        setError(null);
        setLoading(false);
        handler?.(data);
    }, [handler, timedOut, loading]);
    const onError = useCallback((err) => {
        // If we receive error event, clear timeout
        timeoutRef.current && clearTimeout(timeoutRef.current);
        // Set new state after error event received
        setError(err);
        setResponse(null);
        setLoading(false);
        errHandler?.(err);
    }, [errHandler]);
    // Handle the success and error events for this method
    useNuiEvent(appNameRef.current, `${methodNameRef.current}Success`, onSuccess);
    useNuiEvent(appNameRef.current, `${methodNameRef.current}Error`, onError);
    // Only fetch if we are not loading/waiting the events.
    const fetch = useCallback((data, options) => {
        setLoading((curr) => {
            if (!curr) {
                setTimedOut(false);
                setFailed(false);
                setError(null);
                setResponse(null);
                fetchRef.current = sendAbortable(methodNameRef.current, data);
                fetchRef.current.promise.catch((e) => {
                    if (!timedOut) {
                        onError(e);
                        setFailed(true);
                        timeoutRef.current = undefined;
                        fetchRef.current = undefined;
                    }
                });
                const _options = options || { timeout: callbackTimeout };
                const timeoutTime = _options.timeout === false ? false : _options.timeout || callbackTimeout;
                if (timeoutTime && !failed) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                        setTimedOut(true);
                        onError(new Error(`react-fivem-nui-utils: "${eventNameRef.current}" event callback timed out after ${timeoutTime} milliseconds`));
                        fetchRef.current && fetchRef.current.abort();
                        timeoutRef.current = undefined;
                        fetchRef.current = undefined;
                    }, timeoutTime);
                }
                return true;
            }
            return curr;
        });
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return [fetch, { loading, response, error }];
};
