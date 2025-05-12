import { useEffect } from 'react';
import { debugEvent, isNuiEnvironment } from '../utils/safeFetch';

export function useNuiCallback(
  app: string,
  method: string,
  onSuccess: (data: any) => void,
  onError: (err: any) => void
) {
  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      if (event.data.app === app && event.data.method === method) {
        if (event.data.success) {
          onSuccess(event.data.data);
        } else {
          onError(event.data.error);
        }
      }
    };

    window.addEventListener('message', eventListener);

    // Simulate callback in browser mode
    if (!isNuiEnvironment()) {
      debugEvent({ app, method, data: { success: true, data: {} } });
    }

    return () => {
      window.removeEventListener('message', eventListener);
    };
  }, [app, method, onSuccess, onError]);
}
