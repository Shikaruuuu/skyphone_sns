import React from 'react'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Followers from '../../components/followers/Followers';
import Rightbar from '../../components/rightbar/Rightbar';
import "./FollowerList.css";

export default function FollowerList() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
      <Sidebar />
      <Rightbar />
      <Followers />
      </div>
    </>
  );
}
