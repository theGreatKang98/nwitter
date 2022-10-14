import { useEffect } from "react";
import { useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";



const Home = ({ user }) => {
    const [nweets, setNweets] = useState([]);
    const [nweet, setNweet] = useState('');
    const [attachment, setAttachment] = useState('');

    const clearAttachment = () => setAttachment(null)

    const onUploadAttachment = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { target: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentURL = '';
        setNweet('');
        clearAttachment();
        if (attachment) {
            const fileRef = ref(storageService, `${user.uid}/${uuidv4()}`);
            const response = await uploadString(fileRef, attachment, "data_url");
            await getDownloadURL(response.ref).then((url) => {
                attachmentURL = url;
            })
        }
        try {
            await addDoc(collection(dbService, "nweets"), {
                uid: user.uid,
                text: nweet,
                attachmentURL,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error(error);
        }
    }
   

    const onChangeNweet = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }


    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArr);
        });
    }, []);

    return (
        <>
            <div className="App">
                <form onSubmit={onSubmit}>
                    <input className="btn" type="text" onChange={onChangeNweet} placeholder="What's on your mind" value={nweet} required/>
                    <input type="file" accept="image/*" onChange={onUploadAttachment} />
                    <input type="submit" value="Nweet" />
                </form>
                {attachment &&
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <input type="button" value="clear img" onClick={clearAttachment} />
                    </div>}
            </div>

            {nweets.map((nweetInfo) => (
                <Nweet key={nweetInfo.id} user={user} nweetInfo={nweetInfo} />)
            )}

        </>)

}
export default Home