import React, { useState, useCallback, useEffect } from "react";
import { Screen, useTasks } from "../context/tasksContext";
import { Task } from "../../types";
import httpService from "../../services/http.service";
// import { Tooltip } from "react-tooltip";
import Pagination from "./Pagination";
import Modal from "../ui/Modal";
import moment from "moment-timezone";
import { useLanguage } from "../context/langContext";
import { useTimeZone } from "@ivan8597/core";
import { convertPunycodeToCyrillic } from "../../services/convert";
import { useMain } from "@ivan8597/core";



const getFormatDate = (date: string, currentTimeZone: string) => {
  return moment(date).tz(currentTimeZone).format("DD-MM-yyyy HH:mm:ss");
  //преобразование даты часового пояса во время в текущем часовом поясе
};
const TaskCard = ({
  task,
  showDeleteButtons,
  choosedTasks,
  setChoosedTasks,
}: {
  task: Task;
  showDeleteButtons: boolean;
  choosedTasks: string[];
  setChoosedTasks: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { activeTaskId, setInfoScreen, setActiveTaskId, processCheckStatus } =
  useTasks();
  const { content } = useLanguage();
  const { currentTimeZone } = useTimeZone();
  const { in_progress } = task;

  const handleCheckboxChange = () => {
    if (showDeleteButtons) {
      if (!choosedTasks.includes(task.id)) {
        setChoosedTasks([...choosedTasks, task.id]);
      } else {
        setChoosedTasks(choosedTasks.filter((id) => id !== task.id));
      }
    }

    setActiveTaskId("");
    setInfoScreen(Screen.DEFAULT);
  };
  useEffect(() => {
    if (!in_progress) {
      return;
    }
    processCheckStatus(task.id);
  }, [in_progress]);
  return (
    <li
      key={task.id}
      onClick={() => {
        if (showDeleteButtons) {
          handleCheckboxChange();
          return;
        }
        setActiveTaskId(task.id);
        setInfoScreen(Screen.RESULTS);
      }}
      className={`task-card pr-30  ${
        activeTaskId === task.id ? "task-arrow" : ""
      }  ${in_progress && !showDeleteButtons ? "in-progress" : ""}`}
    >
      <div className="pt-20 ">
        <div className="pb-20 fs-16 font-mdm cp ">
          {convertPunycodeToCyrillic(task.target)}
        </div>
        <div className="pb-20 fs-16 min-h-52 cp user-select">
          {" "}
          {content.taskTypes[task.action.id]}
        </div>
        <div className="task-date pb-3 fs-14 user-select">
          {content.dateCreation}:{" "}
          {getFormatDate(task.created_at, currentTimeZone)}
        </div>
        <div className="task-date mb-20 fs-14 user-select">
          {content.dateLastReport}:{" "}
          {task.last_report_date
            ? getFormatDate(task.last_report_date, currentTimeZone)
            : content.dataNo}
        </div>
        {/* {!in_progress && (
          <div className=" task-date mb-20 fs-14"> Статус: <img src="/img/clock.svg"/> </div>
        )} */}
      </div>

      {showDeleteButtons && (
        <div
          onClick={handleCheckboxChange}
          className="psn-abs r-null t-20 user-select"
        >
          <input
            // className="tasks-checkbox-delete"
            type="checkbox"
            checked={choosedTasks.includes(task.id)}
            onChange={handleCheckboxChange}
          />
          <label />
        </div>
      )}
    </li>
  );
};

const Tasks = () => {
  const {
    tasks,
    actions,
    activeTaskId,
    setActualTaskTime,
    setActiveTaskId,
    setInfoScreen,
    loadTasks,
   
  } = useTasks();
  const{hasAccess}=useMain()

  const { content } = useLanguage(); //переменная для перевода
  const isDisabled = actions.length === 0; // для проверки когда с бэка не получили данные
  const isTaskDisabled = tasks.length === 0; // для проверки когда список с задачами пуст
  const [showDeleteButtons, setShowDeleteButtons] = useState<boolean>(false);
  const [choosedTasks, setChoosedTasks] = useState<string[]>([]);

  const [isModalOpenDeleteTask, setIsModalOpenDeleteTask] =
    useState<boolean>(false);

  const handleShowDeleteButton = () => {
    setShowDeleteButtons(!showDeleteButtons);
    setInfoScreen(Screen.DEFAULT);
    setActiveTaskId("");
    setChoosedTasks([]);
  };

  const handleDeleteTask = () => {
    if (choosedTasks.length === 1) {
      httpService.deleteTask(choosedTasks[0]).then(() => {
        loadTasks();

        setActualTaskTime(Date.now());
      });
    } else {
      httpService.deleteAnyTasks(choosedTasks).then(() => {
        loadTasks();

        setActualTaskTime(Date.now());
      });
    }

    setChoosedTasks([]);
    setShowDeleteButtons(!showDeleteButtons);
  };

  const openModalDeleteTask = useCallback(() => {
    if (choosedTasks.length === 0) {
      return;
    }
    setIsModalOpenDeleteTask(true);
    document.body.style.overflow = "hidden";
  }, [choosedTasks]);

  const closeModalDeleteTask = useCallback(() => {
    setIsModalOpenDeleteTask(false);
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    if (activeTaskId && showDeleteButtons) {
      setShowDeleteButtons(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskId]);

  return (
    <>
      <div className="pr-10 brd-rt h-full tasks-wrapper">
        <div className="tasks brd-bt psn-rlt  pb-10  mb-10 flex sp-btw  title-row user-select al-it-c">
          <div className="tasks-name fs-16 font-mdm">{content.tasks}</div>
          {/*Задачи*/}

          <div className="task-wrapper flex gap-10">
            {hasAccess("scanner_tasks") && (
              <>
                {!showDeleteButtons && (
                  <button
                    className={
                      "link-button  font-mdm " +
                      (isDisabled ? "add-task-in-search-panel-disabled" : "")
                    }
                    disabled={isDisabled}
                    // id="add-task-in-search-panel"
                    onClick={() => {
                      setActiveTaskId("");
                      setInfoScreen(Screen.ADD_TASK);
                    }}
                    // data-tooltip-content={isDisabled ? "" : content.addTask}
                    // data-tooltip-id="add-task-in-search-panel"
                  >
                    {content.addTask}
                  </button>
                )}
                {/*Добавить задачу*/}
                {!showDeleteButtons ? (
                  <button
                    onClick={() => {
                      console.log(9);
                      if (isDisabled || isTaskDisabled) return;

                      handleShowDeleteButton();
                    }}
                    className={
                      "link-button fs-12 font-mdm " +
                      (isDisabled || isTaskDisabled
                        ? "tasks-delete-button-disabled"
                        : "")
                    }
                  >
                    {content.delete}
                  </button>
                ) : (
                  <>
                   <div
                      className="link-button"
                      // id="tasks-logo-delete"
                      onClick={openModalDeleteTask}
                      // data-tooltip-content={content.deleteSelectedTasks}
                      // data-tooltip-id="tasks-logo-delete"
                    >
                      {content.delete}</div>
                    <div
                      className="link-button"
                      // id="tasks-logo-exit"
                      onClick={() => handleShowDeleteButton()}
                      // data-tooltip-content={content.exitTaskDeletionMode}
                      // data-tooltip-id="tasks-logo-exit"
                    >
                      {content.cancellation}
                    </div>
                    {/* <Tooltip id="tasks-logo-exit" place="left" /> */}

                   
                    {/* <Tooltip id="tasks-logo-delete" place="left" /> */}

                    {!!isModalOpenDeleteTask && (
                      <Modal
                        textModaltitle={
                          choosedTasks.length === 1
                            ? content.areYouSureWantToDeleteThisTask
                            : content.areYouSureWantToDeleteThisTasks
                        }
                        textModal={content.delete}
                        closeModal={closeModalDeleteTask}
                        handleConfirmDelete={() => {
                          handleDeleteTask();
                          closeModalDeleteTask();
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <ul className="tasks-ul p-full mb-0 mt-0 pr-5 font-lgt  fs-16 overflow-y-auto flex-1">
          {/* {tasks.map((task) => (
            <div key={task.id} className="task-card brd-bt  ">
              <TaskCard
                key={task.id}
                task={task}
                showDeleteButtons={showDeleteButtons}
                choosedTasks={choosedTasks}
                setChoosedTasks={setChoosedTasks}
              />
            </div>
          ))} */}
          {tasks
            .sort((a, b) => {
              if (a.in_progress && !b.in_progress) {
                return -1; // задача a должна идти перед задачей b
              }
              if (!a.in_progress && b.in_progress) {
                return 1; // задача b должна идти перед задачей a
              }
              return 0; // сохранить текущий порядок
            })
            .map((task) => (
              <div key={task.id} className="task-card brd-bt">
                <TaskCard
                  key={task.id}
                  task={task}
                  showDeleteButtons={showDeleteButtons}
                  choosedTasks={choosedTasks}
                  setChoosedTasks={setChoosedTasks}
                />
              </div>
            ))}
        </ul>

        <Pagination />
      </div>
    </>
  );
};

export default Tasks;
