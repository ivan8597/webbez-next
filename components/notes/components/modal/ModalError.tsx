import React from "react";
import { usePostContext } from "../hook/postContext";
import ModalBase from "./ModalBase";
type ModalProps = {
  title: string;
  text: string;
};

const ModalError = ({ title, text }: ModalProps) => {
  const { closeError } = usePostContext();
  return (
    <ModalBase title={title} text={text}>
      <div
        className=" modalError-block-btn-confirm fs-14 cp  pb-5  w-120 brd-bt"
        onClick={() => closeError()}
      >
        {"Ок"}
      </div>
    </ModalBase>
  );
  
};
export default ModalError;
