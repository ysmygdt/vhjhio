import React, { useEffect, useState, useRef } from "react";
import './ChatWindow.css';

import MessageItem from "./MessageItem";
import Api from "../Api";

import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

export default function ChatWindow({ users, data }) {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }

    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [user, setUsers] = useState([]);

    useEffect(() => {
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);

    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    const handleMicClick = () => {
        if (recognition !== null) {
            recognition.onstart = () => {
                setListening(true);
            };
            recognition.onend = () => {
                setListening(false);
            };
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            };
            recognition.start();
        }
    };

    const handleInputKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleSendClick();
        }
    };

    const handleSendClick = () => {
        if (text !== '') {
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
        }
    };

    return (
        <div className="chatwindow">
            <div className="chatwindow--header">
                <div className="chatwindow--headerinfo">
                    <img className="chatwindow--avatar" src={data.image} alt="" />
                    <div className="chatwindow--name">{data.title}</div>
                </div>

                <div className="chatwindow--headerbuttons">
                    <div className="chatwindow--btm">
                        <SearchIcon style={{ color: "#919191" }} />
                    </div>

                    <div className="chatwindow--btm">
                        <AttachFileIcon style={{ color: "#919191" }} />
                    </div>

                    <div className="chatwindow--btm">
                        <MoreVertIcon style={{ color: "#919191" }} />
                    </div>
                </div>
            </div>
            <div ref={body} className="chatwindow--body">
                {list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            <div className="chatwindow--footer">
                <div className="chatwindow--pre">
                    <div className="chatwindow--inputarea">
                        <input
                            className="chatwindow--input"
                            type="text"
                            placeholder="Digite uma mensagem"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyUp={handleInputKeyUp}
                        />
                    </div>
                    <div className="chatwindow--pos">
                        {text === '' && (
                            <div onClick={handleMicClick} className="chatwindow--btm">
                                <MicIcon style={{ color: listening ? '#126ECE' : '#919191' }} />
                            </div>
                        )}
                        {text !== '' && (
                            <div onClick={handleSendClick} className="chatwindow--btm">
                                <SendIcon style={{ color: '#919191' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}