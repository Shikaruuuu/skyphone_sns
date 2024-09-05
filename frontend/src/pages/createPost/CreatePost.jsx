import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Share from "../../components/share/Share";
import Rightbar from "../../components/rightbar/Rightbar";
import "./CreatePost.css";
import TopbarMobile from "../../components/topbarMobile/TopbarMobile";
import Hamburger from "../../components/hamburger/Hamburger";

export default function CreatePost() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ウィンドウサイズが変更された時にサイズを更新する
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // コンポーネントがアンマウントされた際にイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {windowWidth >= 1036 ? <Topbar /> : <TopbarMobile />}
      <div className="createPostContainer">
        {/* <Sidebar /> */}
        <Share />
        {windowWidth >= 1036 ? <Rightbar /> : <Hamburger />}
      </div>
    </>
  );
}
