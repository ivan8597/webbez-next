import React, { useEffect, useMemo } from "react";
import { useTasks } from "../context/tasksContext";
// import { Tooltip } from "react-tooltip";
import { useLanguage } from "../context/langContext";

const TaskTypes = () => {
  const {
    actions,
    // tasks,
    taskActionsIds,
    // searchTerm,
    selectedActions,
    setSelectedActions,
  } = useTasks();



  const { content } = useLanguage();//для перевода 
  const isDisabled = actions.length === 0; // для проверки когда с бэка не получили данные

  const handleCheckboxChange = (index: number) => {
    const updatedSelectedActions = selectedActions.map((el, actionIndex) =>
      index === actionIndex ? !el : el
    );
    setSelectedActions(updatedSelectedActions);
  };


 
  return (
    <>
      {/* <div className="scanner-name font-mdm fs-16 brd-bt pb-10 mt-10 title-row user-select">
        {content.scanner}
      </div> */}

      {/* <div className="scanner-select-all-tasks-types-with-logo  mt-10 df-fl sp-btw brd-bt user-select">
        <span className="scanner-select-all-tasks-types-name  fs-16 font-mdm title-row">
          {content.taskType}
        </span>

        <div className="scanner-select-all-tasks-types-logo pt-3 flex sp-btw gap-10">
          <div
            className={
              "scanner-select-all-filters " +
              (isDisabled ? "scanner-select-all-filters-disabled" : "")
            }
            id="scanner-select-all-filters"
            onClick={() =>
              setSelectedActions(selectedActions.map((el) => true))
            }
            data-tooltip-content={isDisabled ? "" : content.selectAllFilters}
            data-tooltip-id="scanner-select-all-filters"
          ></div>
          <Tooltip id="scanner-select-all-filters" place="left" />
          <div
            className={
              "scanner-clear-filter " +
              (isDisabled ? "scanner-clear-filter-disabled" : "")
            }
            id="scanner-clear-filter"
            onClick={() =>
              setSelectedActions(selectedActions.map((el) => false))
            }
            data-tooltip-content={isDisabled ? "" : content.clearFilter}
            data-tooltip-id="scanner-clear-filter"
            data-tooltip-place="left"
          ></div>
          <Tooltip id="scanner-clear-filter" place="left" />
        </div>
      </div> */}

      <ul className="scanner-ul flex gap-20 fs-14 mb-0 p-full user-select ">
        {actions.map((el, index) => {
          const isDisabled = !taskActionsIds.includes(el.id);//&& tasks.length!==0
          // const taskTypeArray=content.taskTypes[el.id].split(" ");
        

          return (
            <li
              className={`scanner-li  cp   ${
                selectedActions[index] ? "active" : ""
              } ${isDisabled ? "disabled" : ""}`}
              key={index}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                handleCheckboxChange(index);
              }}
            >
              <input
                type="checkbox"
                checked={selectedActions[index] && !isDisabled}
                // checked={selectedActions[index]}
                disabled={isDisabled}
                onChange={() => {
                  setSelectedActions(
                    selectedActions.map((el, actionIndex) =>
                      index === actionIndex ? !el : el
                    )
                  );
                }}
              />
              <label className="flex"><span className="flex-1 elipsis">
                {content.taskShortTypes[el.id]}
              
              </span></label>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default TaskTypes;
