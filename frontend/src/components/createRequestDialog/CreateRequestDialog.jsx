import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";
import "./CreateRequestDialog.css";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function CreateRequestDialog({ open, onClose }) {
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
  const [repetitionUnit, setRepetition] = useState("日ごと");
  const [repetitionNumber, setrepetitionNumber] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const handleRepetitionUnitChange = (e) => {
    setRepetition(e.target.value);
  };
  const handleCheckhange = (e) => {
    setIsChecked(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <>
        <DialogTitle>予約リクエスト枠を作成</DialogTitle>
        <DialogContent className="createDialogContent">
          <Button onClick={onClose} color="primary">
            日付を選択
          </Button>
          <div className="createTimesetting">
            <Button onClick={onClose} color="primary">
              開始時刻を選択
            </Button>
            <Button onClick={onClose} color="primary">
              終了時刻を選択
            </Button>
          </div>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="繰り返す" />
          </FormGroup>
          <div className="repetitionSetting">
            <div className="repetitionNumberSetting">
              <span className="repetitionNumberSettingTitle">回数</span>
              <input
                type="number"
                placeholder="数字をを入力してください"
                className="repetitionNumberInput"
                value={repetitionNumber}
                onChange={(e) => setrepetitionNumber(Number(e.target.value))}
              />
            </div>
            <Select
              value={repetitionUnit}
              onChange={handleRepetitionUnitChange}>
              <MenuItem value="study">日ごと</MenuItem>
              <MenuItem value="love">週ごと</MenuItem>
              <MenuItem value="relationship">月ごと</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            キャンセル
          </Button>
          <Button>
            {/* onClick={handleConfirmation}
            color="primary"
            variant="contained"
            disabled={!selectedSlot || isSubmitting}> */}
            保存
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}
