import React, { useEffect, useState, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Timeline from "../../components/timeline/Timeline";
import Rightbar from "../../components/rightbar/Rightbar";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";
import Hamburger from "../../components/hamburger/Hamburger";
import TopbarMobile from "../../components/topbarMobile/TopbarMobile";

export default function Profile() {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { userId } = useParams(); // 現在のプロフィールページのユーザーID
  const { user: currentUser } = useContext(AuthContext); // ログインしているユーザー
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchUserAndFollowStatus = async () => {
      try {
        const userResponse = await axios.get(`/users?userId=${userId}`);
        setUser(userResponse.data);

        const followResponse = await axios.get(`/users/${userId}/isFollowed`, {
          params: { userId: currentUser.id },
        });
        setIsFollowed(followResponse.data.isFollowed);
      } catch (err) {
        console.error("Error fetching user or follow status:", err);
      }
    };
    fetchUserAndFollowStatus();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await axios.put(`/users/${userId}/unfollow`, {
          userId: currentUser.id,
        });
      } else {
        await axios.put(`/users/${userId}/follow`, { userId: currentUser.id });
      }
      setIsFollowed(!isFollowed);
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ウィンドウサイズが変更された時にサイズを更新する
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // コンポーネントがアンマウントされた際にイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {windowWidth >= 1036 ? <Topbar /> : <TopbarMobile />}
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {user.coverPicture ? (
                <img
                  src={PUBLIC_FOLDER + user.coverPicture}
                  alt=""
                  className="profileCoverImg"
                />
              ) : (
                <img
                  src={PUBLIC_FOLDER + "/post/3.jpeg"}
                  alt=""
                  className="profileCoverImg"
                />
              )}
              {user.profilePicture ? (
                <img
                  src={PUBLIC_FOLDER + user.profilePicture}
                  alt=""
                  className="profileUserImg"
                />
              ) : (
                <img
                  src={PUBLIC_FOLDER + "/person/noAvatar.png"}
                  alt=""
                  className="profileUserImg"
                />
              )}
            </div>
            <div className="profileInfo">
              <h4 className="ProfileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
              {userId !== String(currentUser.id) && (
                <button className="followButton" onClick={handleFollow}>
                  {isFollowed ? "フォロー解除" : "フォロー"}
                </button>
              )}
            </div>
          </div>
          <div className="profileRightBottom">
            <Timeline isProfile={true} profileUserId={userId} />
          </div>
        </div>
        {windowWidth >= 1036 ? <Rightbar user={user} /> : <Hamburger />}
      </div>
    </>
  );
}
