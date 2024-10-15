import React, { useState, useRef, useMemo } from "react";
import { Screen, useTasks } from "../context/tasksContext";
import validator, { web } from "../../services/validator";
import httpService from "../../services/http.service";
import responseStatusChecker from "../../services/catcher.service";
import { useLanguage } from "../context/langContext";

type ErrorType = {
  isWebAddress: string;
  isTaskSelected: string;
  statusValidate: boolean;
};
// target url
// http://google.com/ http://google.com
// https://google.com/ https://google.com
// http://google.com/ https://google.com/
// http://google.com/  google.com
// http://google.com/  google.com/
const addressesAreEqual = (target: string, url: string) => {//функция используется для сравнения хостов двух веб-адресов без учета протокола и наличия завершающего символа "/"
  let [protocolTarget, hostTarget] = target.split("://");//target разбивает каждый из переданных адресов на протокол "http" или "https" и хост "www.google.com"
  
  hostTarget = hostTarget.slice(0, -1);//удаление завершающего символа "/"
  let [protocolUrl, hostUrl] = url.split("://"); //url разбивается на части протокола и хоста, сохраняя значения в переменные protocolUrl и  hostUrl
  if (!hostUrl) {
    hostUrl = protocolUrl;//если в адресе url отсутствует указание хоста (например, "http://"), то вместо этого используется значение протокола protocolUrl в качестве хоста
  }
  hostUrl = hostUrl.at(-1) === "/" ? hostUrl.slice(0, -1) : hostUrl;//удаление завершающего символа "/" из переменной `hostUrl`, если он присутствует, для дальнейшего сравнения с другим хостом
  return hostUrl === hostTarget;
};
const AddTasks = () => {
  const {
    actions,
    loadTasks,
    loadActiveTaskReports,
    tasks,
    setActiveTaskId,
    setInfoScreen,
    setProcessedData,
    setActualTaskTime,
    processCheckStatus,
  } = useTasks();

  const { content } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocusedAddress, setIsFocusedAddress] = useState<boolean>(false);
  const [isFocusedAction, setIsFocusedAction] = useState<boolean>(false);

  const [url, setUrl] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const [isStartScanCliced, setIsStartScanCliced] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorType>({
    isWebAddress: "",
    isTaskSelected: "",
    statusValidate: false,
  });
  const isDisabled = useMemo(() => {
    return (
      url.length === 0 ||
      actionType.length === 0 ||
      !validator(
        ["isTaskSelected", "isWebAddress"],
        {
          url,
          actionType,
        },
        content
      ).statusValidate
    );
  }, [url, actionType]);
  const errorObj = validator(
    ["isTaskSelected", "isWebAddress"],
    {
      url,
      actionType,
    },
    content
  );
  /*handlers*/
  const handleAddTask = async () => {
    const existedTask = tasks.find((task) => {
      return (
        addressesAreEqual(task.target, url) && task.action.id === actionType
      );
    });

    if (existedTask) {
      httpService.restartTask(existedTask.id, content).then((response) => {
        responseStatusChecker(response?.status || 0, "singleReport", content);
        loadActiveTaskReports(existedTask.id);
      });
      return;
    }

    try {
      const validationErrors = validator(
        ["isWebAddress", "isTaskSelected"],
        {
          url,
          actionType,
        },
        content
      );
      if (validationErrors.statusValidate) {
        const response = await httpService.addTask({
          url: web.test(url) ? `http://${url}` : url,
          actionType,
          content,
        });
        if (!response?.data) {
          return;
        }
        setProcessedData(response.data);

        loadTasks();
        setActualTaskTime(Date.now());
        setActiveTaskId(response.data.id);
        setInfoScreen(Screen.RESULTS);
        if (isScanning) {
          const taskId = response.data.id;
          httpService.restartTask(taskId, content).then((response) => {
            responseStatusChecker(
              response?.status || 0,
              "singleReport",
              content
            );
            loadActiveTaskReports(taskId);
            processCheckStatus(taskId);//проверка статуса in_progress
          });
        }
        setUrl("");
        setActionType("");

        setIsScanning(false);
        setErrors({
          isWebAddress: "",
          isTaskSelected: "",
          statusValidate: false,
        });
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlerChancel = () => {
    setUrl("");
    setActionType("");

    setIsScanning(false);
    setErrors({
      isWebAddress: "",
      isTaskSelected: "",
      statusValidate: false,
    });

    setInfoScreen(Screen.DEFAULT);
  };
  const handleInputFocus = () => {
    inputRef.current?.focus();
  };

  const handleRadioChange = (index: number) => {
    if (actionType === actions[index].id) {
      setActionType("");
    } else {
      setActionType(actions[index].id);
    }
  };

  return (
    <>
      <div className="add-tasks h-full pl-10 pr-10">
        <div className="add-tasks-name fs-16 font-mdm  mt-3 pb-7 brd-bt user-select">
          {content.addTask}
        </div>
        <div className="add-tasks-url fs-14 font-mdm mt-20 pb-10 brd-bt user-select">
          {" "}
          URL<span className="red-star">*</span>
        </div>

        <div className="flex sp-btw brd-bt">
          <input
            className="add-tasks-submit fs-14 pb-10 mt-10 "
            type="text"
            value={url}
            placeholder="https://example.com"
            onChange={(e) => setUrl(e.target.value)}
            onClick={() => {
              setIsFocusedAddress(true);
              setIsFocusedAction(true);
            }}
            onMouseEnter={handleInputFocus}
            ref={inputRef}
          />
          {url ? (
            <div
              className="add-tasks-search-clear-button mt-10 user-select"
              onClick={() => setUrl("")}
            ></div>
          ) : (
            ""
          )}
        </div>

        {!!errorObj.isWebAddress && isFocusedAddress && (
          <p className="error-isWebAddress fs-10-13">{errorObj.isWebAddress}</p>
        )}

        {!!errors.isWebAddress && (
          <p className="error-isWebAddress fs-10-13">{errors.isWebAddress}</p>
        )}

        <div className="add-tasks-type-name brd-bt  mt-20 pb-10 fs-14 font-mdm">
          {content.taskType}
          <span className="red-star user-select">*</span>
        </div>
        <ul className=" add-tasks-ul  p-full mb mt-20 user-select">
          {actions.map((action, index) => (
            <li
              className={`add-tasks-li  flex al-it-c cp mb-20 fs-14 ${
                actionType === action.id ? "active" : ""
              }`}
              onClick={() => handleRadioChange(index)}
              key={index}
            >
              <input
                className="mr-10 mt-0 cp"
                type="radio"
                checked={actionType === action.id}
                onChange={() => {
                  setActionType(action.id);
                }}
              />
              <label htmlFor="">{content.taskTypes[action.id]}</label>
            </li>
          ))}
        </ul>
        {errorObj.isTaskSelected && isFocusedAction && (
          <p className="error-isTaskSelected fs-10-13">
            {errorObj.isTaskSelected}
          </p>
        )}
        <div className="add-tasks-checkbox flex brd-bt mt-20 fs-14 user-select">
          <input
            type="checkbox"
            className="add-tasks-input mr-5 mb-15"
            checked={isScanning}
            onChange={(e) =>{
               setIsScanning(e.target.checked);
               setIsStartScanCliced(true)
         
              }}
          />
          <label
            className={`add-tasks-span  cp mb-20 ${isStartScanCliced? "active" : ""} `}//hover-accent
            onClick={() => {
              setIsScanning(!isScanning)
              setIsStartScanCliced(!isStartScanCliced)
             
            }}
          >
            {" "}
            {content.startScan}
          </label>
        </div>
        {errors.isTaskSelected && (
          <p className="error-isTaskSelected fs-10-13">
            {errors.isTaskSelected}
          </p>
        )}
        <div className="flex flex-d-col mt-40  user-select ">
          <button
            className="add-tasks-add-button fs-16 w-20p txt-align-left pb-10 brd-bt"
            onClick={() => {
              handleAddTask();
            }}
            disabled={isDisabled}
          >
            {content.add}
          </button>
          <button
            className="add-tasks-delete-button fs-16 w-20p txt-align-left brd-bt pb-10 mt-10 "
            onClick={() => handlerChancel()}
          >
            {content.cancellation}
          </button>
        </div>
      </div>
    </>
  );
};
export default AddTasks;
