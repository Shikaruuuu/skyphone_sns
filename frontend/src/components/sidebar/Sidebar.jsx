import React, { useContext } from 'react';
import { Home, Person } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import "./Sidebar.css";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../state/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext); 
  
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to="/" className="sidebarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">すべての相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={`/followingList/${user.id}/followings`} className="sidebarListItemText" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">仕事の相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={`/followingList/${user.id}/followings`} className="sidebarListItemText" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">勉強の相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={`/followerList/${user.id}/followers`} className="sidebarListItemText" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">恋愛相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={user ? `/profile/${user.id}` : "/login"} className="sidebarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">人間関係の相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={user ? `/settings/${user.id}` : "/login"} className="sidebarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">家族に関する相談</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={user ? `/settings/${user.id}` : "/login"} className="sidebarLink" style={{ textDecoration: "none", color: "black" }}>
            <span className="sidebarListItemText">その他</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
