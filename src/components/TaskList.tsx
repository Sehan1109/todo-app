import { type Task } from "./Types";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
};

const TaskList: React.FC<Props> = ({
  tasks,
  onDelete,
  onToggleComplete,
  onEdit,
}) => (
  <div className="p-4">
    {tasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
      />
    ))}
  </div>
);

export default TaskList;
