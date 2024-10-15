import React, { useState, useEffect, useCallback } from "react";
import { useTasks } from "../context/tasksContext";
import { ReportDetails } from "../../types";
import httpService from "../../services/http.service";
import responseStatusChecker from "../../services/catcher.service";

import { Tooltip } from "react-tooltip";
import Modal from "../ui/Modal";

import { useLanguage } from "../context/langContext";
import ReportDetailsInfo from "./ReportDetailsInfo";
import ReportInfo from "./ReportInfo";
import { convertPunycodeToCyrillic } from "../../services/convert";

/* для одного отчета функции*/
const Result = () => {
  const {
    activeTaskId,
    tasks,
    reports,

    loadActiveTaskReports,
    // setActiveTaskId,
    // setInfoScreen,
    // setReports,
    processCheckStatus,
  } = useTasks();

  const { content } = useLanguage();
  const activeTask = tasks.find((task) => task.id === activeTaskId);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null
  );

  const [isModalOpenDeleteAll, setIsModalOpenDeleteAll] =
    useState<boolean>(false);
  const [isModalOpenRestart, setIsModalOpenRestart] = useState<boolean>(false);

  // const [isModalOpenDeleteResult, setIsModalOpenDeleteResult] =
  //   useState<boolean>(false);
  const loadReportDetails = (reportId: string) => {
    httpService.getCurrentReport(reportId).then((reportDetails) => {
      setReportDetails(reportDetails);
    });
  };

  const handleRestartTaskResult = () => {
    httpService.restartTask(activeTaskId, content).then((response) => {
      responseStatusChecker(response?.status || 0, "singleReport", content);
      loadActiveTaskReports(activeTaskId);
      processCheckStatus(activeTaskId);
    });
  };

  const handleConfirmDeleteCurrentReport = (reportId: string) => {
    httpService.deleteCurrentReport(reportId).then(() => {
      loadActiveTaskReports(activeTaskId);
      setReportDetails(null);
      processCheckStatus(activeTaskId); // обновляем статус
    });
  };
  const handleConfirmDeleteAllReport = (reportIds: string[]) => {
    httpService.deleteAllReports(reportIds).then(() => {
      loadActiveTaskReports(activeTaskId);
      setReportDetails(null);
      processCheckStatus(activeTaskId); // обновляем статус
    });
  };

  // const handleConfirmDeleteResultOfTask = () => {
  //   setActiveTaskId("");

  //   setReports([]);

  //   setInfoScreen(Screen.DEFAULT);
  // };

  /**Modal*****/

  const openModalDeleteAll = useCallback(() => {
    setIsModalOpenDeleteAll(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModalDeleteAll = useCallback(() => {
    setIsModalOpenDeleteAll(false);
    document.body.style.overflow = "auto";
  }, []);
  const openModalRestart = useCallback(() => {
    setIsModalOpenRestart(true);
    document.body.style.overflow = "hidden";
  }, []);
  const closeModalRestart = useCallback(() => {
    setIsModalOpenRestart(false);
    document.body.style.overflow = "auto";
  }, []);
  // const openModalDeleteResult = useCallback(() => {
  //   setIsModalOpenDeleteResult(true);
  //   document.body.style.overflow = "hidden";
  // }, []);
  // const closeModalDeleteResult = useCallback(() => {
  //   setIsModalOpenDeleteResult(false);
  //   document.body.style.overflow = "auto";
  // }, []);
  useEffect(() => {
    setReportDetails(null);
  }, [activeTaskId]);
  if (!activeTask) {
    return <div></div>;
  }

  return (
    <>
      {/* <div className="result-logo flex  gap-10">
          <div
            className="result-logo-update cp"
            id="result-logo-update"
            onClick={() => openModalRestart()}
            data-tooltip-content={content.restartTask}
            data-tooltip-id="result-logo-update"
          ></div>
          <Tooltip id="result-logo-update" place="left" />
          {!!isModalOpenRestart && (
            <Modal
              textModaltitle={content.areYouSureYouWantToRestartThisTask}
              textModal={content.confirm}
              closeModal={closeModalRestart}
              handleConfirmDelete={() => {
                handleRestartTaskResult();
                closeModalRestart();
              }}
            />
          )}
          {!!isModalOpenDeleteResult && (
            <Modal
              textModaltitle="Вы точно хотите удалить результат выполнения задачи?"
              textModal="Удалить"
              closeModal={closeModalDeleteResult}
              handleConfirmDelete={() => {
                handleConfirmDeleteResultOfTask();
                closeModalDeleteResult();
              }}
            />
          )}
        </div> */}

      <div>
        <div className="brd-bt flex pb-10 mt-20">
          <div className="fs-14 font-mdm w-140 user-select"> URL </div>
          <div className="fs-14 flex-1">
            {convertPunycodeToCyrillic(activeTask.host)}
          </div>
          <div className="result-logo flex  gap-10">
            <div
              className="results-logo result-logo-update cp"
              id="results-logo result-logo-update"
              onClick={() => openModalRestart()}
              data-tooltip-content={content.restartTask}
              data-tooltip-id="results-logo result-logo-update"
            ></div>
            <Tooltip id="results-logo result-logo-update" place="left" />
            {!!isModalOpenRestart && (
              <Modal
                textModaltitle={content.areYouSureYouWantToRestartThisTask}
                textModal={content.confirm}
                closeModal={closeModalRestart}
                handleConfirmDelete={() => {
                  handleRestartTaskResult();
                  closeModalRestart();
                }}
              />
            )}
            {/* {!!isModalOpenDeleteResult && (
            <Modal
              textModaltitle="Вы точно хотите удалить результат выполнения задачи?"
              textModal="Удалить"
              closeModal={closeModalDeleteResult}
              handleConfirmDelete={() => {
                handleConfirmDeleteResultOfTask();
                closeModalDeleteResult();
              }}
            />
          )} */}
          </div>
        </div>
        <div className="brd-bt flex pb-10 mt-20 mb-40 user-select">
          <div className="fs-14 w-140 font-mdm"> {content.taskType}</div>
          <div className=" fs-14 flex-1">
            {content.taskTypes[activeTask.action.id]}
          </div>
        </div>
      </div>

      {!!reports.length && (
        <>
          <div className="brd-bt flex sp-btw pb-10 user-select ">
            <div className="fs-16 font-mdm  ">{content.results}</div>
            <div
              onClick={() => openModalDeleteAll()}
              className="results-logo results-logo-delete cp"
              id="results-logo results-logo-delete"
              data-tooltip-content={content.deleteAllReports}
              data-tooltip-id="results-logo results-logo-delete"
            ></div>
            <Tooltip id="results-logo results-logo-delete" place="left" />
          </div>

          {!!isModalOpenDeleteAll && (
            <Modal
              textModaltitle={content.areYouSureYouWantToDeleteAllReports}
              textModal={content.delete}
              closeModal={closeModalDeleteAll}
              handleConfirmDelete={() => {
                handleConfirmDeleteAllReport(
                  reports.map((report) => report.id)
                );
                closeModalDeleteAll();
              }}
            />
          )}

          {/****************************************************************/}
          <div className="brd-bt">
            {/* список отчетов с кнопками  */}

            {reports.map((report) => (
              <ReportInfo
                key={report.id}
                report={report}
                loadReportDetails={loadReportDetails}
                // handleDownloadReport={handleDownloadReport}
                handleConfirmDeleteCurrentReport={
                  handleConfirmDeleteCurrentReport
                }
                // handleConfirmDeleteAllReport={handleConfirmDeleteAllReport}
                // isModalOpen={isModalOpen}
                // setIsModalOpen={setIsModalOpen}
                // openModal={openModal}
                // closeModal={closeModal}
              />
            ))}
          </div>
          <div className="fs-14 color-lg mt-10 txt-align-right user-select">
            {content.total}: {reports.length}
          </div>
        </>
      )}

      {reports.length === 0 && (
        <div className="fs-14 font-mdm brd-bt pb-10 mt-60">
          {content.thereIsNoReportForThisTask}
        </div>
      )}

      {!!reportDetails && ( //информация выводится по отчету
        <ReportDetailsInfo reportDetails={reportDetails} />
      )}
    </>
  );
};
export default Result;
