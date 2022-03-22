import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./Container/Home";
import Login from "./Components/Login";
import { fetchuser } from "./utility/fetchUser";
const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchuser();
    if (!user) navigate("/login");
  }, []);

  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
