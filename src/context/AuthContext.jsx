
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,setUser] = useState(null);
  const [token,setToken] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    try{
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if(savedToken && savedUser && savedUser!=="undefined" && savedUser!=="" && savedUser!=="null"){
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }else{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }catch(err){
      console.error("Storage error → clearing:",err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  },[]);

  //login function
  const login = (jwt,userData)=> {
    if(!jwt || !userData) return;

    setToken(jwt);
    setUser(userData);

    localStorage.setItem("token",jwt);
    localStorage.setItem("user",JSON.stringify(userData));
  };

  //logout function
  const logout = ()=> {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  //all the values provided by the context
  const globalAuth = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return(
    <AuthContext.Provider value={globalAuth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
