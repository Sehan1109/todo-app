import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "./Firebase";
import type { Task } from "./Types";

const useUserTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setTasks([]);
      return;
    }

    // ✅ Only get tasks for logged-in user
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]); // Re-run when user changes

  return tasks;
};

export default useUserTasks;
