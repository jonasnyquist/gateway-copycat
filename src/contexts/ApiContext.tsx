
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";

interface ApiContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  sessionId: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

interface LoginCredentials {
  username: string;
  password: string;
  domain?: string;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serverUrl, setServerUrl] = useState<string>(localStorage.getItem('serverUrl') || '');
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('sessionId'));
  
  const isAuthenticated = !!sessionId;

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    if (!serverUrl) {
      toast.error("Server URL is required");
      return false;
    }
    
    try {
      const response = await fetch(`${serverUrl}/web_api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          "enter-last-published-session": false
        }),
      });

      const data = await response.json();

      if (data.sid) {
        setSessionId(data.sid);
        localStorage.setItem('sessionId', data.sid);
        localStorage.setItem('serverUrl', serverUrl);
        toast.success("Login successful");
        return true;
      } else {
        toast.error(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Connection error. Please verify server URL and network connectivity.");
      return false;
    }
  };

  const logout = async () => {
    if (sessionId && serverUrl) {
      try {
        await fetch(`${serverUrl}/web_api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-chkp-sid': sessionId
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setSessionId(null);
    localStorage.removeItem('sessionId');
    toast.info("Logged out successfully");
  };

  return (
    <ApiContext.Provider
      value={{
        serverUrl,
        setServerUrl,
        sessionId,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
