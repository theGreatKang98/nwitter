import React from "react"
import { Link } from "react-router-dom";


const Navigation = ({user}) => {  
    return(
    <>
        <nav className="navbar navbar-expand">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item btn"> <Link to="/">Home</Link></li>
                <li className="nav-item btn"> <Link to="/profile">{user.displayName}'s Profile</Link></li>
            </ul>
        </nav>
    </>)
}

export default Navigation;