import React, { useRef } from 'react'
import "./Register.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordConfirmation = useRef();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //パスワードと確認用パスワードの一致を確認
        if(password.current.value !== passwordConfirmation.current.value) {
            passwordConfirmation.current.setCustomValidity("パスワードが違います。")
        } else {
            try {
                const user = {
                    username: username.current.value,
                    email: email.current.value,
                    password: password.current.value,
                };
                await axios.post("/auth/register", user);
                navigate("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };
  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">SNS</h3>
                <span className='loginDesc'>人と人を繋ぐ令和のSNS</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                    <p className="loginMsg">新規登録はこちら</p>
                    <input type="text" className="loginInput" placeholder="ユーザー名" required ref={username}/>
                    <input type="email" className="loginInput" placeholder="メールアドレス" required ref={email}/>
                    <input type="password" className="loginInput" placeholder="パスワード" required minLength="8" ref={password}/>
                    <input type="password" className="loginInput" placeholder="確認用パスワード" ref={passwordConfirmation}/>
                    <button className="loginBottun" type="submit">サインアップ</button>
                    <div className="buttonContainer">
                        <Link to="/login">
                            <button type="button" className="loginRedirect">ログイン画面はこちら</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
