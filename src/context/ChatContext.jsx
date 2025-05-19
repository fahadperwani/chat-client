import { createContext, useContext, useReducer, useEffect } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

const initialState = {
    messages: [],
    isConnected: false,
    socket: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT_SOCKET":
            return { ...state, socket: action.payload, isConnected: true };
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

/**
 * Provides chat context and state management for the chat application.
 * Initializes a Socket.io connection, handles incoming and outgoing messages,
 * and exposes chat state and sendMessage function to children components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 * @returns {JSX.Element} The ChatContext provider with chat state and actions.
 */
export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_URL;
        console.log("url", url);
        // Initialize Socket.io connection
        const socket = io(url, {
            transports: ["websocket"], // Force WebSocket transport
        });

        socket.on("connect", () => {
            dispatch({ type: "INIT_SOCKET", payload: socket });
            dispatch({
                type: "ADD_MESSAGE",
                payload: {
                    text: "Connected to chat!",
                    isBot: true,
                    timestamp: new Date().toISOString(),
                },
            });
        });

        socket.on("message", (message) => {
            console.log(message);
            dispatch({
                type: "ADD_MESSAGE",
                payload: {
                    text: message,
                    isBot: true,
                    timestamp: new Date().toISOString(),
                },
            });
        });

        socket.on("connect_error", (error) => {
            dispatch({ type: "SET_ERROR", payload: "Connection error" });
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const sendMessage = (message) => {
        if (state.socket?.connected) {
            dispatch({
                type: "ADD_MESSAGE",
                payload: {
                    text: message,
                    isBot: false,
                    timestamp: new Date().toISOString(),
                },
            });
            state.socket.emit("message", message);
        }
    };

    return (
        <ChatContext.Provider value={{ ...state, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
