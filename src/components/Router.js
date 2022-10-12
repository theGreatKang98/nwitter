import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom/";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ user, isSignedIn, refreshUserObj }) => {
    return (
        <Router>
            {user && <Navigation user={user}  />}
            <Routes>
                {isSignedIn ? (
                    <>
                        <Route exact path="/" element={<Home user={user} />}>
                            {/* <Home/> */}
                        </Route>
                        <Route exact path="/profile" element={<Profile user={user} refreshUserObj={refreshUserObj}/>}>
                            {/* <Home/> */}
                        </Route>
                    </>)
                    :
                    (<Route exact path="/" element={<Auth />}>
                        {/* <Auth /> */}
                    </Route>)}
            </Routes>
        </Router>
    )
}

export default AppRouter;