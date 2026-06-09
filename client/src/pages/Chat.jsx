import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatAPI } from '../services/api';
import ChatWindow from '../components/ChatWindow';
import { MessageCircle, X } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRooms();
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

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

  const otherParticipant = (room) => {
    return room.participants?.find(p => p._id !== user?._id);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start a chat by contacting a restaurant about your order</p>
            </div>
          ) : (
            <div>
              {rooms.map((room) => {
                const participant = otherParticipant(room);
                return (
                  <button
                    key={room._id}
                    onClick={() => {
                      setActiveRoom(room);
                      setIsOpen(true);
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{participant?.name}</div>
                        <div className="text-sm text-gray-500 mt-1 truncate">
                          {room.lastMessage?.text || 'No messages yet'}
                        </div>
                      </div>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window Modal */}
      {activeRoom && isOpen && (
        <ChatWindow
          room={activeRoom}
          currentUser={user}
          onClose={() => {
            setActiveRoom(null);
            setIsOpen(false);
          }}
          onMinimize={() => setActiveRoom(null)}
        />
      )}
    </div>
  );
};

export default Chat;