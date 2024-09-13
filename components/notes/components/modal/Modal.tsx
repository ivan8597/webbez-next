import React from "react";
import { useLanguageNotes } from "../hook/langContext";
import ModalBase from "./ModalBase";
type ModalProps = {
  title: string;
  text: string;
  onClose: () => void;
  onConfirm: () => void;
};
const Modal = ({ title, text, onClose, onConfirm }: ModalProps) => {
  const { content } = useLanguageNotes();
  return (
    <>
      <ModalBase title={title} text={text}>
        <div
          className="modal-block-btn-confirm fs-14 cp  pb-5 w-120 brd-bt"
          onClick={() => onConfirm()}
        >
          {content.confirm}
        </div>
        <div
          className="modal-block-btn-cancel fs-14 cp  pb-5  w-120 brd-bt"
          onClick={() => onClose()}
        >
          {content.cancel}
        </div>
      </ModalBase>
    </>
  );
};
export default Modal;
