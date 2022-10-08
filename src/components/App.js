import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth } from "fbase";

function App() {
  const auth = getAuth().currentUser;

  const [init, setInit] = useState(false);
  const [isLoggIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  return (
    <>
      {init ? <AppRouter isLoggIn={isLoggIn} /> : "Initializing..."}
    </>
  );
}


export default App;