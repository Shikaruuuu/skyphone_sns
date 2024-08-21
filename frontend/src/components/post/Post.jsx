import "./Post.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Post({ post }) {
  const [user, setUser] = useState({});

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

  return (
    <div className="post">
      <Link to={`/post/${post.id}`} className="postItem" style={{textDecoration: "none", color: "black"}}>
      <div className="postWrapper">
        <div className="postImageContainer">
            <img src={post.img ? PUBLIC_FOLDER + post.img : PUBLIC_FOLDER + "/post/noPostImg.png"} alt="" className="postImg" />
        </div>
        <div className="postInfo">
          <span className="postText">{post.title} </span>
        </div>
        <div className="postBottom">
          <Link to={`/profile/${user.id}`}>
            <img src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="postProfileImg" />
          </Link>
          <Link to={`/profile/${user.id}`} className="postUserNameLink">
            <span className="postUserName">{user.username}</span>
          </Link>
            <span className="postPrice">￥{post.price}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
