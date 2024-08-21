import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import FollowingList from "./pages/followingList/FollowingList";
import FollowerList from "./pages/followerList/FollowerList";
import Settings from "./pages/settings/Settings";
import CreatePost from "./pages/createPost/CreatePost";
import { AuthContext } from "./state/AuthContext";
import { useContext } from "react";
import React from "react";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/profile/:userId"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/followingList/:userId/followings"
          element={user ? <FollowingList /> : <Navigate to="/login" />}
        />
        <Route
          path="/followerList/:userId/followers"
          element={user ? <FollowerList /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings/:userId"
          element={user ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/createPost/:userId"
          element={user ? <CreatePost /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
