const nodemailer = require("nodemailer");

// メール送信機能
const sendEmail = async (to, subject, text) => {
  try {
    // SMTP サーバーの設定
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmailを使用する場合
      auth: {
        user: process.env.EMAIL_USER, // 環境変数でメールアカウントを管理
        pass: process.env.EMAIL_PASS, // アプリパスワードやGoogleアカウントのパスワード
      },
    });

    // メールの内容
    const mailOptions = {
      from: process.env.EMAIL_USER, // 送信者メールアドレス
      to, // 受信者メールアドレス
      subject, // メールの件名
      text, // メールの本文
    };

    // メールを送信
    await transporter.sendMail(mailOptions);
    console.log("メールが正常に送信されました");
  } catch (error) {
    console.error("メール送信エラー:", error);
    throw new Error("メール送信に失敗しました");
  }
};

module.exports = sendEmail;
