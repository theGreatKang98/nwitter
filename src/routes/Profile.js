import Ract from "react";
import { getAuth } from "fbase"
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    const onSignOutClick = ()=> {
        getAuth().signOut()
        navigate('/');
    };
    return (
        <>
            <span>Profile</span>
            <button onClick={onSignOutClick}>Sign Out</button>
        </>

    )
}
