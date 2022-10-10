import { dbService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";


const Nweet = ({ currentUid, nweetInfo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingNweet, setEditingNweet] = useState(nweetInfo.text);

    // 느윗 삭제
    const onDeleteClick = () => {
        const userConfirm = window.confirm('delete nweet?');
        if (userConfirm) {
            try {
                deleteDoc(doc(dbService, `nweets/${nweetInfo.id}`));
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

    return (
        <div > {
            isEditing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onEditChange} placeholder="edit nweet" value={editingNweet} required />
                        <input type="submit" value="edit" />
                    </form>
                    <input type="button" value="cancel" onClick={onEditToggleClick} />
                </>) : (
                <>
                    <h3 > {nweetInfo.text} </h3>
                    {
                        currentUid === nweetInfo.uid && (
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