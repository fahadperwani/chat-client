import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import {
    Box,
    TextField,
    IconButton,
    Paper,
    List,
    ListItem,
} from "@mui/material";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";

// ChatInterface component provides a user interface for a chat application
// It utilizes the useChat context to manage messages and sending functionality
// The component handles message input, submission, and automatic scrolling

const ChatInterface = () => {
    // Access messages and sendMessage function from chat context
    const { messages, sendMessage } = useChat();

    // State for managing the current input value
    const [input, setInput] = useState("");

    // Ref to keep track of the end of the messages list for scrolling
    const messagesEndRef = useRef(null);

    // Function to scroll to the bottom of the messages list
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Trigger scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle form submission to send a message
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            // Ensure input is not empty or whitespace
            sendMessage(input.trim());
            setInput(""); // Clear input field after sending
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{ height: "80vh", display: "flex", flexDirection: "column" }}
        >
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                justifyContent: message.isBot
                                    ? "flex-start" // Align bot messages to the left
                                    : "flex-end", // Align user messages to the right
                                my: 1,
                            }}
                        >
                            <Message message={message} />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 2, borderTop: "1px solid #ddd" }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton type="submit" color="primary">
                                <SendIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ChatInterface;
