import React, { useContext, useEffect, useState } from 'react';
import "./Followers.css";
import axios from "axios";
import { AuthContext } from '../../state/AuthContext';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";


export default function Followers() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const [followerUsers, setFollowerUsers] = useState([]);
    const { userId } = useParams(); 
    const { user: currentUser } = useContext(AuthContext);  // ログインしているユーザー
    useEffect(() => {
      const fetchFollowers =async () => {
        try {
          //ログインユーザーのフォロワーを取得
          const response = await axios.get(`/users/${userId}/followers`, {
            params: { userId: currentUser.id },
          });
          setFollowerUsers(response.data.sort((user1,user2) => {
            return new Date(user2.createdAt) - new Date(user1.createdAt);
          }));
        } catch (err) {
          console.error("Error fetching followerUsers", err);
        };
      };
      fetchFollowers();
    },[userId, currentUser.id]);

    return (
        <div className='followers'>
            <div className='followersWrapper'>
                <h4>フォロワー</h4>
                <ul>
                  {followerUsers.map(user => (
                    <li key={user.id}>
                      <div className="followerUser">
                        <img 
                          src={user.profilePicture ? `${PUBLIC_FOLDER}${user.profilePicture}` : `${PUBLIC_FOLDER}/person/noAvatar.png`}
                          alt="" 
                          className="followerUserImg"
                        />
                        <Link to={`/profile/${user.id}`} className="followerNameLink">
                        <span className="followerUsername">{user.username}</span>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
        </div>
    )
};