import React from 'react'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Request from '../../components/request/Request';
import Rightbar from '../../components/rightbar/Rightbar';
import "./RequestPost.css";

export default function RequestPost() {
  return (
    <>
      <Topbar />
      <div className="requestPostContainer">
      <Sidebar />
      <Request />
      <Rightbar />
      </div>
    </>
  );
}
