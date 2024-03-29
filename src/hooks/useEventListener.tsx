import { useEffect, useRef } from 'react';

export const useEventListener = <K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element = window
) => {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: WindowEventMap[K]) => void>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Create event listener that calls handler function stored in ref
      const eventListener = (event: WindowEventMap[K]) =>
        savedHandler.current && savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};
