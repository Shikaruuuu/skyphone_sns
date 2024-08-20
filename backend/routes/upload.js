const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
});
//投稿画像アップロード用API
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("画像アップロードに成功しました");
  } catch (err) {
    console.log(err);
  }
});
//プロフィール画像アップロード用API
router.post("/profile", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("画像アップロードに成功しました");
  } catch (err) {
    console.log(err);
  }
});
//カバー画像アップロード用API
router.post("/cover", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("画像アップロードに成功しました");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
