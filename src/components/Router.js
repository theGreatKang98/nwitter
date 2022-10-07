import React, { useState } from "react";
import { HashRouter as Router, Router, Switch } from "react-router-dom/";

export default()=> {
    const [isLoggIn, setIsLoggedIn] = useState(false);
    return(
        <Router>
            <Switch>
                {isLoggIn ? show home : show login page}
            </Switch>
        </Router>
    )
}