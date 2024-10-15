import React from "react";
import { useLanguage } from "../context/langContext";

const Modal = ({
  textModaltitle,
  textModal,
  closeModal,
  handleConfirmDelete,
}: {
  textModaltitle: string;
  textModal: string;
  closeModal: () => void;
  handleConfirmDelete: () => void;
}) => {

  const { content } = useLanguage();
  return (
    <>
      <div className="modal">
        <div className="modal-content w-25p">
          <div className="flex sp-btw brd-bt">
            <div className="flex">
              <div className="modal-logo-error w-10 mr-10 "></div>
              <div className="fs-14-18  font-mdm ">{textModaltitle}</div>
            </div>
            <div className="modal-logo-close cp w-10 " onClick={closeModal}></div>
          </div>
          <div className="flex gap-10 mt-20">
            <div
              className="fs-14-18 cp pb-5 w-120 font-mdm brd-bt"
              onClick={() => handleConfirmDelete()}
            >
              {textModal}
            </div>
            <div
              className=" fs-14-18 cp pb-5  w-120 font-mdm brd-bt"
              onClick={closeModal}
            >
              {content.cancellation}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
