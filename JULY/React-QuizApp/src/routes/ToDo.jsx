import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/MainComponent.jsx";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export default function ToDoList() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  });
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    localStorage.setItem("todo_list", JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { text: input.trim(), done: false, createdAt: new Date().toISOString() }
    ]);
    setInput("");
  }

  function deleteTodo(idx) {
    const updated = [...todos];
    updated.splice(idx, 1);
    setTodos(updated);
  }

  function toggleDone(idx) {
    const updated = [...todos];
    updated[idx].done = !updated[idx].done;
    setTodos(updated);
  }

  function startEdit(idx) {
    setEditingIndex(idx);
    setEditValue(todos[idx].text);
  }

  function submitEdit(idx) {
    if (!editValue.trim()) return;
    const updated = [...todos];
    updated[idx].text = editValue.trim();
    setTodos(updated);
    setEditingIndex(null);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
  }

  return (
    <SidebarLayout>
      <main className="h-full pb-16 overflow-y-auto">
        <div className="container grid px-6 mx-auto">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            To-Do List
          </h2>
          <form onSubmit={addTodo} className="flex mb-6">
            <input
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Add a new task"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-r-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              type="submit"
            >
              Add
            </button>
          </form>
          <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      No tasks yet.
                    </td>
                  </tr>
                ) : (
                  todos.map((todo, idx) => (
                    <tr
                      key={idx}
                      className={`text-gray-700 dark:text-gray-200 ${todo.done ? "line-through opacity-60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        {editingIndex === idx ? (
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              submitEdit(idx);
                            }}
                            className="flex"
                          >
                            <input
                              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") submitEdit(idx);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                              type="submit"
                            >
                              Save
                            </button>
                            <button
                              className="ml-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                              type="button"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          todo.text
                        )}
                      </td>
                      <td className="px-4 py-3">{formatDate(todo.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          className={`px-3 py-1 rounded ${
                            todo.done
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                          onClick={() => toggleDone(idx)}
                        >
                          {todo.done ? "Done" : "Pending"}
                        </button>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => startEdit(idx)}
                          disabled={editingIndex === idx}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => deleteTodo(idx)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}