import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-tooltip/dist/react-tooltip.css";

// import TaskTypes from "./TaskTypes";
// import UrlList from "./UrlList";
import SearchPanel from "./components/taskTypes/SearchPanel";
import Tasks from "./components/tasks/Tasks";
import TaskInfoWrapper from "./components/tasks/TaskInfoWrapper";
import { TasksContextProvider } from "./components/context/tasksContext";
import { LanguageProvider } from "./components/context/langContext";

const TasksPage = () => {
  // TasksContextProvider для доступа к таскам

  // LanguageProvider тасок для доступа к языку
  return (
    <LanguageProvider>
      <TasksContextProvider>
        <div className="full-page">
          <div className="content__main overflow-x-hidden ">
            <SearchPanel />

            <div className="flex main-tasks-wrapper">
              <div className="flex-1 mw-30p pl-10 pb-10 pt-10 h-full">
                <Tasks />
              </div>
              <div className="flex-1 mw-70p  right-components">
                <TaskInfoWrapper />
              </div>
            </div>
          </div>

          <ToastContainer />
        </div>
      </TasksContextProvider>
    </LanguageProvider>
  );
};

export default TasksPage;
