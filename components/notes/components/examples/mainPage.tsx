import React from "react";
import BlockNotes from "../..";
// import LeftPanel from "./LeftPanel";
// import Header from "./Header";
// import SiderBar from "./SiderBar";
// import Menu from "./Menu";




const MainPage = () => {
  return (
    <div className="full-page">
      {/* <Header /> */}

      <div className=" full-page__content ">
        {/* <div className="sidebar content__sidebar">
          <div className="flex"> */}
            {/* <LeftPanel />
            <SiderBar /> */}
          {/* </div>
        </div> */}
        <div className="flex-1 content__main brd-lt-none brd-rt-none brd ">
          {/*brd*/}
          {/* <Menu /> */}
          {/* <div className="pt-10"> */}
          <BlockNotes />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
