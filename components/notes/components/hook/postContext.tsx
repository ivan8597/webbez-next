import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import { Post, PostNode, ReplyToForm } from "../../types";
import {
  addPostRequest,
  deletePostRequest,
  getApi,
  getPostsRequest,
  updatePostRequest,
} from "../../services/http.services";
import { getNotesTree } from "../../services/tree";

import { useLanguageNotes } from "./langContext";
import { Access, User } from "../../../core/types";



export type ErrorNotification = {
  message: string;
  title: string;
};
export type PostContextProps = {
  children: React.ReactNode;
  model: string;
  modelId: string;
  currentUser: User | null; //текущий пользователь
  hasAccess: (access: Access) => boolean; //функция проверки роли пользователя
};
type PostData = {
  items: Post[];
  total: number;
  // user_annotated: User[];
};
type PostContexType = {
  treeNotes: PostNode[];
  addMessage: (
    replyId: string,
    text: string,
    succesCallback?: () => void
  ) => void;
  addNote: (text: string, succesCallback?: () => void) => void;
  dPosts: Record<string, PostNode>;
  editedNoteId: string | null;
  replyForm: ReplyToForm | null;
  loader: boolean;
  users: User[];
  error: ErrorNotification | null;
  closeError: () => void;
  model: string;
  modelId: string;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  dUsers: Record<string, User>;
  setReplyForm: React.Dispatch<React.SetStateAction<ReplyToForm | null>>;
  setEditedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  updateNote: (id: string, text: string) => void;
  updateMessage: (id: string, text: string) => void;
  deletePost: (id: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  canManagePost: (userId: string) => boolean;
};
const PostContext = createContext<PostContexType>({} as PostContexType);
export const usePostContext = () => {
  return useContext(PostContext);
};

export const PostProvider = ({
  children,
  model,
  modelId,
  currentUser = null, //текущий пользователь
  hasAccess = () => false, //функция проверки роли пользователя
}: PostContextProps) => {
  const { content } = useLanguageNotes();
  const [posts, setPosts] = useState<Post[]>([]);
  const { treeNotes, dPosts } = useMemo(() => getNotesTree(posts), [posts]);
  const [replyForm, setReplyForm] = useState<ReplyToForm | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);
  // const dPosts = useMemo(
  //   () =>
  //     posts.reduce((acc: Record<string, Post>, cur) => {
  //       acc[cur.id] = cur;
  //       return acc;
  //     }, {}),
  //   [posts]
  // );
  const [editedNoteId, setEditedNoteId] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const [error, setError] = useState<ErrorNotification | null>(null);
  const dUsers: Record<string, User> = useMemo(() => {//преобразование массива юзеров в словарь
    const dictUsers = users.reduce((acc: Record<string, User>, cur) => {
      acc[cur?.id] = cur;
      return acc;
    }, {});
    if (currentUser) {
      dictUsers[currentUser?.id] = currentUser;
    }
    return dictUsers;
  }, [users, currentUser]);
 

  // const addPost = async (newPost: NewPost) => {
  // @todo: addPostRequest
  // const id = (parseInt("65d5b76c570e15c88e7475ab", 16) + Date.now()%10000000).toString(
  //   //уникальный идентификатор,
  //   //полученный из строки в шестнадцатеричной форме и текущего временного штампа в шестнадцатеричном виде
  //   16
  // );
  //   setPosts([
  //     ...posts,
  //     {
  //       id: Date.now().toString(),
  //       ...newPost,
  //       created_at: new Date().toISOString(),
  //       user_id: "65d5b76c570e15c88e7475ab",
  //     },
  //   ]);
  // };
  const canManagePost = (userId: string) => {
    //функция проверки может ли юзер управлять постами
    if (hasAccess("global_access_admin")) return true; //если админ то может управлять всеми постами

    if (currentUser?.id === userId) {
      //если юзер совпадает с текущим
      return true; //то он может управлять своими постами
    }
    return false; //если юзер не совпадает с текущим то он не может управлять своими постами
  };
  const closeError = () => {
    //для очистки ошибки
    setError(null);
  };
  const showError = (text: string = content.errorText) => {
    //для показа текста ошибки
    setError({ message: text, title: content.errorTitle }); //для показа ошибки
  };
  const addNote = async (text: string, succesCallback?: () => void) => {
    addPostRequest({
      is_deleted: false,
      model: model,
      model_id: modelId,
      reply_to: "",
      quote_to: "",
      mentions: [],
      text: text,
    }).then((post) => {
      if (!post?.id) {
        // alert("ошибка добавления поста");
        return;
      }
      setPosts([post, ...posts]);

      if (succesCallback) {
        succesCallback();
      }
    });
  };

  const addMessage = async (
    replyId: string,
    text: string,
    succesCallback?: () => void
  ) => {
    addPostRequest({
      is_deleted: false,
      model: model,
      model_id: modelId,
      reply_to: replyId,
      quote_to: "",
      mentions: [],
      text: text,
    }).then((post) => {
      if (!post?.id) {
        return;
      }
      setPosts([post, ...posts]);
      if (succesCallback) {
        succesCallback();
      }
    });
  };

  const updateNote = (id: string, text: string) => {
    //  @todo: updateNoteRequest
    updatePostRequest({
      ...dPosts[id], //все то что было в посте
      text,
    }).then((updatedPost) => {
      if (!updatedPost?.id) {
        return;
      }
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
    });
    // setPosts(posts.map((post) => (post.id === id ? { ...post, text } : post)));
    // setEditedNoteId(null);
  };
  const updateMessage = (id: string, text: string) => {
    updatePostRequest({
      ...dPosts[id],
      text,
    }).then((updatedPost) => {
      if (!updatedPost?.id) {
        return;
      }
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
    });
  };
  const deletePost = (id: string) => {
    //рекурсивно обойти всю ветку, которая удаляется и собрать все айдишники постов, которые нужно удалить
    const getIdsToDelete = (id: string) => {
      const recursTraverseBranch = (postNode: PostNode): string[] => {
        const ids = [postNode.id]; //изначально добавим id из ветки постов
        if (postNode.children) {
          for (const child of postNode.children) {
            ids.push(...recursTraverseBranch(child));
          }
        }
        return ids;
      };
      const post = dPosts[id]; //изначально добавим пост из дерева постов по id
      const arrayIdsForDelete: string[] = [id];
      if (post?.children) {
        for (const child of post.children) {
          arrayIdsForDelete.push(...recursTraverseBranch(child));
        }
      }
      return arrayIdsForDelete; //вернем массив айдишников
    };
    const idsToDelete = getIdsToDelete(id).filter((postId) => postId !== id); //получим массив айдишников, которые нужно удалить
    deletePostRequest(id).then((deletedPost) => {
      if (!deletedPost?.id) {
        return;
      }
      setPosts(posts.filter((post) => ![...idsToDelete, id].includes(post.id))); //удаление постов по айдишникам
      for (const isDelete of idsToDelete) {
        deletePostRequest(isDelete).then((deletedPost) => {
          // setPosts(posts.filter((post) => !idsToDelete.includes(post.id)));
        });
      }
    });
  };

  // useEffect(() => {
  //   getPostsRequest().then((data: PostData) => {
  //     // setTreeNotes(getNotesTree(data.items));
  //     setPosts(data.items);
  //       setUsers(data.items.map(item => item.user_annotated));
  // }, []);

  useEffect(() => {
    setReplyForm(null);
    setEditedNoteId(null);
    setSearchTerm("");
    getPostsRequest({
      model: model,
      model_id: modelId,
    }).then((data: PostData) => {
      if (!data?.items) {
        console.log("error");
        return;
      }
      setPosts(data.items);
      setUsers(data.items.map((item) => item.user_annotated));
    });
  }, [model, modelId]);

  useEffect(() => {
    const api = getApi(); // экземпляр класса Api, вызывая функцию getApi(), которая возвращает созданный ранее объект api для работы с API запросами
    api.callbacks.setLoader = (show?: boolean) => {
      setLoader(!!show);
    };
    api.callbacks.showError = showError;
  }, [content]);
  return (
    <PostContext.Provider
      value={{
        treeNotes,
        addNote,
        addMessage,
        users,
        setUsers,
        dUsers,
        dPosts,
        error,
        loader,
        replyForm,
        closeError,
        setReplyForm,
        editedNoteId,
        setEditedNoteId,
        updateNote,
        updateMessage,
        deletePost,
        searchTerm,
        setSearchTerm,
        model,
        modelId,
        canManagePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
