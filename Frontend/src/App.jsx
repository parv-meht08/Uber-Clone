import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptionSignUp from "./pages/CaptionSignUp";
import CaptionLogin from "./pages/CaptionLogin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/caption-login" element={<CaptionLogin />} />
        <Route path="/caption-signup" element={<CaptionSignUp />} />
      </Routes>
    </div>
  );
};

export default App;
