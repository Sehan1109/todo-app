import { useState } from "react";
import type { Task } from "./components/Types";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import useUserTasks from "./components/useUserTasks";
import { auth, db } from "./components/Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { logout } from "./components/authService";

function getLocalDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDayLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Get all tasks of logged-in user
  const tasks = useUserTasks();

  // ✅ Show temporary message
  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // ✅ Save (Add or Update) Task
  const handleSaveTask = async (task: Task) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    try {
      if (task.id) {
        await updateDoc(doc(db, "tasks", task.id), {
          ...task,
          uid,
        });
        showMessage("✅ Task updated successfully", "success");
      } else {
        await addDoc(collection(db, "tasks"), {
          ...task,
          uid,
          completed: false,
          createdAt: new Date(),
        });
        showMessage("✅ Task added successfully", "success");
      }
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to save task", "error");
    }

    setEditingTask(undefined);
    setShowForm(false);
  };

  // ✅ Delete task
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      showMessage("🗑️ Task deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showMessage("❌ Failed to delete task", "error");
    }
  };

  // ✅ Toggle complete/done
  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      try {
        await updateDoc(doc(db, "tasks", id), {
          done: !task.done,
        });
        showMessage("✅ Task status updated", "success");
      } catch (err) {
        console.error(err);
        showMessage("❌ Failed to update status", "error");
      }
    }
  };

  // Only show tasks for selected date
  const filteredTasks = tasks.filter(
    (task) => task.date === getLocalDateString(selectedDate)
  );

  const getNextDays = () => {
    const days = [];
    for (let i = -1; i < 6; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const handleLogout = async () => {
    await logout();
    alert("Logged out");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-300 flex flex-col">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* HEADER */}
      <div className="px-6 pt-6 text-white items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl font-bold py-6">To-Do Application</h1>
          <h1 className="text-6xl font-medium py-10">
            {selectedDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </h1>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
        <div className="flex justify-between items-center py-6 px-10">
          <div>
            <h3>{getDayLabel(selectedDate)}</h3>
            <p className="text-sm opacity-80">{filteredTasks.length} Tasks</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowForm(true);
            }}
            className="bg-white text-purple-600 px-5 py-2 rounded-full shadow text-sm font-medium"
          >
            Add New
          </button>
        </div>
      </div>

      {/* DATE SELECTOR */}
      <div className="bg-white rounded-t-3xl mt-6 p-6 shadow-lg flex-1">
        <div className="mt-6 flex justify-center space-x-3 overflow-x-auto flex-row items-center">
          {getNextDays().map((day) => {
            const isActive =
              getLocalDateString(day) === getLocalDateString(selectedDate);
            return (
              <button
                key={day.toDateString()}
                onClick={() => setSelectedDate(new Date(day))}
                className={`flex flex-col items-center w-14 py-3 rounded-xl shadow-sm transition-all duration-200 ${
                  isActive
                    ? "bg-purple-800 text-white"
                    : "bg-gray-300 text-purple-700"
                }`}
              >
                <span className="text-xs">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold">{day.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* TASK LIST */}
        <h2 className="text-lg font-semibold mb-4 mt-6">My Tasks</h2>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No tasks for this date
          </p>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <TaskForm
              task={editingTask}
              onSave={handleSaveTask}
              onDelete={handleDelete}
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
