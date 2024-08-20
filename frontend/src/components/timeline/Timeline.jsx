import React, { useContext, useEffect, useState } from 'react';
import "./Timeline.css";
import Share from '../share/Share';
import Post from '../post/Post';
import axios from "axios";
import { AuthContext } from '../../state/AuthContext';

export default function Timeline({ isProfile, profileUserId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;
        if (isProfile && profileUserId) {
          // プロフィール画面では特定のユーザーの投稿を取得
          console.log(`Fetching posts for user ID: ${profileUserId}`);
          response = await axios.get(`/posts/timeline/${profileUserId}`);
        } else {
          // ホーム画面では全てのユーザーの投稿を取得
          console.log("Fetching all posts");
          response = await axios.get(`/posts/timeline/all`);
        }
        console.log("Posts fetched successfully:", response.data);
        setPosts(
          response.data.sort((post1, post2) => {
            return new Date(post2.createdAt) - new Date(post1.createdAt);
          })
        );
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [profileUserId, isProfile]);

  return (
    <div className="timeline">
      <div className="timelineWrapper">
        {String(profileUserId) === String(user.id) && (
        <Share />
        )}
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
