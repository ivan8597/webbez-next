import React, { useContext, useState, useEffect, createContext } from "react";
import { getCookie, setCookie } from "typescript-cookie";

type TimeZoneProviderProps = {
  children: React.ReactNode;
};

export const timeZones: string[] = [
  "Europe/Moscow",
  // 'Europe/Samara',
  // 'Asia/Yekaterinburg',
  // 'Asia/Omsk',
  // 'Asia/Krasnoyarsk'
];

export type TimeZone = (typeof timeZones)[number];
// export type TimeZone = string;

export type TimeZoneContextType = {
  handleCurrentTimeZone: (timezone: TimeZone) => void;
  currentTimeZone: TimeZone;
};

const TimeZoneContext = createContext<TimeZoneContextType | null>(null);

export const useTimeZone = () => {
  const context = useContext(TimeZoneContext);
  if (context === null) {
    throw new Error(
      "useTimeZone должен использоваться в пределах компонента TimeZoneProvider"
    );
  }
  return context;
};

export const TimeZoneProvider = ({ children }: TimeZoneProviderProps) => {
  const [currentTimeZone, setCurrentTimeZone] =
    useState<TimeZone>("Europe/Moscow");

  const handleCurrentTimeZone = (timezone: TimeZone) => {
    setCurrentTimeZone(timezone);
    setCookie("avl4_timezone", timezone, {
      domain: "sc.avl.team",
      expires: 364,
    });
  };
  useEffect(() => {
    let timezone = getCookie("avl4_timezone");
    if (!timezone) {
      setCookie(
        "avl4_timezone",
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        {
          
          domain: "sc.avl.team",
          expires: 364,
        }
      );
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    setCurrentTimeZone(timezone as TimeZone);
  }, []);
  // useEffect(() => {
  //   let timezone = getCookie("avl4_timezone");
  //   if (!timezone) {
  //     setCookie(
  //       "avl4_timezone", "Europe/Moscow", {
  //        domain: "sc.avl.team",
  //       expires: 364,
  //     });
  //     timezone = "Europe/Moscow";
  //   }
  //   setCurrentTimeZone(timezone as TimeZone);
  // }, []);

  return (
    <TimeZoneContext.Provider
      value={{
        handleCurrentTimeZone,
        currentTimeZone,
      }}
    >
      {children}
    </TimeZoneContext.Provider>
  );
};
