import { useState, type ReactNode } from "react";

// source: https://www.esveo.com/en/blog/O5/

/**
 * A function that takes a result of a variable type and returns nothing.
 * This will close our modal and return to the caller of `openModal`.
 */
type CloseModal<ResultType> = (result: ResultType) => void;

/**
 * A function that builds the UI for a modal dialog.
 * It takes the close function as a parameter and returns a `ReactNode`
 * that we can display.
 */
type ModalFactory<ResultType> = (close: CloseModal<ResultType>) => ReactNode;

export function useModal() {
  // The react node has to be stored somewhere
  const [modalNode, setModalNode] = useState<ReactNode>(null);

  function openModal<ModalResult>(modalFactory: ModalFactory<ModalResult>) {
    return new Promise<ModalResult>((resolve) => {
      function close(value: ModalResult) {
        resolve(value);

        // When the modal should be closed, we set our state to null
        // to stop rendering a dialog
        setModalNode(null);
      }

      // To open the dialog, we store the resulting jsx in our state
      setModalNode(modalFactory(close));
    });
  }

  // We return the modalNode (or null) and the openModal function
  return [modalNode, openModal] as const;
}
