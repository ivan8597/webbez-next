import React, { useState } from "react";

import { Todo } from "./type";
import TodoItem from "./TodoItem";
import { TodoProvider, useTodo } from "./context/pageContext";
import User from "./User";

const Items = () => {
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState(1);
  const {
    
    todos,
 
    addTodo,
    toggleComplete,
    deleteTodo,
    editTodo,
    
  } = useTodo();
  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={()=>{addTodo(inputValue,userId)
      setInputValue("")
      setUserId(userId+1)
    }
      }>Добавить</button>
      {todos?.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </div>
  );
};
const Page = () => {
  return (
    <TodoProvider>
      <Items />
   <User/>
    </TodoProvider>
  );
};

export default Page;
