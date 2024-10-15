import { toast } from "react-toastify";
import { Content } from "../components/context/langContext";

//area is component name as string
export function responseStatusChecker(
  status: number,
  area: string = "default",
  content: Content
): void {
  if (status === 200) {
    switch (area) {
      case "addTaskForm":
        toast.success(content.catcher["Task added successfully"], {
          position: "bottom-right",
        });
        break;
      case "singleReport":
        toast.success(content.catcher["The task was successfully restarted"], {
          position: "bottom-right",
        });
        break;
      default:
        break;
    }
  }
  if (status === 400) {
    switch (area) {
      case "addTaskForm":
        toast.error(content.catcher["Such a task already exists"], {
          position: "bottom-right",
        });
        break;
      case "restartTask":
        toast.error(content.catcher["Task restart is already in progress"], {
          position: "bottom-right",
        });
        break;
      default:
        break;
    }
  }
  if (status === 401) {
    switch (area) {
      case "addTaskForm":
        toast.warning(content.catcher["The user is not authorized"], {
          position: "bottom-right",
        });
        break;
      default:
        break;
    }
  }
  if (status === 404) {
    switch (area) {
      case "addTaskForm":
        toast.error(
          content.catcher["Setting the task is impossible! Contact support"],
          { position: "bottom-right" }
        );
        break;
      case "downloadCurrentReport":
        toast.error(
          content.catcher[
            "Error downloading report! Please try again later or contact support!"
          ],
          { position: "bottom-right" }
        );
        break;
      default:
        toast.error(content.catcher["Error 404! Contact support"], {
          position: "bottom-right",
        });
        break;
    }
  }
  if (status === 422) {
    switch (area) {
      case "addTaskForm":
        toast.error(content.catcher["Invalid web address"], {
          position: "bottom-right",
        });
        break;
      default:
        break;
    }
  }
  if (status >= 500) {
    switch (area) {
      case "default":
        toast.error(
          content.catcher[
            "The server is temporarily unavailable. Please try again later or contact support"
          ],
          { position: "bottom-right" }
        );
        break;
      case "addTaskForm":
        toast.error(
          content.catcher[
            "The server is temporarily unavailable. Please try again later or contact support"
          ],
          { position: "bottom-right" }
        );
        break;
      default:
        toast.error(
          content.catcher[
            "The server is temporarily unavailable. Please try again later or contact support"
          ],
          { position: "bottom-right" }
        );
        break;
    }
  }
}
export default responseStatusChecker;
