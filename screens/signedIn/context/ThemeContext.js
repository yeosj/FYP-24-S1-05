import { useEffect, useState, createContext } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User is signed in");
        loadTheme(currentUser);
      } else {
        console.log("No user is signed in");
        setTheme("light"); // Reset theme when user logs out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  const loadTheme = async (currentUser) => {
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().theme) {
      setTheme(userSnap.data().theme);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { theme: newTheme }, { merge: true });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
