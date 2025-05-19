import { Paper, Typography } from "@mui/material";

/**
 * Message component displays a single chat message
 * with a timestamp and adjusts its background and
 * text color depending on whether the message is
 * from the user or the bot. The component also
 * adjusts its border radius to make it look like
 * a chat bubble.
 *
 * @param {{ isBot: boolean, text: string, timestamp: string }} message
 * @returns {JSX.Element}
 */
const Message = ({ message }) => {
    return (
        <Paper
            sx={{
                p: 2,
                bgcolor: message.isBot ? "#f0f0f0" : "#1976d2",
                color: message.isBot ? "#000" : "#fff",
                maxWidth: "70%",
                borderRadius: message.isBot
                    ? "20px 20px 20px 5px"
                    : "20px 20px 5px 20px",
            }}
        >
            <Typography variant="body1">{message.text}</Typography>
            <Typography
                variant="caption"
                sx={{
                    display: "block",
                    mt: 1,
                    color: message.isBot ? "#666" : "#e0e0e0",
                }}
            >
                {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
        </Paper>
    );
};

export default Message;
