const express = require("express");
const router = express.Router();
const { Post, User, ReservationSlot } = require("../models");

// 投稿を作成する
router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create({
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      img: req.body.img,
      price: req.body.price,
      category: req.body.category,
    });

    // 予約枠を作成する
    const slots = req.body.slots; // slotsはフロントエンドから送信される
    if (slots && slots.length > 0) {
      const slotPromises = slots.map((slot) =>
        ReservationSlot.create({
          postId: newPost.id,
          slotDate: slot,
        })
      );
      await Promise.all(slotPromises);
    }

    return res.status(200).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json(err);
  }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post.userId === req.body.userId) {
      await post.update(req.body);

      // 既存の予約枠を削除して、新しい予約枠を追加する
      if (req.body.slots && req.body.slots.length > 0) {
        await ReservationSlot.destroy({ where: { postId: post.id } });
        const slotPromises = req.body.slots.map((slot) =>
          ReservationSlot.create({
            postId: post.id,
            slotDate: slot,
          })
        );
        await Promise.all(slotPromises);
      }

      return res.status(200).json("投稿の編集に成功しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません");
    }
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post.userId === req.body.userId) {
      await post.destroy();
      await ReservationSlot.destroy({ where: { postId: post.id } }); // 予約枠も削除する
      return res.status(200).json("投稿の削除に成功しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません");
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// likesを管理するエンドポイント
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.update({ likes: [...post.likes, req.body.userId] });
      return res.status(200).json("投稿にいいねを押しました");
    } else {
      await post.update({
        likes: post.likes.filter((id) => id !== req.body.userId),
      });
      return res.status(200).json("いいねを外しました");
    }
  } catch (err) {
    console.error("Error liking post:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// プロフィール専用タイムライン
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    const posts = await Post.findAll({ where: { userId: user.id } });
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching profile timeline:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 全てのユーザーの投稿を取得
router.get("/timeline/all", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "profilePicture"], // 必要なユーザー情報を指定
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ message: "Failed to fetch posts", error: err });
  }
});

// 特定のユーザーの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(`Error fetching posts for user ${userId}:`, err);
    res.status(500).json(err);
  }
});

module.exports = router;
