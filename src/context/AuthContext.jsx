import React, { useState } from "react";
import { AuthContext } from "./AuthContextValue";

const DEMO_USERS = [
  { email: "student@gmail.com", password: "123", role: "student" },
  { email: "faculty1@gmail.com", password: "123", role: "faculty" },
];

const seedDemoUsers = () => {
  if (typeof window === "undefined") return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const mergedUsers = [...users];

  DEMO_USERS.forEach((demoUser) => {
    const exists = mergedUsers.some((user) => user.email === demoUser.email);
    if (!exists) {
      mergedUsers.push(demoUser);
    }
  });

  if (mergedUsers.length !== users.length) {
    localStorage.setItem("users", JSON.stringify(mergedUsers));
  }
};

seedDemoUsers();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

const login = (role, email, name = "", registerNo = "") => {
  const userData = { role, email, name, registerNo };
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};