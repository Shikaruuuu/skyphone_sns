import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Hamburger.css";
import { AuthContext } from "../../state/AuthContext";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {isOpen && (
        <ul className="hamburger-items">
          <li className="navbarListItem">
            <Link
              to={`/createPost/${user.id}`}
              className="navbarLink"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">相談を作成</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">相談管理</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">リクエスト管理</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">フォロー中</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followerList/${user.id}/followers`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">フォロワー</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={user ? `/profile/${user.id}` : "/login"}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">プロフィール</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={user ? `/settings/${user.id}` : "/login"}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">設定</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
