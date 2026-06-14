import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2, User, Clock, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { chatAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { MessageCircle } from 'lucide-react';

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
      <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-t-xl cursor-pointer" onClick={() => setIsMinimized(false)}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Chat with {otherParticipant?.name?.split(' ')[0]}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:bg-white/20 rounded p-1 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-3 text-center text-gray-500 text-sm">
          {room.lastMessage?.text || 'No messages yet'}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Chat with {otherParticipant?.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(true)} className="hover:bg-white/20 rounded p-1 transition">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.senderId === currentUser._id;
            return (
              <div
                key={idx}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-400'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                    {isOwnMessage && <CheckCheck className="w-3 h-3 ml-1" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {userTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-500 ml-1">{userTyping} is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-primary to-secondary text-white p-2 rounded-full hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 w-10 h-10 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;