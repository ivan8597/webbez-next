import axios from "axios";
import responseStatusChecker from "./catcher.service";
import Config from "./config.url.json";

const endpoint = process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL;
const base = Config.dev;

const localToken = process.env.NEXT_PUBLIC_REACT_APP_NOTES_LOCAL_TOKEN;
const options = localToken
  ? {
      headers: {
        "h-avl-session": localToken,
      },
    }
  : {};
async function getActionsList(content) {
  try {
    const response = await axios({
      ...options,
      method: base.getActionsList.method,
      url: endpoint + base.getActionsList.request,
    });
    return (
      response?.data?.items.filter((item) => item.id !== "pop3-analiz") || []
    );
  } catch (error) {
    responseStatusChecker(error.response?.status || 500, undefined, content);
    return [];
  }
}
async function addNewTask({ url, actionType, content }) {
  try {
    const response = await axios({
      method: base.addTask.method,
      url: `${endpoint}${base.addTask.request}`,
      headers: {
        "content-type": "application/json",
        ...options?.headers,
      },

      data: {
        action: actionType,
        target: url,
      },
    });
    return response;
  } catch (error) {
    responseStatusChecker(error.response.status, "addTaskForm", content);
  }
}

async function getAllTasks(activePage, pageSize) {
  try {
    const response = await axios({
      ...options,
      method: base.getTasks.method,
      url: endpoint + base.getTasks.request,
      params: {
        page: activePage,
        offset: activePage * pageSize,
        limit: pageSize,
        order: "-id",
      },
    });
    if (response.data) {
      return response.data;
    }
    return { items: [], total: 0 };
  } catch (error) {
    return { items: [], total: 0 };
  }
}
async function getAllTasksOfHost(host) {
  try {
    const response = await axios({
      ...options,
      method: base.getTasks.method,
      url: endpoint + base.getTasks.request,
      params: {
        host: host,
        page: 1,
        offset: 0,
        limit: 100,
        order: "-id",
      },
    });
    return response.data.items;
  } catch (error) {}
}
async function getTaskById(taskId) {
  try {
    const response = await axios({
      ...options,
      method: base.getTaskById.method,
      url: `${endpoint}${base.getTaskById.request}${taskId}/`,
    });
   
    return response.data;
  } catch (error) {}
}
async function getAllReports() {
  try {
    const response = await axios({
      ...options,
      method: base.getAllReports.method,
      url: endpoint + base.getAllReports.request,
      params: {
        page: 1,
        offset: 0,
        limit: 100,
        order: "-id",
      },
    });
    return response.data.items;
  } catch (error) {}
}
async function getAllReportsOfTask(taskId) {
  try {
    const response = await axios({
      ...options,
      method: base.getAllReportsOfTask.method,
      url: endpoint + base.getAllReportsOfTask.request,
      params: {
        task_id: taskId,
        page: 1,
        offset: 0,
        limit: 100,
        order: "-id",
      },
    });
    return response.data.items;
  } catch (error) {
    console.log("error in getReportsById", error);
  }
}
async function getCurrentReport(reportId) {
  try {
    const response = await axios({
      ...options,
      method: base.getCurrentReport.method,
      url: `${endpoint}${base.getCurrentReport.request}${reportId}/`,
    });
    return response.data;
  } catch (error) {}
}
async function getAvaliableScanTypes() {
  try {
    const response = await axios({
      ...options,
      method: base.getAvaliableScanTypes.method,
      url: endpoint + base.getAvaliableScanTypes.request,
    });
    return response.data.items;
  } catch (error) {}
}
async function getActionsOfTargets() {
  try {
    const response = await axios({
      ...options,
      method: base.getActionsOfTargets.method,
      url: endpoint + base.getActionsOfTargets.request,
    });
    return response.data.items;
  } catch (error) {}
}
async function getActionsOfHosts(content) {
  try {
    const response = await axios({
      ...options,
      method: base.getActionsOfHosts.method,
      url: endpoint + base.getActionsOfHosts.request,
    });
    return response?.data?.items || [];
  } catch (error) {
    console.log(error);
    responseStatusChecker(error?.response?.status, undefined, content);
    return [];
  }
}
async function restartTask(taskId, content) {
  try {
    const response = await axios({
      ...options,
      method: base.restartTask.method,
      url: `${endpoint}${base.restartTask.request}${taskId}/run/`,
    });
    console.log("response", 1);
    return response;
  } catch (error) {
    console.log("response", 2);
    responseStatusChecker(error.response.status, "restartTask", content);
  }
}
async function deleteTask(taskId, content) {
  try {
    const response = await axios({
      ...options,
      method: base.deleteTask.method,
      url: `${endpoint}${base.deleteTask.request}${taskId}/`,
    });
    return response;
  } catch (error) {
    console.log("error in deleteTask in httpservice", error);
    responseStatusChecker(error.response.status, undefined, content);
  }
}
async function deleteAnyTasks(tasksIds, content) {
  try {
    const response = await axios({
      ...options,
      method: base.deleteAnyTasks.method,
      url: `${endpoint}${base.deleteAnyTasks.request}${tasksIds}/`,
    });
    return response;
  } catch (error) {
    console.log("error deleteAnyTasks in http", error);
    responseStatusChecker(error.response.status, undefined, content);
  }
}
async function deleteCurrentReport(reportId, content) {
  try {
    const response = await axios({
      ...options,
      method: base.deleteCurrentReport.method,
      url: `${endpoint}${base.deleteCurrentReport.request}${reportId}/`,
    });
    return response;
  } catch (error) {
    console.log("error in http", error);
    responseStatusChecker(error.response.status, undefined, content);
  }
}
async function deleteAllReports(reportsIds, content) {
  try {
    const response = await axios({
      ...options,
      method: base.deleteAllReports.method,
      url: `${endpoint}${base.deleteAllReports.request}${reportsIds}/`,
    });
    return response;
  } catch (error) {
    console.log("error deleteAllReports in http", error);
    responseStatusChecker(error.response.status, undefined, content);
  }
}
async function downloadCurrentReport(reportId, content) {
  try {
    const response = await axios({
      ...options,
      method: base.downloadCurrentReport.method,
      url: `${endpoint}${base.downloadCurrentReport.request}${reportId}/file/`,
    });
    return response;
  } catch (error) {
    responseStatusChecker(
      error.response.status,
      "downloadCurrentReport",
      content
    );
  }
}

const httpService = {
  getActionsList: getActionsList,
  addTask: addNewTask,
  getAllTasks: getAllTasks,
  getTaskById: getTaskById,
  getAllReports: getAllReports,
  getAllReportsOfTask: getAllReportsOfTask,
  getCurrentReport: getCurrentReport,
  getAvaliableScanTypes: getAvaliableScanTypes,
  getActionsOfTargets: getActionsOfTargets,
  getActionsOfHosts: getActionsOfHosts,
  restartTask: restartTask,
  deleteTask: deleteTask,
  deleteAnyTasks: deleteAnyTasks,
  deleteCurrentReport: deleteCurrentReport,
  deleteAllReports: deleteAllReports,
  downloadCurrentReport: downloadCurrentReport,
  getAllTasksOfHost: getAllTasksOfHost,
};
export default httpService;
