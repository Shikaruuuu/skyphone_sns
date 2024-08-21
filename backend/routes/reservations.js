const express = require("express");
const router = express.Router();
const { Reservation, ReservationSlot, User, Post } = require("../models");

// 予約を作成する
router.post("/", async (req, res) => {
  try {
    const newReservation = await Reservation.create({
      userId: req.body.userId,
      postId: req.body.postId,
      requestedDate: req.body.requestedDate,
      status: "pending", // デフォルトで "pending" 状態に設定
    });
    return res.status(201).json(newReservation);
  } catch (err) {
    console.error("Error creating reservation:", err);
    return res.status(500).json({ message: "Failed to create reservation" });
  }
});

// 特定の予約を取得する
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
        },
        {
          model: Post,
          attributes: ["id", "desc", "img"],
        },
      ],
    });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    return res.status(200).json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    return res.status(500).json({ message: "Failed to fetch reservation" });
  }
});

// 予約の状態を更新する
router.put("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    const post = await Post.findByPk(reservation.postId);

    // 投稿の作成者かどうか確認
    if (req.body.userId !== post.userId) {
      return res.status(403).json("この操作を行う権限がありません");
    }

    await reservation.update({ status: req.body.status });
    res.status(200).json("予約ステータスが更新されました");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 予約を削除する
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    await reservation.destroy();
    return res.status(200).json("Reservation deleted");
  } catch (err) {
    console.error("Error deleting reservation:", err);
    return res.status(500).json({ message: "Failed to delete reservation" });
  }
});

// 特定の投稿に関連するすべての予約を取得する
router.get("/post/:postId", async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { postId: req.params.postId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
        },
      ],
      order: [["requestedDate", "DESC"]],
    });
    return res.status(200).json(reservations);
  } catch (err) {
    console.error("Error fetching reservations for post:", err);
    return res.status(500).json({ message: "Failed to fetch reservations" });
  }
});

// 予約枠を取得するエンドポイント
router.get("/slots/:postId", async (req, res) => {
  try {
    const slots = await ReservationSlot.findAll({
      where: {
        postId: req.params.postId,
        status: "pending",
      },
    });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservation slots" });
  }
});

// 予約リクエストを作成するエンドポイント
router.post("/", async (req, res) => {
  try {
    const newReservation = await Reservation.create({
      userId: req.body.userId,
      postId: req.body.postId,
      requestedDate: req.body.requestedDate,
      status: "pending",
    });
    res.status(200).json(newReservation);
  } catch (err) {
    console.error("Error creating reservation request:", err);
    res
      .status(500)
      .json({ message: "Failed to create reservation request", error: err });
  }
});

module.exports = router;
