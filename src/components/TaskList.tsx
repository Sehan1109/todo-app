import { type Task } from "./Types";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
};

const TaskItem: React.FC<Props> = ({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <span>{task.title}</span>
      <div className="flex gap-2">
        <button onClick={() => onToggleComplete(task.id!)}>Toggle</button>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id!)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;
