'use client';

import { useState, useEffect } from 'react';

// Interfaces para TypeScript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  // Estado para la lista de tareas
  const [todos, setTodos] = useState<Todo[]>([]);
  // Estado para el input de nueva tarea
  const [inputValue, setInputValue] = useState('');
  // Estado para el filtro actual
  const [filter, setFilter] = useState<FilterType>('all');
  // Estado para saber si el componente ya se montó (para evitar mismatch de hidratación)
  const [isMounted, setIsMounted] = useState(false);

  // Efecto para cargar tareas de localStorage al inicio
  // Solo se ejecuta en el cliente después de que el componente se monta
  useEffect(() => {
    setIsMounted(true);
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error al parsear todos:', error);
      }
    }
  }, []);

  // Efecto para guardar tareas en localStorage cada vez que cambian
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  // Manejador para añadir una nueva tarea
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(), // Genera un ID único
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue(''); // Limpiar el input
  };

  // Manejador para alternar el estado de completado
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Manejador para eliminar una tarea
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filtrar las tareas según el estado actual del filtro
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Evitar renderizar contenido que dependa de localStorage en el servidor
  if (!isMounted) {
    return null; // O un esqueleto de carga
  }

  return (
    <main className="todo-container">
      <header className="todo-header">
        <h1>Focus Tasks</h1>
        <p>Organiza tu día con estilo y simplicidad.</p>
      </header>

      {/* Formulario para añadir tareas */}
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="¿Qué necesitas hacer hoy?"
          className="todo-input"
          aria-label="Nueva tarea"
        />
        <button type="submit" className="btn-primary">
          Añadir
        </button>
      </form>

      {/* Botones de filtrado */}
      <div className="todo-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Activas
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completadas
        </button>
      </div>

      {/* Lista de tareas */}
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
                  aria-label={`Marcar como completada: ${todo.text}`}
                />
                <span className="todo-text">{todo.text}</span>
              </label>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="btn-delete"
                aria-label={`Eliminar: ${todo.text}`}
                title="Eliminar tarea"
              >
                {/* SVG inline para el icono de borrar */}
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
          No hay tareas en esta vista. ¡Disfruta tu tiempo!
        </div>
      )}
    </main>
  );
}
