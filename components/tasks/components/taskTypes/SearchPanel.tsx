import React, {  useRef } from "react";
import {  useTasks } from "../context/tasksContext";
// import { Tooltip } from "react-tooltip";
import { useLanguage } from "../context/langContext";
// import ThemeToggle from "./ThemeToggle";
// import TimeZoneSwitcher from "./TimeZoneSwitcher";

import TaskTypes from "./TaskTypes";
// import LanguageSwitcher from "./LanguageSwitcher";


const SearchPanel = () => {
  const {
   
    tasks,
    actions,
    searchTerm,
    setSearchTerm,
  } = useTasks();

  const { content } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const isDisabled = tasks.length === 0 && actions.length === 0;
  // const [showClearButton, setShowClearButton] = useState<boolean>(false);
  const handleInputFocus = () => {
    inputRef.current?.focus();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // if (e.target.value.length > 0) {
    //   setShowClearButton(true);
    // } else {
    //   setShowClearButton(false);
    // }
  };

  const handleClearButton = () => {
    setSearchTerm("");
    // setShowClearButton(false);
  };
  return (
    <>
      <div className="search-panel mt-10 flex gap-20 pl-10 pr-10 title-row user-select">
        <div className="brd-bt w-80p">
          {/* <button
            className={
              "add-task-in-search-panel " +
              (isDisabled ? "add-task-in-search-panel-disabled" : "")
            }
            disabled={isDisabled}
            id="add-task-in-search-panel"
            onClick={() => {
              setActiveTaskId("");
              setInfoScreen(Screen.ADD_TASK);
            }}
            data-tooltip-content={isDisabled ? "" : content.addTask}
            data-tooltip-id="add-task-in-search-panel"
          ></button> */}
          {/* <Tooltip id="add-task-in-search-panel" place="left" /> */}
          <TaskTypes />
        </div>
         {/* <TimeZoneSwitcher /> */}
          {/* <LanguageSwitcher /> */}
        {/* <ThemeToggle />  */}
        <div className="search-panel-symbols flex sp-btw w-20p brd-bt">
          <input
            className="search-panel-input-search-area  fs-14"
            type="text"
            placeholder={content.search} 
            value={searchTerm}
            onChange={handleInputChange}
            onMouseEnter={handleInputFocus}
            ref={inputRef}
            disabled={isDisabled}
          />
          {searchTerm ? (
            <div
              className="search-panel-search-clear-button"
              onClick={handleClearButton}
            >
            </div>
          ) : (
            <div className="search-panel-search-submit-button"></div>
          )}
       
    
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
