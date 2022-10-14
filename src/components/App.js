import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth } from "fbase";


function App() {

  const [userObj, setUserObj] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        })
      } else {
        setUserObj(null);
      }
      setInit(true);
    })
  }, [])
  const refreshUserObj =  ()=>{
    let userObjCopy = {...userObj};
    userObjCopy.displayName = getAuth().currentUser.displayName;
    setUserObj(userObjCopy);
  }

  return (
    <>
      {init ? <AppRouter isSignedIn={Boolean(userObj)} user={userObj} refreshUserObj={refreshUserObj}/> : "Initializing..."}
    </>
  );
}


export default App;