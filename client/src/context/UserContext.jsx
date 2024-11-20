// contexts/UserContext.js
import { createContext, useState, useEffect } from "react";
import { getSession } from "../api/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getSession();
        setUser(res.user || null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoad(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, load }}>
      {children}
    </UserContext.Provider>
  );
};
