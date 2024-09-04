import { ExitToApp, Notifications, Search } from "@mui/icons-material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TopbarMobileMobile.css";
import { AuthContext } from "../../state/AuthContext";

export default function TopbarMobile() {
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="TopbarMobileContainer">
      <div className="TopbarMobileLeft">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <span className="logo">SkyPhone</span>
        </Link>
      </div>
      <div className="TopbarMobileRight">
        <div className="TopbarMobileItemIcons">
          <div className="TopbarMobileIconItem">
            <Notifications />
            <span className="TopbarMobileIconBadge">2</span>
          </div>
          {user && (
            <>
              <Link to={`/profile/${user.username}`}>
                <img
                  src={
                    user.profilePicture
                      ? PUBLIC_FOLDER + user.profilePicture
                      : PUBLIC_FOLDER + "/person/noAvatar.png"
                  }
                  alt=""
                  className="TopbarMobileImg"
                />
              </Link>
              <div className="TopbarMobileIconItem" onClick={handleLogout}>
                <ExitToApp />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
