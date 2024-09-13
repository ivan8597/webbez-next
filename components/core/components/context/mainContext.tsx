import React, {
  createContext,
  useEffect,
 
  useState,
  useContext,
  useCallback,
} from "react";
import { Access, User } from "../../types";



type MainContextProviderProps = {
  children: React.ReactNode;
};

type ValueForContex = {
  currentUser: User | null;
  hasAccess: (accessItem: Access) => boolean;
};

export const MainContext = createContext<ValueForContex>({
  currentUser: null,

  hasAccess: () => false,
});

export const useMain = () => {
  return useContext(MainContext);
};
export const MainContextProvider = ({ children }: MainContextProviderProps) => {
  
  const [access, setAccess] = useState<Access[]>([
    // "scanner_access",
    // "scanner_tasks",
    // "global_access_admin",
  ]);
  const [rolesLoaded, setRolesLoaded] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
 console.log(currentUser)
  const loader = !rolesLoaded || !fontsLoaded; //если роли не загружены или шрифты не загружены, то показывать лоадер
  // const { content } = useLanguage();

  const hasAccess = useCallback(
    //функция для проверки роли пользователя
    (accessItem: Access) => {
      return access.includes(accessItem); //проверка наличия роли в массиве
    },
    [access]
  );

  //получаем список доступных ролей
  useEffect(() => {
    const testUser = localStorage.getItem("test_user"); //получаем тестового пользователя
    const awaitPeriod = testUser ? 2000 : 90000; //период ожидания
    let startTime = 0;
    let intervalId = setInterval(() => {
      //запускаем таймер
      startTime += 1000; //увеличиваем время ожидания
      if (startTime >= awaitPeriod) {
        //проверяем время ожидания
        clearInterval(intervalId); //очищаем таймер
        console.log("no access");

        if (testUser) {
          setCurrentUser(JSON.parse(testUser));
          setAccess(JSON.parse(testUser).keycloak_roles);
        }
        setRolesLoaded(true); //заканчиваем загрузку ролей
        return;
      }
      // @ts-ignore
      if (typeof window?.avl_user?.keycloak_roles !== "undefined") {
        // @ts-ignore
        setAccess(window.avl_user.keycloak_roles); //получаем список доступных ролей
        // @ts-ignore
        setCurrentUser(window.avl_user); //получаем информацию о текущем пользователе
        console.log("access");
        setRolesLoaded(true); //заканчиваем загрузку ролей
        clearInterval(intervalId);
      }
    }, 1000);
    return () => {
      clearInterval(intervalId); //очищаем таймер
    };
    // setTimeout(() => {
    //   // @ts-ignore
    //   if (typeof window?.avl_user?.keycloak_roles !== "undefined") {
    //     // @ts-ignore
    //     setAccess(window.avl_user.keycloak_roles); //получаем список доступных ролей
    //     // @ts-ignore
    //     setCurrentUser(window.avl_user); //получаем информацию о текущем пользователе
    //     console.log("access");
    //   } else {
    //     console.log("no access");
    //     const testUser = localStorage.getItem("test_user"); //пофиксить на локалке авторизацию пользователя
    //     if (testUser) {
    //       setCurrentUser(JSON.parse(testUser));
    //       setAccess(JSON.parse(testUser).keycloak_roles);
    //     }
    //   }
    //   setRolesLoaded(true);
    // }, 500);
  }, []);

  useEffect(() => {
    const font1 = new FontFace(
      "IBMPlexSans-Medium",
      "url(/static/media/IBMPlexSans-Medium.56fb541cbbc5462f1c33.ttf)"
    );
    const font2 = new FontFace(
      "IBMPlexSans-Light",
      "url(/static/media/IBMPlexSans-Light.f6a1d8cf71c931e0b2aa.ttf)"
    );

    Promise.all([font1.load(), font2.load()])
      .then(() => {
        document.fonts.add(font1);
        document.fonts.add(font2);
        setFontsLoaded(true);
      })
      .catch((err) => {
        console.error("Ошибка загрузки шрифтов:", err);
        setFontsLoaded(true);
      });
    let timeOut = setTimeout(() => {
      setFontsLoaded(true);
    }, 20000);
    return clearTimeout(timeOut);
  }, []);

 
  if (loader) {
    return (
      <div
        className="loader"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    );
  }

  return (
    <MainContext.Provider
      value={{
        currentUser,

        hasAccess,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
