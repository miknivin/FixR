import Button from "@/components/ui/button/Button";
import React from "react";

interface ReusableAlertProps {
  content: string;
  title: string;
  func?: () => void;
  isOpen: boolean;
  onClose: () => void;
  functionTitle: string;
  buttonStyle?: string;
}

export default function ReusableAlert({
  content,
  title,
  func,
  isOpen,
  functionTitle,
  onClose,
  buttonStyle = "bg-red-600",
}: ReusableAlertProps) {
  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      id="my_modal_1"
      className="modal fixed inset-0 flex items-center justify-center bg-gray-800/70 dark:bg-gray-900/70 w-full h-full"
      open={isOpen}
      onClick={handleBackdropClick}
    >
      <div className="modal-box rounded-lg bg-white dark:bg-gray-900 p-7 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-50">{title}</h3>
        <p className="py-4 text-gray-800 dark:text-gray-50">{content}</p>
        <div className="modal-action flex justify-end gap-4">
          <Button
            className={`text-white ${buttonStyle} hover:${buttonStyle.replace("bg-", "hover:bg-")}`}
            onClick={() => {
              if (func) func();
              handleClose();
            }}
          >
            {functionTitle}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}