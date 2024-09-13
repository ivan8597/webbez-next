import axios from "axios";

// const apiUrl = "http://localhost:8085/api/server";
const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_NOTES;
// const endpoint = process.env.REACT_APP_API_BASE_URL;

const localToken = process.env.NEXT_PUBLIC_REACT_APP_NOTES_LOCAL_TOKEN;
const options = localToken
  ? {
      headers: {
        "h-avl-session": localToken,
      },
    }
  : undefined;
const getBodyOptions = () => {
  //добавить headers content type
  const headers = { "Content-Type": "application/json" };
  if (localToken) {
    headers["h-avl-session"] = localToken;
  }
  return {
    headers,
  };
};

class Api {
  //класс  для работы с запросами
  callbacks = {
    //объект с колбэками
    showError: (show) => {}, //метод для отображения ошибок, чтобы не передавать в каждый вызов функции
    setLoader: () => {}, //метод для отображения лоадера, чтобы не передавать в каждый вызов функции
  };
  async get(url) {
    try {
      this.callbacks.setLoader(true); //метод устанавливает состояние загрузки в true с помощью колбэка setLoader, процесс загрузки начался и может быть отображен пользователю
      const response = await axios.get(url, options);
      this.callbacks.setLoader(false); //после получения ответа метод  использует колбэк setLoader, чтобы установить состояние загрузки в false, указывая на завершение процесса загрузки
      return response.data;
    } catch (error) {
      this.callbacks.setLoader(false);
      this.callbacks.showError();
      console.log(error);
    }
  }
  async post(url, data) {
    try {
      this.callbacks.setLoader(true);
      const response = await axios.post(url, data, getBodyOptions());
      this.callbacks.setLoader(false);
      return response.data;
    } catch (error) {
      this.callbacks.setLoader(false);
      this.callbacks.showError();
      console.log(error);
    }
  }
}

const api = new Api(); //объект api
export const getApi = () => api; //функция для получения api
// const catcher = (error) => {
//   // перехватить ошибки в запросах
//   const content = languageStore.content;
//   if (error?.response?.status === 400) {
//     toast.error(content.catcher.tooManyRequest, {
//       position: "bottom-right",
//     });
//     return;
//   }
//   if (error?.response?.status === 401) {
//     toast.error(content.catcher.userNotAuthorized, {
//       position: "bottom-right",
//     });
//     return;
//   }
//   toast.error(content.catcher.unknownError, {
//     position: "bottom-right",
//   });
// };
async function getPostsRequest({ model, model_id }) {
  //получить все посты
  let query = "";
  if (model && model_id) {
    query = `&model=${model}&model_id=${model_id}`;
  }
  // try {
  //   const response = await axios.get(
  //     `${apiUrl}/?offset=0&limit=100&order=-id` + query,
  //     options
  //   );
  //   return response.data;
  // } catch (error) {
  //   catcher(error);
  // }
  return api.get(`${apiUrl}/?offset=0&limit=100&order=-id` + query);

  // return {
  //   items: response.data,
  //   total: response.data.length,
  // };
}

async function addPostRequest(post) {
  //добавить пост
  // try {
  //   const response = await axios.post(
  //     `${apiUrl}/`,
  //     post, //добавить пост
  //     getBodyOptions() //добавить headers content type
  //   );

  //   return response.data;
  // } catch (error) {
  //   catcher(error);
  // }

  return api.post(`${apiUrl}/`, post);
}
async function updatePostRequest(post) {
  //редактировать пост
  // try {
  //   const response = await axios.post(
  //     // `${apiUrl}/posts/notes/`,

  //     `${apiUrl}/`,
  //     post,
  //     getBodyOptions()
  //   );
  //   return response.data;
  // } catch (error) {
  //   catcher(error);
  // }

  return api.post(`${apiUrl}/`, post);
}

async function deletePostRequest(id) {
  // try {
  //   const response = await axios.post(
  //     `${apiUrl}/${id}/delete/`,
  //     {}, //добавить пустой пост
  //     getBodyOptions() //добавить headers content type
  //   );

  //   return response.data;
  // } catch (error) {
  //   catcher(error);
  // }

  return api.post(`${apiUrl}/${id}/delete/`, {});
}
export {
  getPostsRequest,
  addPostRequest,
  updatePostRequest,
  deletePostRequest,
};
