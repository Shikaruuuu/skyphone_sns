import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ReservationDialog({
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user: currentUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);

    const times = slots
      .filter(
        (slot) =>
          dayjs(slot.slotDate).format("YYYY-MM-DD") ===
          newDate.format("YYYY-MM-DD")
      )
      .map((slot) => dayjs(slot.slotDate).format("HH:mm"));

    setAvailableTimes(times);
    setSelectedTime("");
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleConfirmation = () => {
    setShowConfirmation(true); // 確認画面を表示
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10,11}$/;
    return phonePattern.test(phoneNumber);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // メールと電話番号のバリデーション
    if (!validateEmail(email)) {
      alert("正しいメールアドレスを入力してください。");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      alert(
        "電話番号の形式が正しくありません。ハイフンなしの10桁または11桁の数字を入力してください。"
      );
      return;
    }
    try {
      const selectedDateTime =
        dayjs(selectedDate).format("YYYY-MM-DD") + "T" + selectedTime;

      await axios.post(`/reservations`, {
        userId: currentUser.id,
        postId,
        requestedDate: selectedDateTime,
        status: "pending",
        email: email,
        phoneNumber: phoneNumber,
      });

      // メール送信（仮想のエンドポイントを作成する必要があります）
      await axios.post(`/reservations/sendEmail`, {
        to: email,
        subject: "予約リクエスト確認",
        message: `予約リクエストが完了しました。\n日付: ${selectedDateTime}\nタイトル: ${postTitle}`,
      });

      // メッセージを表示し、ホーム画面に遷移
      alert("リクエストを送信しました");
      navigate("/"); // ホーム画面に遷移
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableUnavailableDates = (date) => {
    const today = dayjs().startOf("day");
    return (
      dayjs(date).isBefore(today) ||
      !availableDates.includes(dayjs(date).format("YYYY-MM-DD"))
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {!showConfirmation ? (
        <>
          <DialogTitle>予約リクエスト</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="予約可能な日付"
                value={selectedDate}
                onChange={handleDateChange}
                shouldDisableDate={disableUnavailableDates}
                renderInput={(params) => <input {...params} />}
              />
            </LocalizationProvider>

            {selectedDate && (
              <Select
                value={selectedTime}
                onChange={handleTimeChange}
                displayEmpty
                fullWidth
                disabled={availableTimes.length === 0}>
                <MenuItem value="" disabled>
                  予約可能な時間を選択してください
                </MenuItem>
                {availableTimes.map((time, index) => (
                  <MenuItem key={index} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              キャンセル
            </Button>
            <Button
              onClick={handleConfirmation}
              color="primary"
              variant="contained"
              disabled={!selectedTime || isSubmitting}>
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
            <p>
              予約日時: {selectedDate.format("YYYY-MM-DD")} {selectedTime}
            </p>
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
              disabled={isSubmitting || !email || !phoneNumber}>
              確定
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
