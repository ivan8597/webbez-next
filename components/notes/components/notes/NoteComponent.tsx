// import { Tooltip } from "react-tooltip";
import { Tooltip } from "react-tooltip";
import { PostNode } from "../../types";
import { usePostContext } from "../hook/postContext";
import { useSearchTerm } from "../hook/useSearchTerm";
import { getFormattedDate } from "../../services/date";

// import { useTimeZone } from "../hook/timezoneContext";
// import {  getStandardDate } from "../../services/date";

const NoteComponent = ({
  note,
  setIdForDelete,
}: {
  note: PostNode;
  setIdForDelete: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { setEditedNoteId, setReplyForm, dUsers, canManagePost } =
    usePostContext();
  // const {currentTimeZone}=useTimeZone()
  const text = useSearchTerm(note.text); //применение хука для поиска слов в заметке

  return (
    <div className="noteComponent-block notes-main__not flex mb-10  mr-10 pt-10 pb-10 pl-10 pr-10 brd">
      <div className="noteComponent-block-author-text mb-10 flex-1">
        <div className="noteComponent-block-author notes-main__note-author fw-bold  fs-12 ">
          {/* {note.user_id}  */}
          {dUsers[note.user_id]?.username}
        </div>
        <div className="noteComponent-block-text notes-main__note-text mt-10 fs-12 lh-12">
          {/*выделение найденного текста в заметке*/}
          <pre className="word-break note-text">{text}</pre>
        </div>
      </div>
      <div className="noteComponent-block-date-buttons flex flex-d-col">
        <div className="noteComponent-block-date notes-main__note-date flex-1 fs-12-15">
          {/* {getStandardDate(note.created_at,currentTimeZone)}  */}
          {/*{note.updated_at}*/}
          {getFormattedDate(note.created_at)}
        </div>
        <div className="noteComponent-block-buttons flex flex-end gap-10 ">
          {/*показываем кнопки ответа и редактирования*/}
          <span
            className="noteComponent-block-button-reply notes-main__note-reply pr-10 pb-10 cp"
            onClick={() =>
              setReplyForm({
                mode: "reply",
                id: note.id,
              })
            }
            data-tooltip-content="Ответить"
            data-tooltip-id="notes-main__note-reply"
          ></span>
          <Tooltip
            id="notes-main__note-reply"
            place="left"
            style={{ width: "90px" }}
          />
          {canManagePost(note.user_id) && (//показываем кнопки редактирования и удаления если текущий пользователь 
            <>
              <span
                className="noteComponent-block-button-edit notes-main__note-edit cp"
                onClick={() => setEditedNoteId(note.id)}
                data-tooltip-content="Редактировать"
                data-tooltip-id="notes-main__note-edit"
              ></span>
              <Tooltip
                id="notes-main__note-edit"
                place="left"
                style={{ width: "129px" }}
              />

              <span
                className="noteComponent-block-button-delete notes-main_note-delete cp"
                onClick={() => setIdForDelete(note.id)}
                data-tooltip-content="Удалить"
                data-tooltip-id="notes-main_note-delete"
              ></span>

              <Tooltip
                id="notes-main_note-delete"
                place="left"
                style={{ width: "80px" }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default NoteComponent;
