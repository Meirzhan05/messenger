import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

let socket;


const Chat = ({userChat, setChat}) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [friend, setFriend] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            return;
        }


        socket = io('http://localhost:4000', {query: {id: user._id}});    
        socket.on('receive-message', (message) => {
            setMessages((messages) => [...messages, {userId: message.from, message: message.content}]);
        });
    
        return () => {
            socket.off('receive-message');
        };
    }, [])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const chat = JSON.parse(localStorage.getItem('chat'));
        if (userChat) {
            axios.get(`http://localhost:4000/messages/messages/${user._id}/${chat.friendId}`).then((response) => {
                if (response.data !== null) {
                    setMessages(response.data.messages);
                } else {
                    setMessages([]);
                }
            });
            axios.get(`http://localhost:4000/users/${userChat.friendId}`).then((response) => {
                setFriend(response.data);
            });
        }
    }, [userChat])


    const handleSendMessage = (event) => {
        event.preventDefault();
        const chat = JSON.parse(localStorage.getItem('chat'));
        if (message) {
            setMessages([...messages, {userId: chat.userId, message}]);
            socket.emit('private message', {
                content: message,
                from: userChat.userId,
                to: userChat.friendId
            })
        }
    };

    return (
        <div>
            <h2>{friend.username || 'No user selected'}</h2>
            {userChat && (
                <div>
                    <div>
                        {messages && messages.map((message, index) => {
                            if (message.userId === userChat.userId) {
                                return <div key={index}><b>You:</b> {message.message}</div>
                            } else {
                                return <div key={index}><b>{friend.username}:</b> {message.message}</div>
                            }
                        })}
                    </div>

                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={(event) => handleSendMessage(event)}>Send</button>
                </div>
            )}
            


        </div>
    );
};

export default Chat;