import React, { useState } from "react";

import Result from "../results/Result";
import AddTasks from "./AddTasks";
import { Screen, useTasks } from "../context/tasksContext";
import { useLanguage } from "../context/langContext";
import {BlockNotes} from "@ivan8597/notes_package";
import Page from "@/components/frontjango/components";


const TaskDetailWrapper = () => {
  const { content } = useLanguage();
  const [activeTab, setActiveTab] = useState("results");
  const { activeTaskId } = useTasks();
  return (
    <div className="result-info-top h-full pl-10 pr-10 ">
      <div className=" pt-10 fs-16 gap-20 font-mdm  flex ">
        <button
          className={`result-title txt-align-left min-w-120 pb-10 brd-bt title-row ${
            activeTab === "results" ? "active" : ""
          }`}
          onClick={() => setActiveTab("results")}
        >
          {content.resultTaskExecution}{/*Результаты*/}
        </button>
        <button
          className={`notes-title txt-align-left min-w-120 pb-10 brd-bt title-row ${
            activeTab === "notes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notes")}
        >
          {content.notes}{/*Заметки*/}
        </button>
        <button
          className={`notes-title txt-align-left min-w-120 pb-10 brd-bt title-row ${
            activeTab === "notes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("frontjango")}
        >
          Todo{/*frontjango*/}
        </button>
        <div className="brd-bt flex-1"></div>
      </div>
      {activeTab === "results" && <Result />}

      {activeTab === "frontjango" && <Page/>}
      {activeTab === "notes" && (
        <BlockNotes model="task" modelId={activeTaskId} />
      )}

    </div>
  );
};
const TaskInfoWrapper = () => {
  const { infoScreen } = useTasks();
  if (infoScreen === Screen.ADD_TASK) {
    return <AddTasks />;
  }
  if(infoScreen === Screen.FRONT_JANGO){
    return <Page/>
  }
  if (infoScreen === Screen.RESULTS) {
    return <TaskDetailWrapper />;
  }
  return <></>;
};

export default TaskInfoWrapper;
