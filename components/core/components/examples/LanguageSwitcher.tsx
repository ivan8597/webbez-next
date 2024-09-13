import { useMainLanguage } from "../context/mainLangContext";

const LanguageSwitcher = () => {
  const { handleCurrentLang, currentLang } = useMainLanguage();

  return (
    <div className="psn-rlt bt-5">
      <button
        className="change-lang"
        onClick={() => handleCurrentLang(currentLang === "ru" ? "en" : "ru")}
      >
        {currentLang === "ru" ? "English" : "Русский"}
      </button>
    </div>
  );
};
export default LanguageSwitcher;
