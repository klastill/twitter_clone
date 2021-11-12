import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase"
import { useEffect } from "react";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) =>{
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "initializing..."}
    </>
  );
}

export default App;
