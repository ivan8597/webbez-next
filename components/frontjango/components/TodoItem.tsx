import React, { useState } from 'react';
import { TodoProps } from './type';



const TodoItem = ({ todo, toggleComplete, deleteTodo, editTodo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo?.title || '');

  const handleEdit = () => {
    editTodo(todo.id, newText);
    setIsEditing(false);
  };

  return (
    <div>
      <input type="checkbox" 
      checked={todo?.completed}
      onChange={() => toggleComplete(todo.id)} />
      {isEditing ? ( 
        <>
          <input value={newText} onChange={(e) => setNewText(e.target.value)} />
          <button onClick={handleEdit}>Сохранить</button>
        </>
      ) : (
        <>
          {todo.title}
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        </>
      )}
      <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
    </div>
    
  );
};

export default TodoItem;
