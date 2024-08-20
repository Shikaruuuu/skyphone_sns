import React from 'react'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Followings from '../../components/followings/Followings';
import Rightbar from '../../components/rightbar/Rightbar';
import "./FollowingList.css";

export default function FollowingList() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
      <Sidebar />
      <Rightbar />
      <Followings />
      </div>
    </>
  );
}
