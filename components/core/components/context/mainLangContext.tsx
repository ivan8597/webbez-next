import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useMemo,
} from "react";

import contentEn from "../../content/textContentEn";
import contentEs from "../../content/textContentEs";
import contentFr from "../../content/textContentFr";
import contentRu from "../../content/textContent";
import { getCookie, setCookie } from "typescript-cookie";
import { Language } from "../../../core/types";
type LanguageProviderProps = {
  children: React.ReactNode;
};

export type Content =
  | typeof contentEn
  | typeof contentEs
  | typeof contentFr
  | typeof contentRu;

const LangContext = createContext<{
  handleCurrentLang: (lang: Language) => void;
  content: Content;

  currentLang: Language | undefined;
} | null>(null);

export const useMainLanguage = () => {
  const context = useContext(LangContext);
  if (context === null) {
    throw new Error("useLanguage must be used within a LangContext Provider");
  }
  return context;
};

export const MainLanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLang, setCurrentLang] = useState<Language | undefined>("ru");

  const handleCurrentLang = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("lang", lang);
  };

  const content = useMemo(() => {
    switch (currentLang) {
      case "ru":
        return contentRu;

      case "en":
        return contentEn;

      case "fr":
        return contentFr;

      case "es":
        return contentEs;

      default:
        return contentRu;
    }
  }, [currentLang]);

  useEffect(() => {
    let lang = getCookie("avl4_lang");
    if (!lang) {
      setCookie("avl4_lang", "ru", {
        domain: "sc.avl.team",
        expires: 364,
      });
      lang = "ru";
    }
    setCurrentLang(lang as Language);
  }, []);

  
  return (
    <LangContext.Provider
      value={{
        handleCurrentLang,
        content,

        currentLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};
