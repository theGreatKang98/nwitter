import { useEffect, useRef } from "react";
import { useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection, orderBy, onSnapshot, query } from "firebase/firestore";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import "style.css"


const Home = ({ user }) => {
    const fileInput = useRef();

    const [nweets, setNweets] = useState([]);
    const [nweet, setNweet] = useState('');
    const [attachment, setAttachment] = useState('');

    const clearAttachment = (event) => {
        setAttachment(null);
        fileInput.current.value = null;
    }

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
                creator: user.displayName,
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
            <div className="container ">
                <form onSubmit={onSubmit}>
                    <div className="input-group my-5">
                        <input className="form-control" type="text" onChange={onChangeNweet} placeholder="What's on your mind" value={nweet} required />
                        <input className="btn btn-primary" type="submit" value="Nweet" />
                    </div>

                    {/* <div className="input-group">
                        <input className="mx-auto" type="file" accept="image/*" onChange={onUploadAttachment} />
                    </div> */}

                    <div className="my-5">
                        <input className="file-upload-input" ref={fileInput} type='file' onChange={onUploadAttachment} accept="image/*" />
                        <div className="drag-text">
                            <h3>Add Photo +</h3>
                        </div>
                    </div>
                </form>

                {attachment &&
                    <div className="mx-5">
                        <input className="btn btn-danger border-circle file-delete" type="button" value="X" onClick={clearAttachment} />
                        <img src={attachment} className="mx-auto d-block preview-img" />
                    </div>}
            </div>

            {nweets.map((nweetInfo) => (
                <Nweet key={nweetInfo.id} user={user} nweetInfo={nweetInfo} />)
            )}

        </>)

}
export default Home