import React, { useContext, useEffect, useState } from "react";
import "./Timeline.css";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../state/AuthContext";

export default function Timeline({ isProfile, profileUserId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // カテゴリリストを設定
  const categories = [
    { value: "business", label: "仕事の相談" },
    { value: "study", label: "勉強の相談" },
    { value: "love", label: "恋愛相談" },
    { value: "relationship", label: "人間関係の相談" },
    { value: "family", label: "家族に関する相談" },
    { value: "other", label: "その他" },
  ];

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

  // カテゴリごとに投稿をフィルタリング
  const categorizedPosts = categories.map((category) => {
    return {
      category: category.label,
      posts: posts.filter((post) => post.category === category.value),
    };
  });

  return (
    <div className="timeline">
      <div className="timelineWrapper">
        {categorizedPosts.map((categorySection, index) => (
          <div key={index} className="categorySection">
            <span className="categoryName">{categorySection.category}</span>
            <div className="categoryPosts">
              {categorySection.posts.length > 0 ? (
                categorySection.posts.map((post) => (
                  <Post post={post} key={post.id} />
                ))
              ) : (
                <p>このカテゴリには投稿がありません。</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
