import React, { useState, useEffect } from "react";
import './App.css';
import Api from "./Api";

import ChatListitem from './components/Chatlistitem'
import Chatintro from './components/Chatintro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './components/Login';

import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

export default function App() {
  const [chatlist, setChatlist] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    const fetchChatList = async () => {
      if (user !== null) {
        const chatListData = await Api.onChatList(user.id);
        setChatlist(chatListData);
      }
    };

    fetchChatList();
  }, [user]);

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleLoginData = async (u) => {
    const newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    };
    await Api.addUser(newUser);
    setUser(newUser);
  };

  if (user === null) {
    return <Login onReceive={handleLoginData} />;
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatlist={chatlist}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img className="header--avatar" src={user.avatar} alt=""/>
          <div className="header--buttons">
            <div onClick={handleNewChat} className="header--btn">
              <ChatIcon />
            </div>
            <div className="header--btn">
              <MoreVertIcon />
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" />
            <input
              type="search"
              placeholder="Procurar ou começar uma nova conversa"
            />
          </div>
        </div>
        <div className="chatlist">
         {chatlist && chatlist.map((item, key) => (
         <ChatListitem
          key={key}
         data={item}
         active={activeChat.chatId === chatlist[key].chatId}
         onClick={() => setActiveChat(chatlist[key])}
         />
        ))}
       </div>
      </div>
      <div className="contentarea">
        {activeChat.chatId !== undefined ? (
          <ChatWindow 
          user={user}
          data={activeChat} />
        ) : (
          <Chatintro />
        )}
      </div>
    </div>
  );
}