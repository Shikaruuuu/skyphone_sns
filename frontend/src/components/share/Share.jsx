import React, { useContext, useRef, useState } from 'react';
import { Image } from '@mui/icons-material';
import "./Share.css";
import { AuthContext } from '../../state/AuthContext';
import axios from 'axios';

export default function Share() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const content = useRef();
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState("");
    const [reservationSlots, setReservationSlots] = useState([{ date: "", time: "" }]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;  // user が null なら処理を中断

        const newPost = {
            userId: user.id,
            content: content.current.value,
            price: price,
            reservationSlots,
        };

        if(file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;
            try {
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err)
            }
        }

        try {
            await axios.post("/posts", newPost);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const handleAddSlot = () => {
        setReservationSlots([...reservationSlots, { date: "", time: "" }]);
    };

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...reservationSlots];
        updatedSlots[index][field] = value;
        setReservationSlots(updatedSlots);
    };

    if (!user) {
        return null; // user が null なら何も表示しない
    }

        return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="shareProfileImg" />
                    <input type="text" className="shareInput" placeholder="今何してるの" ref={content} />
                </div>
                <hr className="shareHr" />

                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor='file'>
                            <Image className="shareIcon" htmlColor='blue' />
                            <span className="shareOptionText">画像</span>
                            <input type='file' id='file' accept='.png, .jpeg, .jpg, .gif' style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <input
                            type="number"
                            placeholder="価格を設定"
                            className="shareInput"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="shareReservationSlots">
                        <h4>予約リクエスト枠を追加</h4>
                        {reservationSlots.map((slot, index) => (
                            <div key={index} className="shareSlot">
                                <input
                                    type="date"
                                    value={slot.date}
                                    onChange={(e) => handleSlotChange(index, "date", e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={slot.time}
                                    onChange={(e) => handleSlotChange(index, "time", e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddSlot}>
                            + 追加
                        </button>
                    </div>

                    <button className="shareButton" type='submit'>投稿</button>
                </form>
            </div>
        </div>
    );
}
