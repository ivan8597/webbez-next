import axios from "axios";

// const apiUrl = "http://127.0.0.1:8000/api/server";
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

const addTodo = async () => {
  if (inputValue) {
    const newTodo = {
      text: inputValue,
      completed: false,
    };

    try {
      const response = await axios.post('/api/tasks/', newTodo);
      setTodos([...todos, response.data]);
      setInputValue("");
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  }
};

const toggleComplete = async (id) => {
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  try {
    await axios.put(/api/tasks/${id}/, { completed: updatedTodos.find(todo => todo.id === id).completed });
    setTodos(updatedTodos);
  } catch (error) {
    console.error('Ошибка при изменении статуса задачи:', error);
  }
};

const deleteTodo = async (id) => {
  try {
    await axios.delete(/api/tasks/${id}/);
    setTodos(todos.filter(todo => todo.id !== id));
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
  }
};

const editTodo = async (id, newText) => {
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, text: newText } : todo
  );

  try {
    await axios.put(/api/tasks/${id}/, { text: newText });
    setTodos(updatedTodos);
  } catch (error) {
    console.error('Ошибка при редактировании задачи:', error);
  }
};



export { 
  getTodos, 
  addTodo, 
  toggleComplete,
  deleteTodo,
  editTodo };