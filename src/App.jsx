import { useEffect, useState } from "react";
import { Ban, Bomb, Trash } from "lucide-react";
import { Trash2 } from "lucide-react";
function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [filter, setFilter] = useState("Tous");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedTodosRaw = localStorage.getItem("todos");
    if (savedTodosRaw) {
      try {
        const savedTodos = JSON.parse(savedTodosRaw);
        if (Array.isArray(savedTodos)) {
          setTodos(savedTodos);
        }
      } catch (e) {
        console.error("Erreur JSON.parse localStorage : ", e);
      }
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, loading]);

  function addTodo() {
    const textEnter = input.trim();
    if (textEnter === "") return;
    setTodos([
      ...todos,
      { id: Date.now(), text: textEnter, priority, completed: false },
    ]);
    setInput("");
  }
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteSelected() {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) =>
    filter === "Tous" ? true : todo.priority === filter
  );
  const counterUrgenteValue = todos.filter(
    (todo) => todo.priority === "Urgente"
  ).length;
  const counterMoyenneValue = todos.filter(
    (todo) => todo.priority === "Moyenne"
  ).length;
  const counterBasseValue = todos.filter(
    (todo) => todo.priority === "Basse"
  ).length;

  return (
    <div className="flex flex-col justify-center  gap-4 w-2/3 mx-auto">
      <div className="flex flex-row gap-2 justify-between w-full mx-auto mt-10">
        <input
          type="text"
          className="w-1/2 input"
          placeholder="Allez s'entrainer"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <select
          className="select select-neutral"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
          }}
        >
          <option value="Moyenne">Moyenne</option>
          <option value="Urgente">Urgente</option>
          <option value="Basse">Basse</option>
        </select>
        <button className="w-1/4 btn btn-info" onClick={addTodo}>
          Ajouter
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="filter">
          <input
            className="btn filter-reset"
            type="radio"
            name="metaframeworks"
            aria-label="Tous"
            checked={filter === "Tous"}
            onChange={() => setFilter("Tous")}
          />
          <input
            className="btn"
            type="radio"
            name="metaframeworks"
            aria-label={`Moyenne(${counterMoyenneValue})`}
            checked={filter === "Moyenne"}
            onChange={() => {
              setFilter("Moyenne");
            }}
          />
          <input
            className="btn"
            type="radio"
            name="metaframeworks"
            aria-label={`Urgente(${counterUrgenteValue})`}
            checked={filter === "Urgente"}
            onChange={() => setFilter("Urgente")}
          />
          <input
            className="btn"
            type="radio"
            name="metaframeworks"
            aria-label={`Basse(${counterBasseValue})`}
            checked={filter === "Basse"}
            onChange={() => setFilter("Basse")}
          />
        </div>
        <button className="btn btn-soft btn-primary" onClick={deleteSelected}>
          Effacer la selection
        </button>
      </div>
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center mt-10 opacity-70">
          <Ban size={80} color="#00a9e7" className="mb-1" />
          <div className="font-bold">Aucun tâche trouvé pour "{filter}"</div>
        </div>
      ) : (
        <ul className="menu flex flex-col-reverse gap-6 text-sm w-full">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox checkbox-sm checkbox-neutral"
                />
                <li>{todo.text}</li>
                <div
                  className={`badge badge-outline ${
                    todo.priority === "Urgente"
                      ? "badge-primary"
                      : todo.priority === "Moyenne"
                      ? "badge-accent"
                      : "badge-success"
                  }`}
                >
                  {todo.priority}
                </div>
              </div>
              <Trash2
                size={32}
                color="#ff0000"
                className="border-2 border-red-400 p-1 rounded-sm cursor-pointer"
                onClick={() => deleteTodo(todo.id)}
              />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
