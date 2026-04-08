import { useState } from "react";
// Import our custom CSS
import "/styles.scss";
// Import all of Bootstrap’s JS
// import * as bootstrap from "bootstrap";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, task: "Complete Excel Certification", completed: false },
    { id: 2, task: "Organize Community service work", completed: false },
    { id: 3, task: "Pre-order GTA6", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const [page, setPage] = useState("home");

  function markComplete(id) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo,
    );
    setTodos(updatedTodos);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (newTask.trim() === "") {
      return;
    }

    const newTodo = {
      id: Date.now(),
      task: newTask,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
  }

  return (
    <div>
      <h1>Schneider's To-Do List</h1>

      <nav className="navbar navbar-expand-lg navbar-dark bg-light px-3">
        <span className="navbar-brand">To-Do App</span>

        <div className="ms-auto">
          <button
            className="btn btn-outline-light me-2"
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            className="btn btn-outline-light"
            onClick={() => setPage("about")}
          >
            About
          </button>
        </div>
      </nav>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              marginBottom: "10px",
            }}
          >
            {todo.task} <button onClick={() => markComplete(todo.id)}>X</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default App;
