import {useContext, useEffect, useRef, useState} from "react";
import { Link, Route } from 'react-router-dom'
import Avatar from "./Avatar";
import Logo from "./Logo";
import Footer from '../components/Footer';
import {UserContext} from "./UserContext";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact";
import { LogoutButton } from '../components/LogoutButton';
import backgroundImage from '../assets/Fond_urbain.jpg';
import '../styles/Chat.css';
import { ReactComponent as Emplacement} from '../assets/emplacement.svg';
import { ReactComponent as Membre} from '../assets/membre.svg';

import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';

import { ReactComponent as Search } from '../assets/Search.svg';

export default function Chat() {
  const [ws,setWs] = useState(null);
  const [onlinePeople,setOnlinePeople] = useState({});
  const [offlinePeople,setOfflinePeople] = useState({});
  const [selectedUserId,setSelectedUserId] = useState(null);
  const [newMessageText,setNewMessageText] = useState('');
  const [messages,setMessages] = useState([]);
  const {username,setUsername,id,setId} = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);

  function connectToWs() {
    const ws = new WebSocket('ws://localhost:8080');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect.');
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({userId,username}) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    //console.log({ev,messageData});
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, {...messageData}]));
      }
    }
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText('');
      setMessages(prev => ([...prev,{
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  }
  
  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);
  
  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = {...onlinePeople};
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  
  return (
    <div>
      <div class='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>

        {/* Navigation Bar */}
        <nav class="navbar d-flex justify-content-end p-2 float-end">
          <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/nvxtrajet">
              <Trajet style={{ width: '100px', height: '100px' }} alt='commencer'/>
          </Link>
          <Link class="border border-4 border-success rounded-3 mx-1 mt-2" to="/chat">
              <Messagerie style={{ width: '100px', height: '100px' }} alt='commencer'/>
          </Link>
          <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/profile">
              <Profil style={{ width: '100px', height: '100px' }} alt='commencer'/>
          </Link>
        </nav>

        <div class="p-4 mb-4">
          <div>
            <h1 class="fw-bold text-large">Covelotage</h1>
            <h2 >Votre Communaute Cycliste</h2>
          </div>
        </div>

        <div class="light-gray rounded-3 mx-auto my-3 mx-md-5 my-md-4" >
          <div class="d-flex">
            <div class="w-25 d-flex flex-column rounded-3">
              <div class="flex-grow-1">
                <h2 class="d-flex flex-column align-items-center m-4" style={{color: '#4F772D'}}>Discussion</h2>
                {/*<Logo />*/}
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fa fa-search">
                      <Search style={{ width: '20px', height: '20px' }} alt='commencer'/></i>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="Rechercher un utilisateur"></input>
                </div>
                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                  <Contact
                    key={userId}
                    id={userId}
                    online={true}
                    username={onlinePeopleExclOurUser[userId]}
                    onClick={() => {setSelectedUserId(userId)}}
                    selected={userId === selectedUserId} />
                ))}
                {Object.keys(offlinePeople).map(userId => (
                  <Contact
                    key={userId}
                    id={userId}
                    online={false}
                    username={offlinePeople[userId].username}
                    onClick={() => {setSelectedUserId(userId)}}
                    selected={userId === selectedUserId} />
                ))}
              </div>
              <div class="p-2 text-center d-flex align-items-center justify-content-center">
                <span class="mr-2 small text-secondary d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '1rem', height: '1rem'}}>
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  {username}
                </span>
                <LogoutButton />
              </div>
            </div>

            <div class="border-start border-secondary border-2"></div>
            
            <div class="d-flex flex-column w-75 p-2 rounded-3">
              <div class="flex-grow-1">
                {!selectedUserId && (
                  <div class="d-flex flex-grow-1 align-items-center justify-content-center" style={{height:"75vh"}}>
                    <div class="text-secondary">&larr; Séléctionnez un utilisateur dans la barre latérale</div>
                  </div>
                )}
                {!!selectedUserId && (
                  <div class="position-relative" style={{height:"70vh"}}>
                    <div class="border border-2 border-secondary rounded-3 mx-1 mt-2 ">

                      <div class="p-2 fw-bold fs-5" style={{color: '#4F772D'}}>À propos de cet utilisateur</div>

                      <div class="d-flex align-items-center">
                        <Emplacement style={{ width: '20px', height: '20px' }} class="icon ms-3"/> {/* me = margin right ms = margin left*/}
                        <div>
                          <p class="mb-0">{selectedUserId}</p>
                        </div>
                      </div>

                      <div class="d-flex align-items-center">
                        <Membre style={{ width: '20px', height: '20px' }} class="icon ms-3"/> {/* me = margin right*/}
                        <div>
                          <p class="mb-0">Placeholder</p>
                        </div>
                      </div>

                    </div>
                    <div class="overflow-auto top-0 left-0 right-0 bottom-2 mt-2" style={{height:"60vh"}}>
                      {messagesWithoutDupes.map(message => (
                        <div key={message._id} class={(message.sender === id ? 'text-end': 'text-start')}>
                          <div class="text-sm text-secondary mb-0 fs-6">
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                          <div class={"text-start d-inline-block p-2 mb-2 rounded text-sm " + (message.sender === id ? 'bg-green':'bg-white ')} style={{maxWidth:"50vw"}}>
                            {message.text}
                            {message.file && (
                              <div class="">
                                <a target="_blank" rel="noreferrer" class="d-flex align-items-center gap-1 border-bottom" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                  </svg>
                                  {message.file}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                      ))}
                      <div ref={divUnderMessages}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search bar */}
              {!!selectedUserId && (
              <form class="d-flex gap-2" onSubmit={sendMessage}>
                <input type="text"
                      value={newMessageText}
                      onChange={ev => setNewMessageText(ev.target.value)}
                      placeholder="Écrivez votre message ici"
                      class="bg-white flex-grow-1 border rounded p-2"/>
                <label class="bg-light p-2 text-secondary cursor-pointer rounded border border-light">
                  <input type="file" class="d-none" onChange={sendFile} />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                  </svg>
                </label>
                <button type="submit" class="bg-primary p-2 text-white rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
              )}
            </div>

{/*
            <div class="border-start border-secondary border-2"></div>

            <div class="w-25 d-flex flex-column rounded-3">
              <div class="flex-grow-1">
              </div>
            </div>
*/}


          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
