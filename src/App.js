import React, { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [CompletedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null); // Holds index of the current item being edited
  const [currentEditedItem, setCurrentEditedItem] = useState({ title: '', description: '' }); // Stores the edited item

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    setNewTitle("");
    setNewDescription("");
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1); // Fix the splice logic
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1; 
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    };

    let updatedCompletedArr = [...CompletedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  useEffect(() => {
    const savedTodo = localStorage.getItem('todolist');
    const savedCompleteTodo = localStorage.getItem('completedTodos');

    if (savedTodo) {
      try {
        const parsedTodos = JSON.parse(savedTodo);
        if (Array.isArray(parsedTodos)) setTodos(parsedTodos);
      } catch (error) {
        console.error("Error parsing todos:", error);
      }
    }

    if (savedCompleteTodo) {
      try {
        const parsedCompletedTodos = JSON.parse(savedCompleteTodo);
        if (Array.isArray(parsedCompletedTodos)) setCompletedTodos(parsedCompletedTodos);
      } catch (error) {
        console.error("Error parsing completed todos:", error);
      }
    }
  }, []);

  const handleEdit = (index) => {
    setCurrentEdit(index); // Set the index for editing
    setCurrentEditedItem(allTodos[index]); // Pre-fill the input fields with the existing values
  };

  const handleUpdatedTitle = (value) => {
    setCurrentEditedItem({ ...currentEditedItem, title: value });
  };

  const handleUpdatedDescription = (value) => {
    setCurrentEditedItem({ ...currentEditedItem, description: value });
  };

  const handleSaveEdit = (index) => {
    const updatedTodos = [...allTodos];
    updatedTodos[index] = currentEditedItem; // Replace the old item with the updated one
    setTodos(updatedTodos);
    setCurrentEdit(null); // Exit edit mode
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
  };

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              placeholder="What's the task title"
            />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input 
              type="text" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              placeholder="What's the task description"
            />
          </div>
          <div className='todo-input-item'>
            <button type="button" onClick={handleAddTodo} className='primaryBtn'>
              Add
            </button>
          </div>
        </div>
        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>
        <div className='todo-list'>
          {isCompleteScreen === false && allTodos.map((item, index) => {
            if (currentEdit === index) {
              return (
                <div className='edit_wrapper' key={index}>
                  <input  className='Edit_title'
                    placeholder='Updated Title' 
                    onChange={(e) => handleUpdatedTitle(e.target.value)}  
                    value={currentEditedItem.title} 
                  />
                  <textarea  className='Edit_decription'
                    placeholder='Updated Description' 
                    onChange={(e) => handleUpdatedDescription(e.target.value)}  
                    value={currentEditedItem.description} 
                  />
                  <button onClick={() => handleSaveEdit(index)} className='primaryBtn'>
                    Save
                  </button>
                </div>
              );
            } else {
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <AiOutlineDelete className='icon' onClick={() => handleDeleteTodo(index)} title='Delete?' />
                    <FaCheck className='check-icon' onClick={() => handleComplete(index)} title='Complete' />
                    <AiOutlineEdit className='check-icon' onClick={() => handleEdit(index)} title='Edit?' />
                  </div>
                </div>
              );
            }
          })}

          {isCompleteScreen === true && CompletedTodos.map((item, index) => {
            return (
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed On: {item.completedOn}</small></p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteTodo(index)} title='Delete?' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
