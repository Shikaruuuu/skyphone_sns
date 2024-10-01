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
              <span className="navbarListItemText">プロフィール作成</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">プロフィール管理</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">受信リクエスト管理</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">送信リクエスト管理</span>
            </Link>
          </li>
          <li className="navbarListItem">
            <Link
              to={user ? `/settings/${user.id}` : "/login"}
              className="navbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="navbarListItemText">アカウント設定</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
