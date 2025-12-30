import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  loginAsGuide: () => { },
  loginAsTourist: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load user from sessionStorage", e);
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) {
      sessionStorage.setItem("user", JSON.stringify(u));
      sessionStorage.setItem("is_authenticated", "true");
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("is_authenticated");
    }
  };

  const loginAsGuide = (overrides = {}) => {
    const guide = {
      user_type: "guide",
      user_id: 10, // Mock ID for testing if none provided
      email: overrides.email || "guide@example.com",
      firstname: overrides.firstname || "Guide",
      lastname: overrides.lastname || "User",
      profileImage: overrides.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      ...overrides
    };
    persist(guide);
  };

  const loginAsTourist = (overrides = {}) => {
    const tourist = {
      user_type: "tourist",
      user_id: 11, // Mock ID for testing
      email: overrides.email || "tourist@example.com",
      firstname: overrides.firstname || "Tourist",
      lastname: overrides.lastname || "User",
      profileImage: overrides.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      ...overrides
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
