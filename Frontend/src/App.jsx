import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from './context/AuthContext';
import SocketProvider from './context/SocketContext';
import CaptainDataProvider from "./context/CaptainContext";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/CaptainSignUp";
import Home from "./pages/Home";
import CaptainHome from "./pages/CaptainHome";
import CaptainProfile from "./pages/CaptainProfile";
import UserLogout from "./pages/UserLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import { UserProtectedWrapper } from "./pages/UserProctectedWrapper";

const App = () => {
  return (
    <AuthProvider>

      <SocketProvider>
        <CaptainDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignUp />} />
              <Route path="/captain-login" element={<CaptainLogin />} />
              <Route path="/captain-signup" element={<CaptainSignUp />} />
              <Route
                path="/home"
                element={
                  <UserProtectedWrapper>
                    <Home />
                  </UserProtectedWrapper>
                }
              />
              <Route
                path="/user/logout"
                element={
                  <UserProtectedWrapper>
                    <UserLogout />
                  </UserProtectedWrapper>
                }
              />
              <Route path="/captain-home" element={<CaptainHome />} />
              <Route path="/captain/profile" element={<CaptainProfile />} />
              <Route path="/riding" element={<Riding />} />
              <Route path="/captain-riding" element={<CaptainRiding />} />
            </Routes>
          </BrowserRouter>
        </CaptainDataProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
