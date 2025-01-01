/* eslint-disable no-unused-vars */
import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignUp from "./pages/CaptainSignUp";
import Home from "./pages/home";
import UserProctectedWrapper from "./pages/UserProctectedWrapper";
import UserLogout from "./pages/userLogout";
import CaptainHome from "./pages/CaptainHome";
import Riding from "./pages/Riding";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignUp />} />
        <Route
          path="/home"
          element={
            <UserProctectedWrapper>
              <Home />
            </UserProctectedWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProctectedWrapper>
              <UserLogout />
            </UserProctectedWrapper>
          }
        />
        <Route path="/captain-home" element={<CaptainHome />} />

        <Route path="/riding" element={<Riding />} />
      </Routes>
    </div>
  );
};

export default App;
