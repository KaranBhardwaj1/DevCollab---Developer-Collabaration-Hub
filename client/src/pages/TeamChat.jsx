import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = "https://devcollab-developer-collabaration-hub.onrender.com/";

const TeamChat = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [connected, setConnected] = useState(false);

  // Load old messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.get(
          `/messages/projects/${id}`
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.error(
          error.response?.data?.message ||
            error.message
        );
      }
    };

    loadMessages();
  }, [id]);

  // Connect Socket.io
  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);

      socket.emit("join_project", id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("receive_message", (newMessage) => {
      setMessages((previous) => [
        ...previous,
        newMessage,
      ]);
    });

    socket.on("user_typing", (data) => {
      if (data.userId !== user?.id) {
        setTypingUser(
          data.isTyping ? data.userId : null
        );
      }
    });

    socket.on("chat_error", (data) => {
      console.error(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, token, user?.id]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    socketRef.current?.emit("send_message", {
      projectId: id,
      content: message,
      type: "text",
    });

    setMessage("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;

    setMessage(value);

    socketRef.current?.emit("typing", {
      projectId: id,
      isTyping: value.length > 0,
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div>
          <h1 className="font-semibold">
            💬 Team Chat
          </h1>

          <p className="text-xs text-slate-500">
            Private project conversation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              connected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          {connected
            ? "Connected"
            : "Disconnected"}
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">

        {messages.length === 0 && (
          <div className="py-20 text-center text-sm text-slate-400">
            No messages yet. Start the conversation.
          </div>
        )}

        {messages.map((item) => {
          const isMine =
            item.sender?._id === user?.id;

          return (
            <div
              key={item._id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isMine
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="mb-1 text-xs font-semibold opacity-70">
                  {item.sender?.name}
                </p>

                <p className="whitespace-pre-wrap text-sm">
                  {item.content}
                </p>

                <p className="mt-1 text-[10px] opacity-50">
                  {new Date(
                    item.createdAt
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        {typingUser && (
          <p className="text-xs italic text-slate-400">
            Someone is typing...
          </p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex gap-3 border-t border-slate-200 p-4"
      >
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Write a message..."
          className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Send
        </button>
      </form>

    </div>
  );
};

export default TeamChat;
