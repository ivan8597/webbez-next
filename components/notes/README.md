

для установки 
//нужно установить REACT_APP_API_NOTES в .env
//при локальной разработке указать REACT_APP_NOTES_LOCAL_TOKEN

//нужно установить в _docker  .env.avl4   .env.sc-avl-team  проекта  REACT_APP_API_NOTES="https://notes-api.sc.avl.team"











//для любого модуля
//надо скопировать папку core, содержит общий для заметок и основного приложения  mainContext в котором находятся пользователи, из core подключаем основные провайдеры (MainContextProvider содержит информацию о юзере,MainLanguageProvider для перевода на языки,)
//в App.tsx  основного приложения нужно добавить провайдеры которые находятся в core(MainContextProvider,MainLanguageProvider)
//надо импортировать в App.tsx  стили из core import "./components/core/css/utilities.css";

//для модуля notes
//надо скопировать папку notes
//надо вставить компонент BlockNotes в то место где он отобразиться 






//model,model_id нужны чтобы заметки относились к выбранной задаче