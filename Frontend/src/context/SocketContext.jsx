/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { createContext, useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [error, setError] = useState(null);
  
  // Get token from localStorage if AuthContext is not available
  const authContext = useContext(AuthContext);
  const token = authContext?.token || localStorage.getItem('token');
  const isAuthenticated = authContext?.isAuthenticated || !!localStorage.getItem('token');

  useEffect(() => {
    let retryTimeout;

    const initSocket = () => {
      // Don't try to connect if not authenticated
      if (!token) {
        console.log('No token available, skipping socket connection');
        return;
      }

      if (connectionAttempts >= MAX_RETRIES) {
        setError('Max connection attempts reached');
        return;
      }

      try {
        const newSocket = io(SOCKET_URL, {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocket(newSocket);
          setIsInitialized(true);
          setError(null);
          setConnectionAttempts(0);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setError(error.message);
          setConnectionAttempts(prev => prev + 1);

          // Clean up the failed socket
          newSocket.close();
          
          // Retry connection after delay
          retryTimeout = setTimeout(() => {
            initSocket();
          }, RETRY_DELAY);
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsInitialized(false);
        });

        return () => {
          newSocket.close();
        };
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError(err.message);
        setConnectionAttempts(prev => prev + 1);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [token, connectionAttempts]);

  return (
    <SocketContext.Provider value={{ socket, isInitialized, error }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;