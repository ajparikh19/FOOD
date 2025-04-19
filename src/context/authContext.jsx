import React, { useState, useEffect, createContext, useContext } from "react";
import API from "../http/api";
import { toast } from "react-toastify";

const AuthContext = createContext({
  isLoggedIn: false,
  user:null,
  login: async (data) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {

  // const [authState, setAuthState] = useState({
  //   isLoggedIn: false,
  //   user:null,
  //   loading:true,
  // })
  
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("x-token-appointment") !== null
  );
  const [user, setUser] = useState(null);

  // Add token validation check
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("x-token-appointment");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }else{
        setIsLoggedIn(true);
      }

      // try {
      //   const response = await API.get("/auth/validate-token");
      //   if (response?.status === 200) {
      //     setIsLoggedIn(true);
      //   } else {
      //     handleLogout();
      //   }
      // } catch (error) {
      //   handleLogout();
      // }
    };

    validateToken();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("x-token-appointment");
    // localStorage.removeItem("email");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const logout = async () => {
    try {
      // Remove the leading slash from the endpoint
      const response = await API.post("auth/logout");
      console.log("Logout response:", response);
      
      if (response?.status === 200) {
        handleLogout();
      } else {
        toast.error(response?.message || "Something went wrong with logout");
        // Still logout even if the API call fails
        handleLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
      // Still logout even if there's an error
      handleLogout();
    }
  };
  
  

  const login = async(data) => {

    if (!data?.accessToken) {
      toast.error("Invalid login response");
      return;
    }
    
    try {
      localStorage.setItem("x-token-appointment", data?.accessToken);
      localStorage.setItem("email", data?.user?.email);

      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <AuthContext.Provider
    value={{ isLoggedIn, login, logout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
