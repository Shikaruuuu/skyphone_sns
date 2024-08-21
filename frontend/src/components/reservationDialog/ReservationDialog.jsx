import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';

export default function ReservationDialog({ open, onClose, postId }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`/api/reservationslots/${postId}`);
        setSlots(response.data);
      } catch (err) {
        console.error("Error fetching reservation slots:", err);
      }
    };

    if (open) {
      fetchSlots();
    }
  }, [open, postId]);

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/reservations`, {
        postId,
        slotDate: selectedSlot,
        status: "pending",
      });
      onClose();
    } catch (err) {
      console.error("Error submitting reservation request:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>予約リクエスト</DialogTitle>
      <DialogContent>
        <Select
          value={selectedSlot}
          onChange={handleSlotChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            予約可能な日時を選択してください
          </MenuItem>
          {slots.map((slot, index) => (
            <MenuItem key={index} value={slot.slotDate}>
              {new Date(slot.slotDate).toLocaleString()}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          予約リクエスト送信
        </Button>
      </DialogActions>
    </Dialog>
  );
}
