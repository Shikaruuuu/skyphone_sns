const nodemailer = require("nodemailer");

// メール送信機能
const sendEmail = async (to, subject, text) => {
  try {
    // SMTP サーバーの設定
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // メールの内容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
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
