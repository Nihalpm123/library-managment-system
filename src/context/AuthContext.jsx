import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    // MOCK LOGIN FOR TESTING WITHOUT FIREBASE
    if (email === "admin@admin.com" && password === "admin123") {
      setCurrentUser({ email: "admin@admin.com", uid: "mock-admin-id" });
      return Promise.resolve();
    }
    
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // If Firebase fails but they used the mock credentials, let them in anyway
      if (email === "admin@admin.com" && password === "admin123") {
        setCurrentUser({ email: "admin@admin.com", uid: "mock-admin-id" });
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
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!currentUser || currentUser.uid !== "mock-admin-id") {
          setCurrentUser(user);
        }
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      // Catch errors if Firebase is not configured properly
      console.error("Firebase auth error (likely missing config):", error);
      setLoading(false);
    }
  }, []);

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
