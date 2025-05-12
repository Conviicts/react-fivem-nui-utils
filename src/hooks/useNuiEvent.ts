import { useEffect } from 'react';
import { debugEvent, isNuiEnvironment } from '../utils/safeFetch';

export function useNuiEvent(app: string, method: string, handler: (data: any) => void) {
  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      if (event.data.app === app && event.data.method === method) {
        handler(event.data.data);
      }
    };

    window.addEventListener('message', eventListener);

    // Simulate event in browser mode
    if (!isNuiEnvironment()) {
      debugEvent({ app, method, data: {} });
    }

    return () => {
      window.removeEventListener('message', eventListener);
    };
  }, [app, method, handler]);
}
