import { useEffect, useState } from "react";
import { usePostContext } from "../hook/postContext";
import { useLanguageNotes } from "../hook/langContext";
const activateMarker = (markers: NodeListOf<Element>, ocurrence: number) => {
  //функция активации маркера
  const selectedMarker = markers[ocurrence];
  markers.forEach((marker) => {
    marker.classList.remove("active");
  });
  if (selectedMarker) {
    selectedMarker.classList.add("active");
  }
  return selectedMarker;
};

const scrollTopDelta = (activeMarker: Element, mainBlock: Element) => {
  //функция высоты прокрутки
  const activeMarkerTop = activeMarker.getBoundingClientRect().top;
  const mainBlockTop = mainBlock.getBoundingClientRect().top;
  const scrollTopDelta = activeMarkerTop - (mainBlockTop + 50);
  return scrollTopDelta;
};
const SearchBlock = () => {
  const { searchTerm, setSearchTerm } = usePostContext();
  const [total, setTotal] = useState(0); //всего совпадений
  const [ocurrence, setOcurrence] = useState(0); // текущее совпадение
  const { content } = useLanguageNotes();
  const handleClear = () => {
    setSearchTerm("");
  };
  const next = () => {
    setOcurrence((prev) => (prev + 1) % total); //
  };
  const prev = () => {
    setOcurrence((prev) => (prev - 1 + total) % total);
  };
  
  useEffect(() => {
    if (searchTerm === "") {
      setTotal(0);
      setOcurrence(0);
      return;
    }
    
    const markers = document.querySelectorAll(".marked-text"); //все коллекции с совпадения
    setTotal(markers.length); //всего совпадений
    setOcurrence(0); // текущее совпадение
    activateMarker(markers, 0);
  }, [searchTerm]);
  useEffect(() => {
    const markers = document.querySelectorAll(".marked-text"); //все коллекции с совпадения

    const activeMarker = activateMarker(markers, ocurrence);
    const mainBlock = document.querySelector(".notes-main__note-messages");

    if (activeMarker && mainBlock) {
      const activeMarkerTop = activeMarker.getBoundingClientRect().top;
      const activeMarkerBottom =
        activeMarkerTop + activeMarker.getBoundingClientRect().height;
      const mainBlockTop = mainBlock.getBoundingClientRect().top;
      const mainBlockBottom =
        mainBlockTop + mainBlock.getBoundingClientRect().height;
      if (
        activeMarkerTop > mainBlockTop &&
        activeMarkerBottom < mainBlockBottom
      ) {
      } else {
        const delta = scrollTopDelta(activeMarker, mainBlock);
        mainBlock.scrollTop += delta;
      }
    }
  }, [ocurrence]);
  return (
    <div className="searchBlock pb-5">
      <div className="searchBlock-wrapper notes-main_search-panel  flex gap-20  pr-10">
        <div className="searchBlock-left-line brd-bt w-70p"></div>
        <div className="searchBlock-right-line-wrapper notes-main__search-panel-symbol flex gap-10 min-w-200  brd-bt w-30p">
          <div className="flex-1">
          <input
            // style={searchTerm ? { width:"calc(100% - 120px)" } : {flex:"1"}}
            className="searchBlock-right-line-input notes-main__input mr-10 w-full brd-none fs-12 pb-7 ca"
            type="text"
            value={searchTerm}
            placeholder={content.enterYourRequest}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          </div>
          {searchTerm ? (
            <div className="searchBlock-total-next-btn-prev-btn-wrapper pt-5  flex gap-10">{/*w-100 */}
              <div className="searchBlock-total fs-12">
                {" "}
                {/* {ocurrence + 1}/{total} */}
                {total > 0 ? `${ocurrence + 1}/${total}` : "0/0"}
              </div>
              <button className="searchBlock-btn searchBlock-btn-next" onClick={prev}></button>
              <button className="searchBlock-btn searchBlock-btn-prev" onClick={next}></button>
              <div
                onClick={handleClear}
                className="searchBlock-btn-clear notes-main__note-clear cp mt-3"
              ></div>
            </div>
          ) : (
            <div className="searchBlock-btn-submit notes-main__search-submit-button"></div>
          )}
          {/* <div className="notes-main__search-submit-button"></div> */}
        </div>
      </div>
    </div>
  );
};
export default SearchBlock;
