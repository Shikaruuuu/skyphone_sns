import React from 'react'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Share from '../../components/share/Share';
import Rightbar from '../../components/rightbar/Rightbar';
import "./CreatePost.css";

export default function CreatePost() {
  return (
    <>
      <Topbar />
      <div className="createPostContainer">
      <Sidebar />
      <Share />
      <Rightbar />
      </div>
    </>
  );
}