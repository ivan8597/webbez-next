import React from "react";
import { timeZones, useTimeZone } from "../context/timezoneContext";
const TimeZoneSwitcher = () => {
  const { handleCurrentTimeZone } = useTimeZone();
  return (
    <div>
       {timeZones.map((timezone) => (
        <button
          key={timezone}
          className="change-timezone"
          onClick={() => handleCurrentTimeZone (timezone)}
        >
          {timezone}
        </button>
      ))} 
      
    </div>
  );
};

export default TimeZoneSwitcher;
