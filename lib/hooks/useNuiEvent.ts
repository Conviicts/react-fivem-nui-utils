import { RefObject, useEffect, useRef } from "react";
import { eventNameFactory } from "../utils/eventNameFactory";

function addEventListener<T extends EventTarget, E extends Event>(
  element: T,
  type: string,
  handler: (this: T, evt: E) => void
) {
  element.addEventListener(type, handler as (evt: Event) => void);
}

/**
 * @callback nuiEventHandler
 * @param {any} responseData
 */

/**
 * A hook to receive data from the client in the following schema:
 *
 * {
 *   "app": "app-name",
 *   "method": "method-name",
 *   "data": { anyValue: 1 }
 * }
 *
 * @param {string} app The app name which the client will emit to
 * @param {string} method  The specific `method` field that should be listened for.
 * @param {nuiEventHandler} handler The callback function that will handle the data received from the server
 *
 * @example
 * const [dataState, setDataState] = useState<boolean>();
 * useNuiEvent<boolean>("appname", "methodname", setDataState);
 **/
export const useNuiEvent = <D = unknown>(app: string, method: string, handler: (r: D) => void): void => {
  const savedHandler: RefObject<(r: D) => void> = useRef(null);

  // When handler value changes set mutable ref to handler val
  useEffect(() => {
    if (!app || !method || !handler) {
      throw new Error("App, method, and handler are required arguments.");
    }
    savedHandler.current = handler;
  }, [handler, app, method]);

  useEffect(() => {
    const eventName = eventNameFactory(app, method);
    const eventListener = (event) => {
      if (savedHandler.current && savedHandler.current.call) {
        const { data } = event;
        const newData = data;
        savedHandler.current(newData as D);
      }
    };

    addEventListener(window, eventName, eventListener);
    // Remove Event Listener on component cleanup
    return () => window.removeEventListener(eventName, eventListener);
  }, [app, method]);
};