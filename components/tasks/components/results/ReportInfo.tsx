import React, { useState, useCallback } from "react";

import { Report } from "../../types";
import httpService from "../../services/http.service";

import { Tooltip } from "react-tooltip";
import Modal from "../ui/Modal";

import { useLanguage } from "../context/langContext";

const ReportInfo = ({
  report,
  // isModalOpen,
  // openModal,
  // closeModal,
  // setIsModalOpen,
  loadReportDetails,
  // handleDownloadReport,
  handleConfirmDeleteCurrentReport,
}: // handleConfirmDeleteAllReport,
{
  report: Report;
  // isModalOpen: boolean;
  // openModal: () => void;
  // closeModal: () => void;
  // setIsModalOpen: (isModalOpen: boolean) => void;
  loadReportDetails: (reportId: string) => void;
  // handleDownloadReport: (reportId: string) => void;
  handleConfirmDeleteCurrentReport: (reportId: string) => void;
  // handleConfirmDeleteAllReport: (reportId: string[]) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { task, in_progress } = report;
  const { content } = useLanguage();
  // const { progress, in_progress, started_at, finished_at, task } = report;
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  }, []);
  const handleDownloadReport = (reportId: string) => {
    httpService
      .downloadCurrentReport(reportId)
      .then((response) => window.open(response?.config.url, "_blank"));
  };
  return (
    <>
      <div className="flex sp-btw pt-10 pb-10 results-border ">
        <div className="fs-14 pb-3 hover-accent">{task.host}</div>
        <div
          className={
            "result-logosReport flex sp-btw gap-10 mt-5 user-select " +
            (in_progress ? "results-in-progress" : "")
          }
        >
          <div
            className="result-logos result-logo-loadReport cp"
            id="result-logo-loadReport"
            data-tooltip-id="result-logo-loadReport"
            data-tooltip-content={content.viewReport}
            onClick={() => loadReportDetails(report.id)}
          ></div>
          <Tooltip id="result-logo-loadReport" />
          <div
            className="result-logos result-logo-downloadReport cp"
            id="result-logo-downloadReport"
            data-tooltip-id="result-logo-downloadReport"
            data-tooltip-content={content.downloadReport}
            onClick={() => handleDownloadReport(report.id)}
          ></div>
          <Tooltip id="result-logo-downloadReport" />
          <div
            onClick={() => openModal()}
            className="result-logos result-logo-deleteReport cp"
            id="result-logo-deleteReport"
            data-tooltip-id="result-logo-deleteReport"
            data-tooltip-content={content.deleteReport}
          ></div>
          <Tooltip id="result-logo-deleteReport" />
        </div>
      </div>

      {/****Modal for delete report****/}
      {!!isModalOpen && (
        <Modal
          textModaltitle={content.areYouSureYouWantToDeleteThisReport}
          textModal={content.delete}
          closeModal={closeModal}
          handleConfirmDelete={() => {
            handleConfirmDeleteCurrentReport(report.id);
            closeModal();
          }}
        />
      )}
    </>
  );
};
export default ReportInfo;
