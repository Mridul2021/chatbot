// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Sidebar from './pages/Sidebar';
import ChatPage from './pages/ChatPage';
import Chat from './pages/Chat';

import ListIcon from '@mui/icons-material/List';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Load chats from localStorage when the component mounts
    const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    setChats(storedChats);
  }, []);

  const saveChatsToLocalStorage = (updatedChats) => {
    // Save updated chats to localStorage
    localStorage.setItem('chats', JSON.stringify(updatedChats));
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSendMessage = (chatId, message) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    saveChatsToLocalStorage(updatedChats);
  };

  const handleNewChat = () => {
    const highestChatId = chats.reduce((maxId, chat) => Math.max(maxId, chat.id), 0);
    const newChat = {
      id: highestChatId + 1,
      messages: [],
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChatsToLocalStorage(updatedChats);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    saveChatsToLocalStorage(updatedChats);

    // Optionally, you can clear the localStorage for the deleted chat
    localStorage.removeItem(`chat_${chatId}`);

    // Check if the current page is deleted
    const currentPath = window.location.pathname;
    if (currentPath === `/chat/${chatId}`) {
      // If the current page is deleted, navigate to the last remaining chat page
      if (updatedChats.length > 0) {
        const lastChatId = updatedChats[updatedChats.length - 1].id;
        window.location.href = `/chat/${lastChatId}`;
      } else {
        // If there are no remaining chat pages, navigate to the home page
        window.location.href = '/';
      }
    }
  };

  return (
    <Router>
    <Button
          onClick={toggleDrawer}
          disableTouchRipple
          style={{ padding: 0, minWidth: 0 }}
        >
          <ListIcon sx={{width:"5vh", height:'5vh'}} />
        </Button>
      <div style={{ display: 'flex' }}>
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ChatPage sx>
                <Typography variant="h3" align="center" style={{ marginTop: '40vh' }}>
                  Welcome to LongShotAI, Your personal AI Assistant
                </Typography>
                <Typography variant="h5" align="center" style={{ marginTop: '2vh' }}>
                  click on the top left icon to use the features
                </Typography>
              </ChatPage>
            }
          />
         
          {chats.map((chat) => (
            <Route
              path={`/chat/${chat.id}`}
              element={
                <ChatPage >
                  <Chat chatId={chat.id} onSendMessage={handleSendMessage}/>
                </ChatPage>
              }
              key={chat.id}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
