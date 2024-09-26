import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";
import "./ReservationDialogCalendar.css";
import { TextField } from "@mui/material";

export default function ReservationDialogCalendar({
  open,
  onClose,
  postId,
  postTitle,
  postContent,
  postPrice,
  postUserName,
}) {
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(1, "day")
  );

  // 表示する時間帯（30分刻み）
  const times = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          `/reservations/reservationslots/${postId}`
        );
        setSlots(response.data);

        const dates = Array.from(
          new Set(
            response.data.map((slot) =>
              dayjs(slot.slotDate).format("YYYY-MM-DD")
            )
          )
        );
        setAvailableDates(dates);
      } catch (err) {
        console.error("Error fetching reservation slots:", err);
      }
    };

    if (open) {
      fetchSlots();
    }
  }, [open, postId]);

  // 現在の週に基づいて1週間分の日付を生成する
  const generateWeekDates = (startDate) => {
    return Array.from({ length: 7 }, (_, index) =>
      dayjs(startDate).add(index, "day").format("YYYY-MM-DD")
    );
  };

  const handleSlotClick = (date, time) => {
    const selectedDateTime = `${date} ${time}`;
    setSelectedSlot(selectedDateTime);
  };

  const isSlotAvailable = (date, time) => {
    return slots.some(
      (slot) =>
        dayjs(slot.slotDate).format("YYYY-MM-DD HH:mm") === `${date} ${time}`
    );
  };

  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`/reservations`, {
        userId: currentUser.id,
        postId,
        requestedDate: selectedSlot,
        status: "pending",
        email,
        phoneNumber,
      });

      await axios.post(`/reservations/sendEmail`, {
        to: email,
        subject: "予約リクエスト確認",
        message: `予約リクエストが完了しました。\n日付: ${selectedSlot}\nタイトル: ${postTitle}`,
      });

      alert("リクエストを送信しました");
      onClose();
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phoneNumber) => /^\d{10,11}$/.test(phoneNumber);

  // 1週間分の日付を取得
  const weekDates = generateWeekDates(currentWeekStart);

  // 次の1週間に移動
  const handleNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(1, "week"));
  };

  // 前の1週間に移動
  const handlePrevWeek = () => {
    setCurrentWeekStart(currentWeekStart.subtract(1, "week"));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {!showConfirmation ? (
        <>
          <DialogTitle>予約リクエスト</DialogTitle>
          <DialogContent>
            <div className="week-navigation">
              <Button onClick={handlePrevWeek}>前の1週間</Button>
              <Button onClick={handleNextWeek}>次の1週間</Button>
            </div>
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>時間/日付</th>
                  {weekDates.map((date, index) => (
                    <th key={index}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => (
                  <tr key={index}>
                    <td>{time}</td>
                    {weekDates.map((date, i) => (
                      <td
                        key={i}
                        className={
                          isSlotAvailable(date, time)
                            ? "available-slot"
                            : "unavailable-slot"
                        }
                        onClick={() =>
                          isSlotAvailable(date, time) &&
                          handleSlotClick(date, time)
                        }>
                        {isSlotAvailable(date, time) ? "◯" : "×"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              キャンセル
            </Button>
            <Button
              onClick={handleConfirmation}
              color="primary"
              variant="contained"
              disabled={!selectedSlot || isSubmitting}>
              確認画面へ
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>予約確認</DialogTitle>
          <DialogContent>
            <p>相談タイトル: {postTitle}</p>
            <p>相談内容: {postContent}</p>
            <p>価格: ¥{postPrice}</p>
            <p>投稿者: {postUserName}</p>
            <p>予約日時: {selectedSlot}</p>
            <p>予約者: {currentUser.username}</p>

            <TextField
              fullWidth
              margin="normal"
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="電話番号（ハイフンなし）"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={
                isSubmitting ||
                !validateEmail(email) ||
                !validatePhoneNumber(phoneNumber)
              }>
              確定
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
