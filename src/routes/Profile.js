import Ract, { useEffect, useState } from "react";
import { dbService, getAuth } from "fbase"
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Nweet from "components/Nweet";

const Profile = ({ user, refreshUserObj }) => {
    const navigate = useNavigate();
    const onSignOutClick = () => {
        getAuth().signOut()
        navigate('/');
    };

    const [currentUserNweets, setCurrentUserNweets] = useState([]);
    const [newDisplayName, SetNewDisplayName] = useState(user.displayName ?? '');

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

    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc"),
            where('uid', '==', user.uid)
        );
        // const querySnapshot = await getDocs(q);
        // console.log(querySnap)
        // querySnapshot.forEach((doc) => {
        //     setCurrentUserNweets((prev) => {
        //         prev.push(doc.data());
        //         return prev;
        //     });
        // });

        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                //id: doc.id,
                ...doc.data(),
            }));
            setCurrentUserNweets(nweetArr);
        });
    }

    useEffect(() => {
        getMyNweets();
    }, [])

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="input-group w-50 mx-auto">
                    <input className="form-control" type="text" placeholder={user.displayName} onChange={onChangeNewDisplayName} value={newDisplayName} />
                    <input className="btn btn-primary" type="submit" value="submit" />
                </div>
            </form>
            <button className="btn btn-danger mx-auto d-block" onClick={onSignOutClick}>Sign Out</button>
            {currentUserNweets.map((nweet, index) => (
                <Nweet key={index} user={user} nweetInfo={nweet} />
            ))}
        </>

    )
}

export default Profile
