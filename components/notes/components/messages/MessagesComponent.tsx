import { PostNode } from "../../types";
import { usePostContext } from "../hook/postContext";
import { useSearchTerm } from "../hook/useSearchTerm";
import { getFormattedDate } from "../../services/date";
import { useLanguageNotes } from "../hook/langContext";
// import { getStandardDate } from "../../services/date";
// import { useTimeZone } from "../hook/timezoneContext";

const MessagesComponent = ({
  message,
  displayArrow = false,
  setIdForDelete,
}: {
  message: PostNode;
  displayArrow?: boolean;
  setIdForDelete: (id: string | null) => void;
}) => {
  const { setReplyForm, dUsers, dPosts, canManagePost } = usePostContext();
  // const {currentTimeZone} = useTimeZone();
  const text = useSearchTerm(message.text);
  const { content } = useLanguageNotes();

  // const authorId = dPosts[message.reply_to || ""].user_id; //получим id автора выбранного сообщения

  return (
    <div
      key={"message-" + message.id}
      className="messagesComponent-block notes-main__note-message flex mb-10 mr-10 ml-150 pt-10 pb-10 pl-10 pr-10 brd fs-12"
    >
      <div className="messagesComponent-block-author-text mb-10 flex-1">
        <div className="messagesComponent-block-author notes-main__note-message-author mt-10 mb-10 fw-bold">
          {/* {message.user_id}  */}
          {/* {dUsers[authorId]?.username} получим имя автора выбранного сообщения} */}

          {message.reply_to && (
            <div className="messagesComponent-block-author-position psn-rlt b-10">
              <span>{dUsers[message.user_id]?.username}</span>
              {/*текущее имя пользователя*/}
              <span className="messagesComponent-block-author-reply messages-main__note-reply pl-10">
                {content.answerT}
              </span>
              <span className="messagesComponent-block-author-toReply messages-main__note-reply pl-5">
                {dUsers[dPosts[message.reply_to].user_id]?.username}
              </span>
              {/*получим имя пользователя на которого ответили} */}
            </div>
          )}
        </div>
        {/* <div>{message.id} </div> */}

        <div className="notes-main__note-text mt-10 fs-12"></div>
        <pre className="messagesComponent-block-text word-break note-text fs-12 lh-12">
          {text}
        </pre>
      </div>

      {/*показываем дату, кнопки "ответить", "редактировать", "удалить"*/}
      <div className="messagesComponent-block-date-buttons flex flex-d-col  ">
        <div className="messagesComponent-block-date notes-main__note-message-date fs-12-15 flex-1">
          {/* {getStandardDate(message.created_at,currentTimeZone)} */}
          {getFormattedDate(message.created_at)}
        </div>
        <div className="messagesComponent-block-buttons flex flex-end gap-10">
          <span
            className="messagesComponent-block-button-reply notes-main__note-reply pr-10 pb-10 cp"
            onClick={() => setReplyForm({ mode: "reply", id: message.id })}
            data-tooltip-content="Ответить"
            data-tooltip-id="notes-main__note-reply"
          ></span>
          {/* <Tooltip id="notes-main__note-reply" place="left" /> */}

          {canManagePost(message.user_id) && (//показываем кнопки "редактировать", "удалить" если текущий пользователь 
            <>
              <span
                className="messagesComponent-block-button-edit notes-main__note-edit cp"
                onClick={() => setReplyForm({ mode: "edit", id: message.id })}
                data-tooltip-content="Редактировать"
                data-tooltip-id="notes-main__note-edit"
              ></span>
              {/* <Tooltip id="notes-main__note-edit" place="left" /> */}

              <span
                className="messagesComponent-block-button-delete notes-main_note-delete cp"
                onClick={() => setIdForDelete(message.id)}
                data-tooltip-content="Удалить"
                data-tooltip-id="notes-main_note-delete"
              ></span>
            </>
          )}
          {/* <Tooltip id="notes-main_note-delete" place="left" /> */}
        </div>
      </div>

      {displayArrow && (
        <div className="messagesComponent-block-arrow notes-main__arrow cp"></div> //показываем стрелку
      )}
    </div>
  );
};

export default MessagesComponent;
