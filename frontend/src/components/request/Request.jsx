import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./Request.css";
import ReservationDialog from "../../components/reservationDialog/ReservationDialog";

const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Request() {
  const { postId } = useParams(); // URLからpostIdを取得します。
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [showDialog, setShowDialog] = useState(false); // ダイアログの表示状態を管理

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`/posts/${postId}`);
        setPost(postResponse.data);

        const userResponse = await axios.get(`/users?userId=${postResponse.data.userId}`);
        setUser(userResponse.data);
      } catch (err) {
        console.error("Error fetching post or user:", err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleReservationClick = () => {
    setShowDialog(true); // ダイアログを表示
  };

  const handleDialogClose = () => {
    setShowDialog(false); // ダイアログを閉じる
  };

  return (
    <div className="request">
        <div className='requestWrapper'>
            <div className='requestTop'>
                <span className='requestName'>{post.title}</span>
            </div>
            <div className='requestUpperMiddle'>
                <img src={post.img ? PUBLIC_FOLDER + post.img : PUBLIC_FOLDER + "/post/noPostImg.png"} alt="" className="postImg" />
            </div>
            <div className='requestMiddle'>
                <span className='requestContent'>{post.content}</span>
            </div>
            <div className='requestLowerMiddle'>
                <span className='price'>価格: ¥{post.price}</span>
                <span className='userName'>投稿者: {user.username}</span>
            </div>
            <div className='requestBottom'>
                <button className="requestButton" onClick={handleReservationClick}>予約リクエスト</button>
            </div>
        </div>
        {showDialog && (
          <ReservationDialog postId={post.id} onClose={handleDialogClose} />
        )}
    </div>
  );
}
