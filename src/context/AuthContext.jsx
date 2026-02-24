import React, { useState } from "react";
import { AuthContext } from "./AuthContextValue";
import { DEMO_USERS } from "./demoUsers";

const seedDemoUsers = () => {
  if (typeof window === "undefined") return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const mergedUsers = [...users];
  let hasChanges = false;

  DEMO_USERS.forEach((demoUser) => {
    const existingIndex = mergedUsers.findIndex((user) => user.email === demoUser.email);
    if (existingIndex === -1) {
      mergedUsers.push(demoUser);
      hasChanges = true;
      return;
    }

    const existingUser = mergedUsers[existingIndex];
    const needsCredentialUpdate =
      existingUser.password !== demoUser.password ||
      existingUser.role !== demoUser.role;

    if (needsCredentialUpdate) {
      mergedUsers[existingIndex] = {
        ...existingUser,
        password: demoUser.password,
        role: demoUser.role,
      };
      hasChanges = true;
    }
  });

  if (hasChanges) {
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