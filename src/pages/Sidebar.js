import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListSubheader, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Sidebar = ({ chats, onNewChat, onDeleteChat, drawerOpen, toggleDrawer }) => {
    const navigate = useNavigate();

    const handleNewChat = () => {
        onNewChat();
        const newChatId = chats.length + 1;
        navigate(`/chat/${newChatId}`);
    };

    return (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        LongShotAI
                    </ListSubheader>
                }
            >
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button onClick={toggleDrawer}>
                        <ListItemText primary="Home" sx={{paddingRight:"4vw"}} /></ListItem>
                </Link>
                <ListItem button onClick={handleNewChat}>
                    <ListItemText primary="New Page" />
                </ListItem>
                {chats.map((chat) => (
                    <Grid container key={chat.id} justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Link to={`/chat/${chat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItem button onClick={toggleDrawer}>
                                    <ListItemText primary={`Chat ${chat.id}`} sx={{ paddingRight: '2vw', paddingLeft: '2vw' }} />
                                </ListItem>
                            </Link>
                        </Grid>
                        <Grid item>
                            <IconButton color="secondary" onClick={() => onDeleteChat(chat.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
