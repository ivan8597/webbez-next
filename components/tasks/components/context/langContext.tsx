import React, {
  useContext,
  createContext,
  useMemo,
} from "react";

import contentEn from "../../content/textContentEn";
import contentEs from "../../content/textContentEs";
import contentFr from "../../content/textContentFr";
import contentRu from "../../content/textContent";
import { Language } from "../../../core/types";
import { useMainLanguage } from "../../../core/components/context/mainLangContext";
type LanguageProviderProps = {
  children: React.ReactNode;
};

export type Content =
  | typeof contentEn
  | typeof contentEs
  | typeof contentFr
  | typeof contentRu;

const LangContext = createContext<{
  content: Content;
  currentLang: Language | undefined;
} | null>(null);

export const useLanguage = () => {
  const context = useContext(LangContext);
  if (context === null) {
    throw new Error("useLanguage must be used within a LangContext Provider");
  }
  return context;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { currentLang } = useMainLanguage();

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

  return (
    <LangContext.Provider
      value={{
        content,
        currentLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};
