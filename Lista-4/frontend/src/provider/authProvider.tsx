import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Define the type for the context
interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    // Set axios defaults and local storage only when token or refreshToken changes
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [token, refreshToken]);

  const refresh = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh_token`,
        { refreshToken }
      );
      console.log(response.data);
      setToken(response.data.idToken.jwtToken);
      setRefreshToken(response.data.refreshToken.token);
    } catch {
      setToken(null);
      setRefreshToken(null);
    }
  };

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      refreshToken,
      setRefreshToken,
    }),
    [token, refreshToken]
  );

  //add axios interceptor to refresh token
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        if (refreshToken !== null) {
          await refresh();
          return axios.request(error.config);
        }
      }
      return Promise.reject(error);
    }
  );

  if (!contextValue)
    throw new Error("useAuth must be used within an AuthProvider");

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
