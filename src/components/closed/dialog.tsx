import {
  Dialog as DialogRoot,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export type DialogProps = {
  title: string;
  description?: string;
  submitButton: React.ReactNode;
  children: React.ReactNode;
  cancelButtonLabel?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export function Dialog({
  title,
  description,
  submitButton,
  children,
  cancelButtonLabel = "Cancel",
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelButtonLabel}</Button>
          </DialogClose>
          {submitButton}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
