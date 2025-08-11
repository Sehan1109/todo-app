import React, { useState, useEffect } from "react";
import { type Task } from "./Types";

type Props = {
  task?: Task; // If present, form is in edit mode
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void; // Optional delete
};

const TaskForm: React.FC<Props> = ({ task, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Idea");
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [time, setTime] = useState("09:00");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setTaskDate(task.date);
      setTime(task.time || "09:00");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...(task ? { id: task.id } : {}),
      title,
      description,
      category,
      date: taskDate,
      time,
      completed: task ? task.completed : false,
      done: task?.done || false,
    };
    onSave(updatedTask);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 bg-white rounded-2xl shadow-lg border border-purple-200 max-w-md mx-auto"
    >
      <h2 className="text-lg font-bold text-purple-700">
        {task ? "Edit Task" : "Add New Task"}
      </h2>

      <input
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 transition"
        value={taskDate}
        onChange={(e) => setTaskDate(e.target.value)}
      />

      <input
        type="time"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 transition"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <select
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Idea</option>
        <option>Work</option>
        <option>Food</option>
        <option>Sport</option>
        <option>Music</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition"
        >
          {task ? "Update Task" : "Add Task"}
        </button>

        {/* Delete Button Only in Edit Mode */}
        {task && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id!)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
