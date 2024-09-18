import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    console.log({ email, password });
    if (email === "prince@gmail.com" && password === "123") {
      Cookies.set("refreshToken", "6504caccf7b90f000d44e4b9");
      setUser("token");
      history.push("/");
    } else if (email === "piyu@gmail.com" && password === "123") {
      Cookies.remove("refreshToken");
      Cookies.set("refreshToken", "6504caccf7b90f000d44e4ba");
      setUser("token");
      history.push("/");
    }
  };

  const logout = () => {
    Cookies.remove("refreshToken");
    setUser(null);
    history.push("/auth/login");
  };

  useEffect(() => {
    setUser(Cookies.get("refreshToken"));
  }, [history]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
