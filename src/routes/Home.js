import Ract, { useEffect } from "react";
import { useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";


const Home = ({ user }) => {
    const [nweets, setNweets] = useState([]);
    const currentUid = user.uid;

    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );
         onSnapshot(q, (snapshot) => {
             const nweetArr =  snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArr);
        });
    }, []);


    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(dbService, "nweets"), {
                uid: currentUid,
                text: nweet,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error(error);
        }
        setNweet('');
    }
    const [nweet, setNweet] = useState('');
    const onChangeNweet = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }
    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <input type="text" onChange={onChangeNweet} placeholder="What's on your mind" value={nweet} />
                    <input type="submit" value="Nweet" />
                </form>
            </div>

            {nweets.map((e) => {
                console.log(e);
                return(
                <div key={e.id}>
                    <h3 > {e.text} </h3>
                </div>)

            })}

        </>)

}
export default Home