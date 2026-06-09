import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { chatAPI } from '../services/api';
import ChatWindow from './ChatWindow';

const ChatList = ({ currentUser }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    fetchRooms();
    fetchUnreadCount();
    
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchRooms = async () => {
    try {
      const { data } = await chatAPI.getRooms();
      setRooms(data.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };
  
  const fetchUnreadCount = async () => {
    try {
      const { data } = await chatAPI.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };
  
  const handleOpenChat = (room) => {
    setActiveRoom(room);
    setIsOpen(true);
  };
  
  const otherParticipant = (room) => {
    return room.participants?.find(p => p._id !== currentUser._id);
  };
  
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition z-50"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Chat Panel */}
      {isOpen && !activeRoom && (
        <div className="fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50">
          <div className="flex justify-between items-center p-3 bg-primary text-white rounded-t-xl">
            <span className="font-semibold">Messages</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              rooms.map((room) => {
                const participant = otherParticipant(room);
                return (
                  <button
                    key={room._id}
                    onClick={() => handleOpenChat(room)}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b dark:border-gray-700"
                  >
                    <div className="font-semibold">{participant?.name}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {room.lastMessage?.text || 'No messages yet'}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      
      {/* Active Chat Window */}
      {activeRoom && (
        <ChatWindow
          room={activeRoom}
          currentUser={currentUser}
          onClose={() => {
            setActiveRoom(null);
            setIsOpen(false);
          }}
          onMinimize={() => setActiveRoom(null)}
        />
      )}
    </>
  );
};

export default ChatList;