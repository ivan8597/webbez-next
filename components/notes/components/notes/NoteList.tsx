import React, { Fragment, useMemo, useState } from "react";
import { usePostContext } from "../hook/postContext";
import NoteComponent from "./NoteComponent";
import MessagesComponent from "../messages/MessagesComponent";
import { PostNode } from "../../types";
import ReplyEdit from "../blocks/ReplyEdit";
import Modal from "../modal/Modal";
import ModalError from "../modal/ModalError";
import { useLanguageNotes } from "../hook/langContext";

const getArrayFromBranch = (branch: PostNode[]) => {
  //получим массив из ветки постов
  const arr: PostNode[] = [];
  for (const post of branch) {
    arr.push(post);
    if (post.children) {
      arr.push(...getArrayFromBranch(post.children)); //получим массив из ветки дочерних постов и добавим его в итоговый массив
    }
  }
  return arr;
};
const NoteList = () => {
  const { treeNotes, replyForm, deletePost, dPosts, loader, error } =
    usePostContext();
    const{content}=useLanguageNotes();
  const [idForDelete, setIdForDelete] = useState<string | null>(null); // id заметки для удаления

  const postToDelete = useMemo(
    () => (idForDelete ? dPosts[idForDelete] : null), //получим пост по id для удаления
    // eslint-disable-next-line
    [idForDelete] //при изменении id
  );
  const closeModalDelete = () => {
    setIdForDelete(null);
  };

  return (
    <div className="notesList-block notes-main__notes flex-1">
      {loader && (
        <div
          className="loader"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}
      {error && <ModalError title={error.title} text={error.message}  />}
      <div className="notesList-block-scroll notes-main__note-messages ">
        {treeNotes.map((note) => (
          <Fragment key={note.id}>
            <NoteComponent note={note} setIdForDelete={setIdForDelete} />

            {!!note.children &&
              note.children.map((message: PostNode) => (
                <Fragment key={message.id}>
                  <MessagesComponent
                    message={message}
                    displayArrow={true}
                    setIdForDelete={setIdForDelete}
                  />

                  {getArrayFromBranch(message.children || []).map(
                    (nestedMessage: PostNode) => (
                      <MessagesComponent
                        key={nestedMessage.id}
                        message={nestedMessage}
                        setIdForDelete={setIdForDelete}
                      />
                    )
                  )}
                </Fragment>
              ))}
          </Fragment>
        ))}

        {!!postToDelete && (
          <Modal
            title={content.confirmation}
            text={`${content.areYouSureYouWantToDelete} ${
              postToDelete.reply_to ? content.message : content.note
            }?`}
            onClose={() => closeModalDelete()}
            onConfirm={() => {
              deletePost(postToDelete.id);
              closeModalDelete();
            }}
          />
        )}
      </div>

      {!!replyForm && <ReplyEdit />}
      {/*отображение формы ответа*/}
    </div>
  );
};
export default NoteList;
