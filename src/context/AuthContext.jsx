import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // If Firebase fails (e.g. not configured, offline, or mock testing), but they used the mock credentials, let them in anyway
      if (email === "salafilibrary@gmail.com" && password === "karimbil") {
        console.warn("Using fallback mock admin credentials.");
        setCurrentUser({ email: "salafilibrary@gmail.com", uid: "mock-admin-id" });
        return Promise.resolve();
      }
      throw error;
    }
  };

  const logout = () => {
    // MOCK LOGOUT
    if (currentUser?.uid === "mock-admin-id") {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!currentUser || currentUser.uid !== "mock-admin-id") {
          setCurrentUser(user);
        }
        setLoading(false);
      });
    } catch (error) {
      // Catch errors if Firebase is not configured properly
      console.error("Firebase auth error (likely missing config):", error);
      Promise.resolve().then(() => {
        setLoading(false);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
