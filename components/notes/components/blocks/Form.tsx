import { useEffect, useRef, useState } from "react";
import { usePostContext } from "../hook/postContext";
import { useLanguageNotes } from "../hook/langContext";

const Form = () => {
  const {
    addNote,
    dPosts,
    editedNoteId,
    setEditedNoteId,
    updateNote,
    model,
    modelId,
  } = usePostContext();

  const [text, setText] = useState<string>("");
  const { content } = useLanguageNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      setText(text + "\n"); // Перевод каретки на новую строку
    } else if (e.key === "Enter") {
      if (text.length === 0) {
        e.preventDefault();
        return;
      }
      handleClick(); // Вызов функции handleClick() при нажатии на Enter
    }
  };
  const handleClick = () => {
    //проверить добавляем или редактируем
    if (editedNoteId) {
      updateNote(editedNoteId, text);
      setEditedNoteId(null); //редактирование закончено
      setText("");
    } else {
      addNote(text, () => setText(""));
    }
   
  };
  useEffect(() => {
    if (!editedNoteId) {
      setText("");
      return;
    }
    if (editedNoteId) {
      setText(dPosts[editedNoteId].text || "");
    }
    // eslint-disable-next-line
  }, [editedNoteId, model, modelId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const wrapper = document.querySelector(".blockNotes-block-right");//блок обертка текстового поля
      const maxHeight = (wrapper?.getBoundingClientRect().height || 0) - 145;//максимальная высота которую текстовое поле может занимать, 145 - разницы между высотой обертки текстового поля и высотой формы 725-580
      if (                                                 //отличается ли фактическая высота содержимого текстового поля (scrollHeight) от текущей высоты элемента (getBoundingClientRect().height). Если они не равны, значит, содержимое текста изменилось и мы должны изменить высоту текстового поля
        textareaRef.current.scrollHeight !==
        textareaRef.current.getBoundingClientRect().height
      ) {
        textareaRef.current.style.height = `${Math.min(//устанавливаем высоту текстового поля в наименьшее значение между его scrollHeight и maxHeight, чтобы текстовое поле не превышало максимально допустимую высоту
          textareaRef.current.scrollHeight,
          maxHeight
        )}px`;
      }
    }
  }, [text]);
  return (
    <>
      <div className="form__title  pt-2 pb-8 fs-12 brd-bt">
        {editedNoteId ? content.editinNote : content.addingNote}
      </div>
      <div className="form__input-panel min-h-200 brd-bt">
        <textarea
          ref={textareaRef}
          className="form__textarea mt-10 fs-12 lh-12 brd-none "
          placeholder={content.enterText}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            resize: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="form__btn-wrapper flex sp-btw flex-d-col align-items-f-end  flex-end">
        <button
          onClick={handleClick} 
          className={`form__btn mt-20 fs-14 brd-top-none brd-lt-none brd-rt-none brd-bt cp ${
            text.length === 0 ? "disabled-buttons" : "active-buttons"
          } `}
          disabled={text.length === 0}
        >
          {content.send}
        </button>
        <button
          onClick={() => {
            setEditedNoteId(null);
            setText("");
          }}
          className={`form__btn mt-20 fs-14 brd-top-none brd-lt-none brd-rt-none brd-bt cp ${
            text.length === 0 ? "disabled-buttons" : "active-buttons"
          }`}
          disabled={text.length === 0}
        >
          {content.cancel}
        </button>
      </div>
    </>
  );
};

export default Form;
