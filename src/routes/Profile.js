import Ract, { useEffect, useState } from "react";
import { dbService, getAuth } from "fbase"
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({ user, refreshUserObj}) => {
    const navigate = useNavigate();
    const onSignOutClick = () => {
        getAuth().signOut()
        navigate('/');
    };


    const [newDisplayName, SetNewDisplayName] = useState(user.displayName ?? '');

    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc"),
            where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    const onChangeNewDisplayName = (event) => {
        const { target: { value } } = event;
        SetNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (user.displayName !== newDisplayName) {
            await updateProfile(getAuth().currentUser, {
                displayName: newDisplayName,
            });
            refreshUserObj();
        }
    }

    useEffect(() => {
        getMyNweets()
    },[])

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder={newDisplayName} onChange={onChangeNewDisplayName} value={newDisplayName} />
                <input type="submit" value="submit" />
            </form>
            <button onClick={onSignOutClick}>Sign Out</button>
        </>

    )
}

export default Profile
