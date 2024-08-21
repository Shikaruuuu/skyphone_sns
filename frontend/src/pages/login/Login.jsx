import React, { useContext, useRef } from 'react';
import "./Login.css";
import { loginCall } from '../../actionCalls';
import { AuthContext } from '../../state/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailValue = email.current.value;
        const passwordValue = password.current.value;

        if (emailValue.length > 50) {
            alert("Email must be less than 50 characters");
            return;
        }

        if (passwordValue.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        console.log('Login form submitted:', {
            email: emailValue,
            password: passwordValue,
        });

        loginCall(
            {
                email: emailValue,
                password: passwordValue,
            },
            dispatch
        );
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">SkyPhone</h3>
                    <span className='loginDesc'>その悩み、誰かに電話で相談してみよう</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        <p className="loginMsg">ログインはこちら</p>
                        <input type="email" className="loginInput" placeholder="メールアドレス" required ref={email}/>
                        <input type="password" className="loginInput" placeholder="パスワード" required minLength="8" ref={password}/>
                        <button className="loginBottun" disabled={isFetching}>ログイン</button>
                        {/* {error && <span className="errorMessage">{error.message || error}</span>} */}
                        <span className='loginForgot'>パスワードを忘れた方へ</span>
                        <div className="buttonContainer">
                            <Link to="/register">
                                <button type="button" className="loginRegisterBottun">アカウント作成</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
