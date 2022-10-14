import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";


const Nweet = ({ user, nweetInfo }) => {
    //console.log(ref(storageService,nweetInfo.attachmentURL));
    const [isEditing, setIsEditing] = useState(false);
    const [editingNweet, setEditingNweet] = useState(nweetInfo.text);

    // 느윗 삭제
    const onDeleteClick = async () => {
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

    return (
        <div className="container border rounded my-5" > {
            isEditing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input className="form-control" type="text" onChange={onEditChange} placeholder="edit nweet" value={editingNweet} required />
                            {/* <input type="file" accept="image/*" /> */}
                            <input className="btn btn-outline-primary" type="submit" value="edit" />
                            <input className="btn btn-outline-danger" type="button" value="cancel" onClick={onEditToggleClick} />
                        </div>
                    </form>

                </>) : (
                <>
                    <div>
                        <div className="d-flex justify-content-between">
                            <p>{nweetInfo.creator}</p>
                            {
                                user.uid === nweetInfo.uid && (
                                    <>
                                        <div>
                                            <button className="btn btn-outline-danger" onClick={onDeleteClick}>Delete Nweet</button>
                                            <button className="btn btn-outline-info" onClick={onEditToggleClick}> Edit Nweet</button>
                                        </div>
                                    </>)
                            }
                        </div>

                        <div>
                            {nweetInfo.attachmentURL && (<img src={nweetInfo.attachmentURL} className="preview-img" />)}
                            <p className="fs-5"> {nweetInfo.text} </p>

                        </div>
                    </div>

                </>
            )

        }
        </div>
    )
}

export default Nweet;