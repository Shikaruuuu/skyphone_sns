import React, { useContext, useRef, useState } from "react";
import "./Share.css";
import { AuthContext } from "../../state/AuthContext";
import axios from "axios";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MenuItem, Select } from "@mui/material";

export default function Share() {
  const { user } = useContext(AuthContext);
  const title = useRef();
  const content = useRef();
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("other");
  const [reservationSlots, setReservationSlots] = useState([
    { date: dayjs(), time: dayjs() },
  ]);
  const [img, setImg] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // user が null なら処理を中断

    const newPost = {
      userId: user.id,
      title: title.current.value,
      content: content.current.value,
      price: price,
      category: category,
      slots: reservationSlots
        .filter((slot) => slot.date && slot.time) // 日付と時間が両方選択されているスロットのみを送信
        .map((slot) => {
          const dateTime = slot.date
            .hour(slot.time.hour())
            .minute(slot.time.minute())
            .second(0);
          return dateTime.toISOString();
        }),
    };

    if (img) {
      const data = new FormData();
      const fileName = Date.now() + img.name;
      data.append("name", fileName);
      data.append("file", img);
      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddSlot = () => {
    setReservationSlots([
      ...reservationSlots,
      { date: dayjs(), time: dayjs() },
    ]);
  };

  const handleDateChange = (index, newDate) => {
    const updatedSlots = [...reservationSlots];
    updatedSlots[index].date = newDate;
    setReservationSlots(updatedSlots);
  };

  const handleTimeChange = (index, newTime) => {
    const updatedSlots = [...reservationSlots];
    updatedSlots[index].time = newTime;
    setReservationSlots(updatedSlots);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (!user) {
    return null; // user が null なら何も表示しない
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <span className="title">プロフィール名</span>
          <input
            type="text"
            className="inputTitle"
            placeholder="プロフィール名を入力してください。"
            ref={title}
          />
        </div>
        <div className="shareMiddle">
          <span className="content">プロフィール説明</span>
          <textarea
            className="inputContent"
            placeholder="経歴やスキルなど、相談対応可能な内容の詳細を入力してください。"
            ref={content}
          />
        </div>
        <div className="inputImg">
          <label>サムネイル画像</label>
          <input
            type="file"
            id="file"
            accept=".png, .jpeg, .jpg "
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
          <div className="categorySetting">
            <span className="categoryTitle">カテゴリーを選択</span>
            <Select
              id="demo-simple-select"
              value={category}
              onChange={handleCategoryChange}>
              <MenuItem value="business">仕事の相談</MenuItem>
              <MenuItem value="study">勉強の相談</MenuItem>
              <MenuItem value="love">恋愛相談</MenuItem>
              <MenuItem value="relationship">人間関係の相談</MenuItem>
              <MenuItem value="family">家族に関する相談</MenuItem>
              <MenuItem value="other">その他</MenuItem>
            </Select>
          </div>
          <div className="priceSetting">
            <span className="priceTitle">サービス価格</span>
            <div className="priceWrapper">
              <input
                type="number"
                placeholder="金額を入力してください"
                className="inputTitle priceInput"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <span className="currency">円</span>
            </div>
          </div>
          <div className="shareReservationSlots">
            <span className="requestSlotTitle">予約リクエスト枠を追加</span>
            {reservationSlots.map((slot, index) => (
              <div key={index} className="shareSlot">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="日付を選択"
                    value={slot.date}
                    onChange={(newDate) => handleDateChange(index, newDate)}
                    renderInput={(params) => <input {...params} />}
                  />
                  <TimePicker
                    label="時間を選択"
                    value={slot.time}
                    onChange={(newTime) => handleTimeChange(index, newTime)}
                    renderInput={(params) => <input {...params} />}
                  />
                </LocalizationProvider>
              </div>
            ))}
            <button type="button" onClick={handleAddSlot}>
              + 追加
            </button>
          </div>
          <button className="shareButton" type="submit">
            公開する
          </button>
        </form>
      </div>
    </div>
  );
}
