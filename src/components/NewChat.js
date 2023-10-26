import React, { useState, useEffect } from "react";
import './NewChat.css';

import Api from "../Api";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default ({ user, chatlist, show, setShow }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        let result = await Api.getContactList(user.id);
        setList(result);
      }
    };
    getList();
  }, [user]);

  const addNewChat = async (user2) => {
    await Api.addNewChat(user, user2);
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div
      className="newChat"
      style={{
        left: show ? 0 : -415,
        width: show ? 415 : 0,
      }}
    >
      <div className="newChat--head">
        <div onClick={handleClose} className="newChat--backbutton">
          <ArrowBackIcon style={{ color: '#fff' }} />
        </div>
        <div className="newChat--headtitle">Nova Conversa</div>
      </div>
      <div className="newChat--list">
        {list.map((item, key) => (
          <div
            onClick={() => addNewChat(item)}
            className="newChat--item"
            key={key}
          >
            <img className="newChat--itemavatar" src={item.avatar} alt="" />
            <div className="newChat--itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};