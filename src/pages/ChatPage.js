import React from 'react';
import { Container } from '@mui/material';

const ChatPage = ({ children }) => {
  return (
    <Container component="main">
      {children}
    </Container>
  );
};

export default ChatPage;
