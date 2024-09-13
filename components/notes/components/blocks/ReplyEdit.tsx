import { useEffect, useMemo, useRef, useState } from "react";
import { usePostContext } from "../hook/postContext";
import { useLanguageNotes } from "../hook/langContext";

const ReplyEdit = () => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { replyForm, updateNote, addMessage, dUsers, dPosts, setReplyForm } =
    usePostContext();
  const { content } = useLanguageNotes();
  const { title } = useMemo(() => {
    let title = content.yourAnswer;
    if (replyForm?.mode === "edit") {
      title = content.editMessage;
    }
    return { title };
  }, [replyForm, content]);

  const updateAddedPost = () => {
    if (replyForm?.mode === "edit") {
      updateNote(replyForm.id, text);
      setText("");
      setReplyForm(null);
    } else if (replyForm?.mode === "reply") {
      addMessage(replyForm.id, text, () => setReplyForm(null));
    }
    // setText(""); //очищает поле

    // setReplyForm(null); //закрывает форму
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      setText(text + "\n"); // Перевод каретки на новую строку
    } else if (e.key === "Enter") {
      if (text.length === 0) {
        e.preventDefault();
        return;
      }
      updateAddedPost(); // Вызов функции updateAddedPost() при нажатии на Enter
    }
  };
  useEffect(() => {
    if (replyForm?.mode === "edit") {
      setText(dPosts[replyForm.id]?.text || "");
    }
    // eslint-disable-next-line
  }, [replyForm]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      if (
        textareaRef.current.scrollHeight !==
        textareaRef.current.getBoundingClientRect().height
      ) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [text]);
  return (
    <div className="reply-edit-block pr-10">
      <div className="reply-edit-block__header flex sp-btw pt-10 pb-10 brd-bt brd-top">
        <div className="reply-edit-block__title notes-main__note-message-date w-auto fw-bold fs-12">
          {title}
          {replyForm && replyForm.mode === "reply" && (
            <span className="messagesComponent-block-author-toReply messages-main__note-reply pl-5">
              {dUsers[dPosts[replyForm.id]?.user_id]?.username}
            </span>
          )}
        </div>
        <button
          className="reply-edit-block__close notes-main__delete cp" //при нажатии закрывает форму
          onClick={() => setReplyForm(null)}
        ></button>
      </div>
      <div className="reply-edit-block__wrapper-textarea flex sp-btw brd-bt">
        <textarea
          ref={textareaRef}
          className="reply-edit-block__textarea notes-main__input mt-10 mb-20 fs-12 lh-12 max-h-250 brd-none"
          placeholder={content.enterTextInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}//при нажатии enter или ctrl enter вызывает функцию
          style={{
            resize: "none",
            width: "100%",
          }}
        />
        <button
          className={`reply-edit-block__arrow messages__arrow cp mt-7 mb-20 ${
            text.length === 0 ? "disabled" : ""
          }`}
          disabled={text.length === 0} //при нажатии стрелка вызывает функцию
          onClick={updateAddedPost}
        ></button>
      </div>
    </div>
  );
};

export default ReplyEdit;
