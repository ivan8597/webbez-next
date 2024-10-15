export type Task = {
  id: string;
  target: string;
  host: string;
  in_progress: boolean;
  action: Action;
  created_at: string;
  last_report_date: null | string;
};

export type Action = {
  id:
    | "raskrytie-dannyh"
    | "uyazvimye-napravleniya"
    | "polnoe-issledovanie"
    | "malware";
  label_en: string;
  label_ru: string;
};

export type Report = {
  id: string;
  in_progress: boolean;
  progress: number | null;
  started_at: string;
  finished_at: null | string;
  task: Task;
  // task_action: Action;
  // task_target: string;
};

export type ReportDetails = {
  data: {
    message: {
      action: string;
      action_id: string;
      goal: string;
      reportDate: string;
      reportDateEnd: string;
      use_auth?: string;
      use_cookie?: string;
      vectors: Vectors[];
    };

    status: string;
  };
  task: Task;
  started_at: string;
};
export type Vectors = {
  date: string;
  description: string;
  name: string;
  status: string;
};

export type Host = {
  host: string;
};

export type Access = "scanner_access" | "scanner_tasks"| "global_access_admin"


