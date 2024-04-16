import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendsBar from './FriendsBar';
import Chat from './Chat'
const Home = () => {
    const navigate = useNavigate();
    const [chat, setChat] = useState();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <FriendsBar setChat={setChat} />
            <Chat userChat={chat} setChat={setChat} />
        </div>
    );
};

export default Home;