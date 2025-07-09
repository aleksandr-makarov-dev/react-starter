import { useState } from "react";

export function useDisclouse() {
  const [state, setState] = useState<{ open: boolean }>({
    open: false,
  });

  function open() {
    setState({ open: true });
  }

  function close() {
    setState({ open: false });
  }

  return {
    isOpen: state.open,
    open,
    close,
  };
}
