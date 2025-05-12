import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from "react";
import { NuiContext } from "../context/NuiContext";
import { eventNameFactory } from "../utils/eventNameFactory";
function abortableFetch(request, opts) {
    const controller = new AbortController();
    const signal = controller.signal;
    return {
        abort: () => controller.abort(),
        promise: fetch(request, { ...opts, signal }),
    };
}
function getParams(resource, event, data) {
    return [
        `https://${resource}/${event}`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(data),
        },
    ];
}
const DEFAULT_TIMEOUT = 10000;
export const NuiProvider = ({ resource, children, timeout, }) => {
    const resourceRef = useRef(resource || "");
    const timeoutRef = useRef(timeout || DEFAULT_TIMEOUT);
    const eventListener = (event) => {
        const { app, method, data } = event.data;
        if (app && method) {
            window.dispatchEvent(new MessageEvent(eventNameFactory(app, method), {
                data,
            }));
        }
    };
    useEffect(() => {
        window.addEventListener("message", eventListener);
        return () => window.removeEventListener("message", eventListener);
    }, []);
    const send = useCallback(async (event, data = {}, res) => {
        return fetch(...getParams(res || resourceRef.current, event, data));
    }, []);
    const sendAbortable = useCallback((event, data = {}, res) => {
        return abortableFetch(...getParams(res || resourceRef.current, event, data));
    }, []);
    return (_jsx(NuiContext.Provider, { value: {
            send,
            sendAbortable,
            resource: resourceRef.current,
            callbackTimeout: timeoutRef.current,
        }, children: children }));
};
