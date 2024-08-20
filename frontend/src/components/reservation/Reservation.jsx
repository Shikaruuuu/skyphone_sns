import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Reservation.css";

export default function Reservation({ postId, onClose }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await axios.get(`/slots/${postId}`);
        setAvailableDates(response.data);
      } catch (err) {
        console.error("Error fetching available dates:", err);
      }
    };

    fetchAvailableDates();
  }, [postId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/`, {
        postId,
        requestedDate: selectedDate,
        status: "pending",
      });
      onClose(); // ポップアップを閉じる
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    }
  };

  return (
    <div className="Reservation">
      <div className="ReservationContent">
        <h3>予約日時を選択してください</h3>
        {availableDates.length > 0 ? (
          <select onChange={handleDateChange} value={selectedDate}>
            <option value="">日時を選択してください</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleString()}
              </option>
            ))}
          </select>
        ) : (
          <p>利用可能な日時がありません。</p>
        )}
        <button onClick={handleSubmit} disabled={!selectedDate}>リクエスト送信</button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </div>
  );
}
