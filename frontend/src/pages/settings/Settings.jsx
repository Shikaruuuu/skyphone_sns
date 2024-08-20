import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../state/AuthContext';
import "./Settings.css";
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';


export default function Settings() {
  const { user, dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  // const [password, setPassword] = useState("");
  const [desc, setDesc] = useState(user.desc);
  const [success, setSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [coverImg, setCoverImg] = useState();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId: user.id,
      username,
      email,
      // password,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      desc,
    };
    // if (password === "") {
    //   delete updatedUser.password; // パスワードが空の場合は更新しない
    // }

    if(profileImg) {
      const data = new FormData();
      const fileName = Date.now() + profileImg.name;
      data.append("name", fileName);
      data.append("file", profileImg);
      updatedUser.profilePicture = fileName;
      try {
          await axios.post("/upload/profile", data);
      } catch (err) {
          console.log(err)
      }
  }

    if(coverImg) {
      const data = new FormData();
      const fileName = Date.now() + coverImg.name;
      data.append("name", fileName);
      data.append("file", coverImg);
      updatedUser.coverPicture = fileName;
      try {
          await axios.post("/upload/cover", data);
      } catch (err) {
          console.log(err)
      }
  }

    try {
      const res = await axios.put(`/users/${user.id}`, updatedUser);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      setSuccess(true);
      setFadeOut(false);
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        const fadeTimer = setTimeout(() => {
          setSuccess(false);
        }, 500);
        return () => clearTimeout(fadeTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);


  return (
    <>
    <Topbar />
    <div className="settings">
    <Sidebar />
      <div className="settingsWrapper">
        <form className="settingsForm" onSubmit={handleUpdate}>
          <div className="settingsFormGroup">
            <label>ユーザー名</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="settingsFormGroup">
            <label>メールアドレス</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className="settingsFormGroup"> 入力されたパスワードをハッシュ化する必要あり
            <label>パスワード</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div> */}
          <div className="settingsFormGroup">
            <label>プロフィール画像</label>
            <input type='file' id='file' accept='.png, .jpeg, .jpg ' onChange={(e) => setProfileImg(e.target.files[0])}/>
          </div>
          <div className="settingsFormGroup">
            <label>カバー画像</label>
            <input type='file' id='file' accept='.png, .jpeg, .jpg ' onChange={(e) => setCoverImg(e.target.files[0])}/>
          </div>
          <div className="settingsFormGroup">
            <label>自己紹介</label>
            <textarea
              placeholder="自己紹介文を入力してください。"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <button className="settingsSubmitButton" type="submit">保存</button>
          {success && <span className={`successMessage ${fadeOut ? 'fade-out' : ''}`}>ユーザー情報が保存されました。</span>}        </form>
      </div>
      <Rightbar />
    </div>
    </>
  );
}
