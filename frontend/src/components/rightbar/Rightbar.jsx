import React, { useContext } from 'react';
import { Person } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import "./Rightbar.css";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../state/AuthContext';

export default function Rightbar() {
  const { user } = useContext(AuthContext); 
  
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <ul className="rightbarList">
          <li className="rightbarListItem">
            <Person  className="rightbarIcon"/>
            <Link to={`/followingList/${user.id}/followings`} className="rightbarListItemText" style={{ textDecoration: "none", color: "black" }}>
            <span className="rightbarListItemText">フォロー中</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Person  className="rightbarIcon"/>
            <Link to={`/followerList/${user.id}/followers`} className="rightbarListItemText" style={{ textDecoration: "none", color: "black" }}>
            <span className="rightbarListItemText">フォロワー</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <Person  className="rightbarIcon"/>
            <Link to={user ? `/profile/${user.id}` : "/login"} className="rightbarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="rightbarListItemText">プロフィール</span>
            </Link>
          </li>
          <li className="rightbarListItem">
            <SettingsIcon  className="rightbarIcon"/>
            <Link to={user ? `/settings/${user.id}` : "/login"} className="rightbarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="rightbarListItemText">設定</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
