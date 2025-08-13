import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./components/Firebase";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Home from "./Home";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return user ? <Home /> : <LoginForm />;
}

export default App;
