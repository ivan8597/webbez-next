import React, { useEffect } from "react";
import MainPage from "./notes/components/examples/mainPage";
import "./core/css/utilities.css";
import "./notes/css/notes.css";
// import { PostProvider } from "./notes/components/hook/postContext";
// import { TimeZoneProvider } from "./notes/components/hook/timezoneContext";
import { getCookie, setCookie } from "typescript-cookie";
// import { LanguageProvider } from "./notes/components/hook/langContext";
import { MainContextProvider } from "./core/components/context/mainContext";
import { MainLanguageProvider } from "./core/components/context/mainLangContext";
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
     
        <MainPage />
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
