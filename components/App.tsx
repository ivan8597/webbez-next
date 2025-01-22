import React, { useEffect } from "react";
import "@ivan8597/core/dist/css/main.css";
import "@ivan8597/notes_package/dist/css/main.css"
import "./App.css";
// import "./notes/css/notes.css";
// import { PostProvider } from "./notes/components/hook/postContext";
// import { TimeZoneProvider } from "./notes/components/hook/timezoneContext";
import { getCookie, setCookie } from "typescript-cookie";
// import { LanguageProvider } from "./notes/components/hook/langContext";
import { MainContextProvider } from "@ivan8597/core";
import { MainLanguageProvider } from "@ivan8597/core";
import TasksPage from "./tasks";
import { TimeZoneProvider } from "@ivan8597/core";
function App() {
  useEffect(() => {
    // document
    //   .getElementById("panel_change_theme")
    //   ?.addEventListener("click", () => {
    //     const theme = getCookie("avl4_theme") || "light";

    //     if (theme) {
    //       theme === "light"
    //         ? setCookie("avl4_theme", "dark", {
    //             domain: "sc.avl.team",
    //             expires: 364,
    //           })
    //         : setCookie("avl4_theme", "light", {
    //             domain: "sc.avl.team",
    //             expires: 364,
    //           });
    //     }
    //   });
    document.body.classList.add("light");
  }, []);
  return (
    <MainLanguageProvider>
      <MainContextProvider>
        <TimeZoneProvider>
        <TasksPage />
      
        </TimeZoneProvider>
      </MainContextProvider>
      
    </MainLanguageProvider>
  );
  // return (
  //   <LanguageProvider>
  //   <TimeZoneProvider>

  //     <PostProvider model={"note"} modelId={"1"} currentUser={null} hasAccess={() => false}>
  //       <MainPage />
  //     </PostProvider>
  //   </TimeZoneProvider>
  //   </LanguageProvider>
  // );
}

export default App;
