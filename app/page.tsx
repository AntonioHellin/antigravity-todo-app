'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isMounted, setIsMounted] = useState(false);

  // Restore saved todos from localStorage upon client mount
  useEffect(() => {
    setIsMounted(true);
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        if (Array.isArray(parsed)) {
          setTodos(parsed.filter(item => item && typeof item.id === 'string' && typeof item.text === 'string'));
        }
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  // Synchronize todos to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (!isMounted) {
    return null;
  }

  return (
    <main className="todo-container">
      <header className="todo-header">
        <h1>Focus Tasks</h1>
        <p>Organize your day with focus, style, and simplicity.</p>
      </header>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What do you need to accomplish today?"
          className="todo-input"
          aria-label="New task"
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="todo-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      {filteredTodos.length > 0 ? (
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                  aria-label={`Mark as completed: ${todo.text}`}
                />
                <span className="todo-text">{todo.text}</span>
              </label>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="btn-delete"
                aria-label={`Delete task: ${todo.text}`}
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          No tasks found in this view. Enjoy your day!
        </div>
      )}
    </main>
  );
}
