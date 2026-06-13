import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatAPI, orderAPI } from '../services/api';
import ChatWindow from '../components/ChatWindow';
import { MessageCircle, ArrowLeft, Users } from 'lucide-react';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    if (user) {
      fetchRooms();
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (orderId && user && !activeRoom) {
      createOrGetChatRoom(orderId);
    }
  }, [orderId, user]);

  const fetchRooms = async () => {
    try {
      const { data } = await chatAPI.getRooms();
      setRooms(data.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
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

  const createOrGetChatRoom = async (orderId) => {
    setCreatingRoom(true);
    try {
      const { data } = await chatAPI.createRoomForOrder(orderId);
      if (data.success && data.room) {
        setActiveRoom(data.room);
        await fetchRooms();
      }
    } catch (error) {
      console.error('Failed to create/get chat room:', error);
    } finally {
      setCreatingRoom(false);
    }
  };

  const otherParticipant = (room) => {
    return room.participants?.find(p => p._id !== user?._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {rooms.length} conversation{rooms.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Creating Room Loader */}
        {creatingRoom && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Starting conversation...</p>
          </div>
        )}

        {/* Chat Rooms List */}
        {!activeRoom && !creatingRoom && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {rooms.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No conversations yet</h3>
                <p className="text-gray-500">Start a chat by contacting a restaurant about your order</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {rooms.map((room) => {
                  const participant = otherParticipant(room);
                  const unread = room.unreadCount || 0;
                  return (
                    <button
                      key={room._id}
                      onClick={() => setActiveRoom(room)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {participant?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white">{participant?.name}</div>
                            <div className="text-sm text-gray-500 mt-0.5 truncate max-w-[200px]">
                              {room.lastMessage?.text || 'No messages yet'}
                            </div>
                          </div>
                          <div className="text-right">
                            {unread > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      {activeRoom && (
        <ChatWindow
          room={activeRoom}
          currentUser={user}
          onClose={() => {
            setActiveRoom(null);
            fetchRooms();
            fetchUnreadCount();
          }}
          onMinimize={() => setActiveRoom(null)}
        />
      )}
    </div>
  );
};

export default Chat;