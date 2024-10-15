import React from "react";
import { useTasks } from "../context/tasksContext";
import { useLanguage } from "../context/langContext";

const Pagination = () => {
  const { pageSize, setPageSize, tasks, totalCount } = useTasks();

  const { content } = useLanguage();
  const isDisabled = tasks.length < 20;

  const renderPageSizeLinks = () => {
    let pageSizes: number[] = [];

    if (totalCount < 50) {
      pageSizes = [20, 30, 40];
    } else if (totalCount >= 50 && totalCount < 100) {
      pageSizes = [20, 50, 100];
    } else if (totalCount >= 100 && totalCount < 500) {
      pageSizes = [100, 200, 500];
    } else if (totalCount >= 500 && totalCount < 1000) {
      pageSizes = [500, 700, 1000];
    } else if (totalCount >= 1000) {
      pageSizes = [1000, 1500, 2000];
    } else {
      return [];
    }

    const result = pageSizes.map((size) => (
      <a
      
        key={size}
        href="/"
        className={`pagination-link ${pageSize === size ? "active " : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setPageSize(size);
        }}
      >
        {size}
      </a>
    ));
    result.push(
      <a
    
        key={"all"}
        href="/"
        className={`pagination-all ${  pageSize === pageSizes[2] ? "active " : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setPageSize(pageSizes[2]);
        }}
      >
        {content.all}
      </a>
    );
    return result;
  };

  return (
    <>
      <div
        className={
          "flex fs-14 psn-rlt mt-10 pt-20 brd-top cp gap-10 min-h-35 user-select " +
          (isDisabled ? "pagination-disabled" : "")
        }
      >
    <span className=" show-page fw-b user-select">{content.show}:</span>
        {renderPageSizeLinks()}

        {/* <a
          onClick={(e) => {
            e.preventDefault();
            prevPage();
          }}
          href="#"
        >
          Пред
        </a>
        <span className="fs-14">
          {activePage + 1}/{totalPages}
        </span>
        <a
          onClick={(e) => {
            e.preventDefault();
            nextPage();
          }}
          href="#"
        >
          След
        </a> */}

        <span className="fs-14 color-lg psn-abs r-null user-select ">
          {content.total}: {tasks.length}
        </span>
      </div>
    </>
  );
};

export default Pagination;
