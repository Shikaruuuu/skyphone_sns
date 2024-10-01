import React, { useContext } from "react";
import { Person } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import "./Rightbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../state/AuthContext";

export default function Rightbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <ul className="rightbarList">
          <li className="rightbarListItem">
            <Link
              to={`/createPost/${user.id}`}
              className="navbarLink"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="rightbarListItemText">プロフィール作成</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="rightbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="rightbarListItemText">プロフィール管理</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="rightbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="rightbarListItemText">受信リクエスト管理</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Link
              to={`/followingList/${user.id}/followings`}
              className="rightbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="rightbarListItemText">送信リクエスト管理</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Link
              to={user ? `/settings/${user.id}` : "/login"}
              className="rightbarListItemText"
              style={{ textDecoration: "none", color: "black" }}>
              <span className="rightbarListItemText">アカウント設定</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
