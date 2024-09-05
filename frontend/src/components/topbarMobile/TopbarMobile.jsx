import { ExitToApp, Notifications } from "@mui/icons-material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TopbarMobile.css";
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
    <div className="topbarMobileContainer">
      <div className="topbarMobileLeft">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <span className="logo">SkyPhone</span>
        </Link>
      </div>
      <div className="topbarMobileCenter"></div>
      <div className="topbarMobileRight">
        <div className="topbarMobileItemIcons">
          <div className="topbarMobileIconItem">
            <Notifications />
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
                  className="topbarMobileImg"
                />
              </Link>
              <div className="topbarMobileIconItem" onClick={handleLogout}>
                <ExitToApp />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
