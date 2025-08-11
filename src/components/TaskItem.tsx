import type { Task } from "./Types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (id: string) => void;
};

const TaskItem: React.FC<Props> = ({ task, onEdit, onToggleComplete }) => {
  return (
    <div
      className={`flex items-center bg-purple-200 px-4 py-3 rounded-xl mb-3 shadow-sm cursor-pointer transition-colors duration-200 hover:bg-purple-400`}
      onClick={() => onEdit(task)}
    >
      {/* Time */}
      <div className="w-16 text-sm font-medium text-gray-700">
        {task.time || "--:--"}
      </div>

      {/* Title & Description */}
      <div className="flex-1 text-center">
        <p
          className={`font-semibold truncate ${
            task.done ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {task.title}
        </p>
        <p className="text-xs text-gray-600 truncate">{task.description}</p>
      </div>

      {/* Checkbox to mark done */}
      <input
        type="checkbox"
        checked={task.done || false}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggleComplete(task.id)}
        className="ml-4 w-5 h-5 cursor-pointer"
      />
    </div>
  );
};

export default TaskItem;
