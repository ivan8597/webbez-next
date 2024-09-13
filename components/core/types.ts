export type Access = "scanner_access" | "scanner_tasks"| "global_access_admin"
export type User = {
  id: string;
  username: string;
  last_name?: string | null;
  first_name?: string | null;
};

export type Language = "ru" | "en" | "fr" | "es";