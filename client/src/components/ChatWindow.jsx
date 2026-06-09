import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { chatAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';

const ChatWindow = ({ room, currentUser, onClose, onMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const { joinChatRoom, leaveChatRoom, sendMessage, sendTyping, onNewMessage, onUserTyping } = useSocket();

  useEffect(() => {
    fetchMessages();
    joinChatRoom(room._id);
    
    const unsubscribeNewMessage = onNewMessage((data) => {
      if (data.roomId === room._id) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    
    const unsubscribeTyping = onUserTyping((data) => {
      if (data.roomId === room._id) {
        setUserTyping(data.isTyping ? data.userName : null);
      }
    });
    
    return () => {
      leaveChatRoom(room._id);
      unsubscribeNewMessage();
      unsubscribeTyping();
    };
  }, [room._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await chatAPI.getMessages(room._id);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageData = {
      roomId: room._id,
      message: newMessage,
      senderId: currentUser._id,
      senderType: currentUser.role === 'restaurant' ? 'restaurant' : 'customer',
    };
    
    sendMessage(messageData);
    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      sendTyping(room._id, true, currentUser.name);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      sendTyping(room._id, false, currentUser.name);
    }
  };

  const otherParticipant = room.participants?.find(p => p._id !== currentUser._id);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50">
        <div className="flex justify-between items-center p-3 bg-primary text-white rounded-t-xl">
          <span className="font-semibold">Chat with {otherParticipant?.name}</span>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(false)}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-3 text-center text-gray-500">
          {room.lastMessage?.text || 'No messages yet'}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-primary text-white rounded-t-xl">
        <div>
          <span className="font-semibold">Chat with {otherParticipant?.name}</span>
          <p className="text-xs opacity-90">Online</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(true)}>
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg ${
                  msg.senderId === currentUser._id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        {userTyping && (
          <div className="text-xs text-gray-500 italic">
            {userTyping} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-primary dark:bg-gray-700"
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;