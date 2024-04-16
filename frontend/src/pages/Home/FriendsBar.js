import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const FriendsBar = ( {setChat} ) => {
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [tab, setTab] = useState('friends');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    if (token === null) {
        navigate('/login');
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            axios.get(`http://localhost:4000/users/${user._id}/friends`).then((response) => {
                setFriends(response.data);
            }).catch((error) => {
                console.error(error);
            });
    
            axios.get(`http://localhost:4000/users`).then((response) => {
                const otherUsers = response.data.filter(u => u._id !== user._id);
                setUsers(otherUsers);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [friends.length, users.length]);

    const addFriend = (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`http://localhost:4000/users/${user._id}/addFriend`, { friendId: id })
            .then((response) => {
                setFriends([...friends, response.data]);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteFriend = (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`http://localhost:4000/users/${user._id}/deleteFriend/`, {friendId: id})
            .then(() => {
                setFriends(friends.filter(f => f._id !== id));        
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const openChat = (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        setChat({ userId: user._id, friendId: id })
        localStorage.setItem('chat', JSON.stringify({ userId: user._id, friendId: id }));
    }

    return (
        <div className="friends-bar">
            <h2>Friends</h2>
            <button onClick={() => setTab('friends')}>Friends</button>
            <button onClick={() => setTab('addFriends')}>Add Friends</button>

            {tab === 'friends' && (
                <ul>
                    {friends.map((friend) => {
                        return <li key={friend._id}>
                            {friend.username}
                            <button onClick={() => deleteFriend(friend._id)}>Delete</button>
                            <button onClick={() => openChat(friend._id)}>Chat</button>

                        </li>
                    })}
                </ul>
            )}

            {tab === 'addFriends' && (
                <ul>
                    {users.map((u) => {
                        if (u.username && friends.some(friend => friend._id === u._id)) {
                            return null;
                        }
                        return (
                            <li key={u._id}>
                                {u.username}
                                <button onClick={() => addFriend(u._id)}>Add</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FriendsBar;