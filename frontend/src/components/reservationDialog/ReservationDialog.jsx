import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ReservationDialog.css";

export default function ReservationDialog({ postId, onClose }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`/reservation/slots/${postId}`);
        setAvailableSlots(response.data);
      } catch (err) {
        console.error("Error fetching available slots:", err);
      }
    };
    fetchAvailableSlots();
  }, [postId]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    try {
      await axios.post(`/reservations/request`, {
        slotId: selectedSlot.id,
      });
      onClose(); // ダイアログを閉じる
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    }
  };

  return (
    <div className="reservationDialog">
      <div className="reservationDialogContent">
        <h3>予約可能な日時を選択してください</h3>
        <ul className="slotList">
          {availableSlots.map((slot) => (
            <li key={slot.id} onClick={() => handleSlotSelect(slot)} className={selectedSlot?.id === slot.id ? "selected" : ""}>
              {new Date(slot.slotDate).toLocaleString()}
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit} disabled={!selectedSlot}>リクエスト送信</button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </div>
  );
}
