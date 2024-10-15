import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,

} from "react";
import {  Action, Report, Task } from "../../types";
import httpService from "../../services/http.service";
import { useLanguage } from "./langContext";
import { CHECK_INTERVAL, CHECK_LIMIT } from "../../services/progress";


type TasksContextProviderProps = {
  children: React.ReactNode;
};
const tasksTimeOuts: Record<string, NodeJS.Timeout> = {}; // временные таймеры
export enum Screen {
  DEFAULT = "default",
  RESULTS = "results",
  ADD_TASK = "add_task",
  FRONT_JANGO = "frontjango",
}
type ValueForContex = {
  tasks: Task[];
  activeTaskId: string;
  processedData: string[];
  actions: Action[];
  selectedActions: boolean[];
  infoScreen: Screen;
  searchTerm: string;
  reports: Report[];
  activeHosts: string[];
  activePage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  actualTaskTime: number;
  taskActionsIds: string[];

 
  setTasks: (tasks: Task[]) => void;
  setInfoScreen: (infoScreen: Screen) => void;
  setActualTaskTime: (actualTaskTime: number) => void;
  setSelectedActions: (selectedActions: boolean[]) => void;
  setPageSize: (pageSize: number) => void;
  setActiveTaskId: (activeTaskIds: string) => void;

  setProcessedData: (processedData: string[]) => void;
  setSearchTerm: (searchTerm: string) => void;
  loadActiveTaskReports: (activeTaskId: string) => void;
  setReports: (reports: Report[]) => void;
  loadTasks: () => void;
  setActiveHosts: (activeHosts: string[]) => void;
  nextPage: () => void;
  prevPage: () => void;
  processCheckStatus: (id: string) => void;
};

export const TasksContext = createContext<ValueForContex>({
  tasks: [],
  activeTaskId: "",
  processedData: [],
  reports: [],
  actions: [],
  selectedActions: [],
  infoScreen: Screen.DEFAULT,
  searchTerm: "",
  activeHosts: [],
  activePage: 0,
  totalPages: 0,
  pageSize: 10,
  totalCount: 0,
  actualTaskTime: 0,
  taskActionsIds: [],
 
  setInfoScreen: () => {},
  setPageSize: () => {},
  setSelectedActions: () => {},

  setActualTaskTime: () => {},
  setActiveTaskId: () => {},
  setTasks: () => {},
  setProcessedData: () => {},
  setSearchTerm: () => {},
  loadActiveTaskReports: () => {},
  setReports: () => {},
  loadTasks: () => {},
  setActiveHosts: () => {},
  nextPage: () => {},
  prevPage: () => {},
  processCheckStatus: () => {},
});

export const useTasks = () => {
  return useContext(TasksContext);
};
export const TasksContextProvider = ({ children }: TasksContextProviderProps) => {
  const [activeTaskId, setActiveTaskId] = useState<string>("");
  const [activeHosts, setActiveHosts] = useState<string[]>([]);
  const [processedData, setProcessedData] = useState<string[]>([]);

  const [infoScreen, setInfoScreen] = useState<Screen>(Screen.DEFAULT);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedActions, setSelectedActions] = useState<boolean[]>([]);
  // console.log(selectedActions);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [reports, setReports] = useState<Report[]>([]);
  const [actualTaskTime, setActualTaskTime] = useState<number>(0);

  const [activePage, setActivePage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalCount, setTotalCount] = useState<number>(0);

  


  const { content } = useLanguage();



  const nextPage = () => {
    if (activePage < totalPages - 1) {
      setActivePage(activePage + 1);
    }
  };

  const prevPage = () => {
    if (activePage > 0) {
      setActivePage(activePage - 1);
    }
  };

  // const filterTasksByHost = useMemo(() => {
  //   //фильтрует массив tasks в зависимости от выбранных активных хостов и возвращает отфильтрованный результат
  //   // позволяет управлять отображением задач  в зависимости от выбранных хостов
  //   if (activeHosts.length === 0) {
  //     return tasks;
  //   }
  //   return tasks.filter((el) => activeHosts.includes(el.host));
  // }, [activeHosts, tasks]);

  const searchTasks = useMemo(() => {
    //используется для фильтрации уже отфильтрованного списка задач filterTasksByHost в зависимости от searchTerm
    //позволяет  осуществлять поиск по задачам на основе target
    if (searchTerm === "") {
      return tasks;
    }
    return tasks.filter((el) =>
      el.target.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tasks]);

  const taskActionsIds = useMemo(() => {
    const ids: string[] = [];
    for (let i = 0; i < searchTasks.length; i++) {
      if (searchTasks[i]?.action?.id) {
        const id = searchTasks[i]?.action?.id;
        if (!ids.includes(id)) {
          ids.push(id);
        }
      }
    }
    return ids;
  }, [searchTasks]); //получаем список доступных id-ков action-ов

  const filterTasks = useMemo(() => {
    if (selectedActions.filter((el) => el).length === 0) {
      return []; //если ни один чекбокс не выбран, задачи не отображаются
    }
    if (selectedActions.filter((el) => el).length === actions.length) {
      return searchTasks; //если все чекбоксы выбраны, отображаются все задачи
    }
    return searchTasks.filter(
      (el) =>
        selectedActions[
          actions.findIndex((action) => action.id === el.action.id) //получаем информацию о том, выбрано ли чекбокс для данного action
        ]
    );
  }, [selectedActions, searchTasks]);
  const loadTasks = () => {
    httpService.getAllTasks(activePage, pageSize).then((data) => {
      setTasks(data.items); //устанавливаем список задач
      setTotalPages(Math.ceil(data.total / pageSize)); //устанавливаем общее кол-во страниц
      setTotalCount(data.total); //устанавливаем общее кол-во задач
    });
  };
  const loadActiveTaskReports = (activeTaskId: string) => {
    httpService.getAllReportsOfTask(activeTaskId).then((reports) => {
      setReports(reports);
    });
  };
  const processCheckStatus = (id: string, counter = 0) => {
    // функция обработки статуса задачи
    // проверка статуса задачи
    httpService.getTaskById(id).then((task: Task) => {
      setTasks((tasks) => tasks.map((el) => (el.id === id ? task : el))); // обновляем  задачу

      if (task.in_progress === false) {
        if (task.id === activeTaskId) {
          // если задача активная,то обновляем отчеты
          loadActiveTaskReports(task.id);
        }
        return;
      }

      if (counter >= CHECK_LIMIT) {
        return;
      }
      clearTimeout(tasksTimeOuts[id]); // очищаем предыдущий таймер
      tasksTimeOuts[id] = setTimeout(() => {
        // запускаем новый таймер
        processCheckStatus(id, counter + 1); //рекурсивно вызываем функцию для следующей проверки статуса задачи
      }, CHECK_INTERVAL); // интервал проверки статуса задачи 5 минут
    });
  };

  useEffect(() => {
    loadTasks();
  }, [activePage, pageSize]); //получаем список задач

  useEffect(() => {
    if (activePage === 0) {
      return;
    }
    setActivePage(0);
  }, [pageSize]);

  useEffect(() => {
    httpService.getActionsList(content).then((actions) => {
      setActions(actions); //получаем список action-ов
      setSelectedActions(actions.map(() => true)); //по умолчанию все чекбоксы отмечены когда false не отмечены
    });
  }, []);
  useEffect(() => {
    if (!activeTaskId) {
      return;
    }
    loadActiveTaskReports(activeTaskId); //получаем отчеты активной задачи
  }, [activeTaskId]);

 
 

  

 




  return (
    <TasksContext.Provider
      value={{
        tasks: filterTasks,
        activeTaskId,
        processedData,
        searchTerm,
        actions,
        selectedActions,
        infoScreen,
        reports,
        activeHosts,
        activePage,
        totalPages,
        pageSize,
        totalCount,
        actualTaskTime,
        taskActionsIds,
   
        setTasks,
        setInfoScreen,
        setSelectedActions,
        setSearchTerm,
        setActiveTaskId,
        setReports,
        setProcessedData,
        setPageSize,
        loadActiveTaskReports,
        setActualTaskTime,
        loadTasks,
        setActiveHosts,
        nextPage,
        prevPage,
        processCheckStatus,
   
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
