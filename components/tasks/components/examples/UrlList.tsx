import React, { useState, useEffect } from "react";
import { Screen, useTasks } from "../context/tasksContext";
import httpService from "../../services/http.service";
import { Host } from "../../types";
import { useLanguage } from "../context/langContext";

const UrlList = () => {
  const { activeHosts, actualTaskTime, setActiveHosts, setInfoScreen } =
  useTasks();
    const {content}=useLanguage()//для перевода
  const [tasksHosts, setTasksHosts] = useState<Host[]>([]);
  useEffect(() => {
    httpService.getActionsOfHosts().then((hosts) =>
      setTasksHosts(
        hosts.sort((a: Host, b: Host) => {
          if (a.host < b.host) {
            return -1;
          } else if (a.host > b.host) {
            return 1;
          } else {
            return 0;
          }
        })
      )
    );
  }, [actualTaskTime]);

  return (
    <>
      <div className="scanner-url-name pb-10 font-mdm mb-10 fs-16 brd-bt user-select">URL</div>

      <div className=" flex-1 overflow-y-auto ">
        <div className="scanner-ul-url pr-5  ">
          {tasksHosts.map((host) => (
            <div
              className={
                "scanner-li-url pt-10 pb-10 mb-10 fs-14 brd-bt" +
                (activeHosts.includes(host.host) ? " active" : "")
              }
              key={host.host}
              onClick={() => {
                setActiveHosts(
                  activeHosts.includes(host.host)
                    ? activeHosts.filter((el) => el !== host.host)
                    : [...activeHosts, host.host]
                );
                setInfoScreen(Screen.DEFAULT);
              }}
            >
              {host.host}
            </div>
          ))}
        </div>
      </div>
      <div className="fs-14 color-lg pt-20  txt-align-right brd-top mt-10 user-select">
        {content.total}: {tasksHosts.length}
      </div>
    </>
  );
};

export default UrlList;
