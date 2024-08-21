import React, { useContext, useRef, useState } from 'react';
import { Image } from '@mui/icons-material';
import "./Share.css";
import { AuthContext } from '../../state/AuthContext';
import axios from 'axios';

export default function Share() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const title = useRef();
    const content = useRef();
    const [price, setPrice] = useState("");
    const [reservationSlots, setReservationSlots] = useState([{ date: "", time: "" }]);
    const [img, setImg] = useState();

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;  // user が null なら処理を中断

        const newPost = {
            userId: user.id,
            title: title.current.value,
            content: content.current.value,
            price: price,
            reservationSlots,
        };

        if(img) {
            const data = new FormData();
            const fileName = Date.now() + img.name;
            data.append("name", fileName);
            data.append("file", img);
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
                    <span className='title'>相談タイトル</span>
                    <input type="text" className="inputTitle" placeholder="相談タイトルを入力してください。" ref={title} />
                </div>
                <div className='shareMiddle'>
                    <span className='content'>相談内容</span>
                    <input type="text" className="inputContent" placeholder="相談内容を入力してください。" ref={content} />
                </div>
                <div className="img">
                        <label>サムネイル画像</label>
                        <input type='file' id='file' accept='.png, .jpeg, .jpg ' onChange={(e) => setImg(e.target.files[0])}/>
                </div>
                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                    <div className='priceSetting'>
                        <span className='priceTitle'>サービス価格</span>
                        <input
                            type="number"
                            placeholder="価格を設定"
                            className="inputTitle"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="shareReservationSlots">
                        <span className='requestSlotTitle'>予約リクエスト枠を追加</span>
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
                    <button className="shareButton" type='submit'>公開する</button>
                </form>
            </div>
        </div>
    );
}
