import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth } from "fbase";

function App() {
  //let userInfo ;
  let userInfo = getAuth().currentUser;
  const [init, setInit] = useState(false);
  const [isLoggIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        userInfo = user;
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  return (
    <>
      {init ? <AppRouter isLoggIn={isLoggIn} user={userInfo}/> : "Initializing..."}
    </>
  );
}


export default App;