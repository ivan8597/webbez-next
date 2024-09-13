
const ModalBase = (props: {
  title: string;
  text: string;
  children: React.ReactNode;
}) => {
  const { title, text, children } = props;

  return (
    <div className="modalBase-block modal">
      <div className="modalBase-block-wrapper modal-content w-25p">
        <div className="modalBase-block-upper-text flex sp-btw brd-bt">
          <div className="modalBase-block-down-btns flex pb-5">
            <div className="modalBase-block-logo modal-logo-error w-10 mr-10 "></div>
            <div className="modalBase-block-title fs-14  font-mdm ">{title}</div>
          </div>
        </div>

        <div className="modalBase-block-middle-text fs-14 pt-10 pb-10 brd-bt">{text}</div>
        <div className="modalBase-block-bottom-buttons flex gap-10 mt-20">{children}</div>
      </div>
    </div>
  );
};
export default ModalBase;