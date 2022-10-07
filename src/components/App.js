import React, { useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  console.log(authService.currentUser);
  const [isLoggIn, setIsLoggedIn] = useState(authService.currentUser);
  return <AppRouter isLoggIn = {isLoggIn}/>;
}

export default App;