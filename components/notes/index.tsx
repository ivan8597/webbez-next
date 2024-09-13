
import SearchBlock from "./components/blocks/SearchBlock";
import NoteList from "./components/notes/NoteList";
import Form from "./components/blocks/Form";
// import "./css/notes.css";
import { PostProvider } from "./components/hook/postContext";
import { LanguageProvider } from "./components/hook/langContext";

import { useMain } from "../core/components/context/mainContext";

const BlockNotes = ({model = "note", modelId = "1"}: {model?: string, modelId?: string}) => {

  const{currentUser,hasAccess}=useMain()

  return (

    // LanguageProvider заметок для доступа к языку

    // PostProvider заметки для доступа к заметкам
    <LanguageProvider>
    <PostProvider model={model} modelId={modelId} currentUser={currentUser} hasAccess={hasAccess} >
      <div className="blockNotes-block flex h-full max-h-full  overflow-y-auto pt-10 pb-10">
        <div className="blockNotes-block-left min-w-490 w-790 max-w-65p flex flex-d-col brd-rt ">
          <SearchBlock /> 
          <NoteList />
        </div>
        <div className="blockNotes-block-right flex-1 pl-10  ">
          <Form />
        </div>
      </div>
    </PostProvider>
    </LanguageProvider>
  );
};
export default BlockNotes;
//нужно установить REACT_APP_API_NOTES в .env
//при локальной разработке указать REACT_APP_NOTES_LOCAL_TOKEN

//нужно установить в env проекта  REACT_APP_API_NOTES="https://notes-api.sc.avl.team"