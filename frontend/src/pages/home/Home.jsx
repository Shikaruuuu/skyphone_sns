import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Timeline from "../../components/timeline/Timeline";
import Rightbar from "../../components/rightbar/Rightbar";
import "./Home.css";
import TopbarMobile from "../../components/topbarMobile/TopbarMobile";
import Hamburger from "../../components/hamburger/Hamburger";
import BusinessTimeline from "../../components/businessTimeline/BusinessTimeline";

export default function Home() {
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
      <div className="homeContainer">
        {/* <Sidebar /> */}
        <Timeline isProfile={false} />
        <BusinessTimeline isProfile={false} />
        {windowWidth >= 1036 ? <Rightbar /> : <Hamburger />}
      </div>
    </>
  );
}
