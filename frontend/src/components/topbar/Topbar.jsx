import { ExitToApp, Notifications, Search } from '@mui/icons-material';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Topbar.css";
import { AuthContext } from "../../state/AuthContext";

export default function Topbar() {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <span className="logo">SkyPhone</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input type="text" className="searchInput" placeholder="投稿を検索しよう" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarItemIcons">
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">2</span>
          </div>
          {user && (
            <>
              <Link to={`/profile/${user.username}`}>
                <img
                  src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"}
                  alt=""
                  className="topbarImg"
                />
              </Link>
              <div className="topbarIconItem" onClick={handleLogout}>
                <ExitToApp />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
