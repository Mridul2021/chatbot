import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    List,
    useMediaQuery,
    useTheme,
    ListItem,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Chat = ({ chatId, onSendMessage }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load chat messages from localStorage
        const storedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || [];
        setMessages(storedMessages);
    }, [chatId]);

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '') {

            try {
                setLoading(true);

                // Update state with user's input message and save to localStorage
                setMessages((prevMessages) => {
                    const updatedUserMessage = { text: `You: ${inputMessage}` };
                    const updatedMessages = [...prevMessages, updatedUserMessage];
                    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));
                    return updatedMessages;
                });

                // Send POST request to the API
                const response = await axios.post(
                    'https://api-v2.longshot.ai/custom/api/generate/instruct',
                    {
                        text: inputMessage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer 6cfa62ab4dbe973e26dbc831f6e2863bf99b67ed`,
                        },
                    }
                );

                // Update state with the response message and save to localStorage
                const responseMessage = "LongShotAI: " + response.data.copies[0].content;
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, { text: responseMessage }];
                    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false);
            }

            setInputMessage('');
        }

    };
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const boxHeight = isSmallScreen ? '80vh' : '90vh';
    const boxStyle = {
        marginTop: '1vh',
        marginLeft: '2.5vw',
        paddingLeft: '40px',
        paddingRight: '30px',
        width: '70vw',
        height: boxHeight,
        borderRadius: 7,
        boxShadow: 5,
        borderColor: '#263238',
        bgcolor: '#FFFF',
        position: 'relative',
    };
    return (
        <Box
            style={boxStyle}
        >
            <Typography variant="h5" align="center" paddingTop="4vh">
                Ask Me Anything
            </Typography>
            <List style={{ maxHeight: "58vh", overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={msg.text} />
                    </ListItem>
                ))}
            </List>
            <div style={{ position: 'absolute', bottom: 15, left: 0, right: 0, display: 'flex', marginTop: 16, marginLeft: "40px", marginRight: "40px" }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                            setInputMessage('');
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSendMessage}
                    style={{ marginLeft: 8 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Send'}
                </Button>
            </div>
        </Box>
    );
};

export default Chat;
