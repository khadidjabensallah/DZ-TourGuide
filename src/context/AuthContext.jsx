import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  loginAsGuide: () => {},
  loginAsTourist: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load authUser", e);
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem("authUser", JSON.stringify(u));
    else localStorage.removeItem("authUser");
  };

  const loginAsGuide = (overrides = {}) => {
    const guide = {
      role: "guide",
      name: overrides.name || "Guide User",
      profileImage:
        overrides.profileImage ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    };
    persist(guide);
  };

  const loginAsTourist = (overrides = {}) => {
    const tourist = {
      role: "tourist",
      name: overrides.name || "Tourist User",
      profileImage:
        overrides.profileImage ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    };
    persist(tourist);
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider
      value={{ user, loginAsGuide, loginAsTourist, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
