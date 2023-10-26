import React, { useState, useEffect } from "react";
import './MessageItem.css';

export default ({ data, user }) => {

  const [time, setTime] = useState('');

  useEffect(() => {
    if (data.date > 0) {
      const d = new Date(data.date * 1000);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      setTime(`${hours}:${minutes}`);
    }
  }, [data]);

  return (
    <div
      className={
        "messageLine " +
        (user.id === data.author ? "messageLine--right" : "messageLine--left")
      }
    >
      <div
        className="messageItem"
        style={{
          backgroundColor: user.id === data.author ? "#5fffc2c7" : "#FFF",
        }}
      >
        <div className="messageText">{data.body}</div>
        <div className="messageDate">{time}</div>
      </div>
    </div>
  );
};