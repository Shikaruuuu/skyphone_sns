import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";

export default function ReservationDialog({ open, onClose, postId }) {
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(
          `/reservations/reservationslots/${postId}`
        );
        setSlots(response.data);

        // 予約可能な日付を抽出
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

    // 選択された日付に基づいて予約可能な時間を設定
    const times = slots
      .filter(
        (slot) =>
          dayjs(slot.slotDate).format("YYYY-MM-DD") ===
          newDate.format("YYYY-MM-DD")
      )
      .map((slot) => dayjs(slot.slotDate).format("HH:mm"));

    setAvailableTimes(times);
    setSelectedTime(""); // 新しい日付が選択された場合、時間の選択をリセット
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const selectedDateTime =
        dayjs(selectedDate).format("YYYY-MM-DD") + "T" + selectedTime;
      await axios.post(`/reservations`, {
        userId: currentUser.id,
        postId,
        requestedDate: selectedDateTime,
        status: "pending",
      });
      onClose();
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    }
  };

  // 指定された日付のみ有効化
  const disableUnavailableDates = (date) => {
    return !availableDates.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!selectedTime}>
          予約リクエスト送信
        </Button>
      </DialogActions>
    </Dialog>
  );
}
