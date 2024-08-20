import "./Post.css";
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../state/AuthContext";
import Reservation from "../reservation/Reservation";

const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(`Fetching user with userId: ${post.userId}`);
        const response = await axios.get(`/users?userId=${post.userId}`);
        console.log("User fetched successfully:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [post.userId]);

  const handleLike = async () => {
    try {
      await axios.put(`/posts/${post.id}/like`, { userId: currentUser.id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReserveClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.id}`}>
              <img src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="postProfileImg" />
            </Link>
            <Link to={`/profile/${user.id}`} className="postUserNameLink">
              <span className="postUserName">{user.username}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)} </span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.content} </span>
          <img src={PUBLIC_FOLDER + post.img} alt="" className='postImg' />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src={PUBLIC_FOLDER + "/heart.png"} alt="" className="likeIcon" onClick={handleLike} />
            <span className="postLikeCounter">{like}人がいいねを押しました</span>
          </div>
          <div className="postBottomRight">
            <button className="reserveButton" onClick={handleReserveClick}>予約リクエスト</button>
            {showPopup && <Reservation postId={post.id} onClose={() => setShowPopup(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
