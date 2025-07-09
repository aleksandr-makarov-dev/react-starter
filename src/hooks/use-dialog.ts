import { useCallback, useState } from "react";

type DialogState<T> =
  | { isOpen: true; data: T }
  | { isOpen: false; data: undefined };

export function useDialog<T>() {
  const [state, setState] = useState<DialogState<T>>({
    isOpen: false,
    data: undefined,
  });

  const open = useCallback((data: T) => {
    setState({ isOpen: true, data: data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  return {
    state,
    open,
    close,
  };
}
