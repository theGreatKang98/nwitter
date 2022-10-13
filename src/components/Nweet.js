import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";


const Nweet = ({ user, nweetInfo }) => {
    //console.log(ref(storageService,nweetInfo.attachmentURL));
    const [isEditing, setIsEditing] = useState(false);
    const [editingNweet, setEditingNweet] = useState(nweetInfo.text);

    // 느윗 삭제
    const onDeleteClick = async() => {
        const userConfirm = window.confirm('delete nweet?');
        if (userConfirm) {
            try {
                await deleteDoc(doc(dbService, `nweets/${nweetInfo.id}`));
                await deleteObject(ref(storageService, nweetInfo.attachmentURL));
            } catch (error) {
                console.log(error);

            }
        }
    }
    // 느윗 수정
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `nweets/${nweetInfo.id}`), {
            text: editingNweet,
        });
        setIsEditing(false);
    }
    const onEditChange = (event) => {
        const { target: { value } } = event;
        setEditingNweet(value);
    }

    // 수정 토글
    const onEditToggleClick = () => (
        setIsEditing((prev) => !prev)
    );

    console.log('nweet is called');
    return (
        <div > {
            isEditing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onEditChange} placeholder="edit nweet" value={editingNweet} required />
                        <input type="file" accept="image/*" />
                        <input type="submit" value="edit" />
                    </form>
                    <input type="button" value="cancel" onClick={onEditToggleClick} />
                </>) : (
                <>  {nweetInfo.attachmentURL && (
                <img src={nweetInfo.attachmentURL} width="50px" height="50px"/>)}
                    <h3 > {nweetInfo.text} </h3>
                    {
                        user.uid === nweetInfo.uid && (
                            <>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                                <button onClick={onEditToggleClick}> Edit Nweet</button>
                            </>)
                    }
                </>
            )

        }
        </div>
    )
}

export default Nweet;