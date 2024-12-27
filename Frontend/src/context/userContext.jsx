/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createContext } from "react";

export const UserDataContext = createContext();

const userContext = ({ children }) => {

const [user, setUser] = useState({
    email:'',
    fullName:{
        firstName:'',
        lastName:''
    }
})

  return (
    <div>
      <UserDataContext.Provider value={{user, setUser}}>{children}</UserDataContext.Provider>
    </div>
  );
};

export default userContext;
