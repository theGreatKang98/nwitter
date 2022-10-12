import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth } from "fbase";

function App() {
  //let userInfo ;
  let currentUserInfo = getAuth().currentUser;
  const [init, setInit] = useState(false);
  const [isLoggIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        currentUserInfo = user;
        setIsLoggedIn(true);
      } 
      setInit(true);
    })
  }, [])

  return (
    <>
      {init ? <AppRouter isLoggIn={isLoggIn} user={currentUserInfo}/> : "Initializing..."}
    </>
  );
}


export default App;