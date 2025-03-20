import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const apiIp = process.env.REACT_APP_API_IP;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (location && location.pathname != "/login") navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`http://${apiIp}/user/basic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Set user data if token is valid
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          if (location.pathname != "login") navigate("/login");
        } else {
          console.error("Error fetching user data", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
