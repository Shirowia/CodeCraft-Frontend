import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Communities = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => doc.data());
      setMessages(messages);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !file) return;

    let fileURL = null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        fileURL = reader.result;
        await addMessage(fileURL);
      };
      reader.readAsDataURL(file);
    } else {
      await addMessage(fileURL);
    }
  };

  const addMessage = async (fileURL) => {
    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: new Date(),
      user: user.displayName || 'Anonymous',
      fileURL,
    });

    setNewMessage('');
    setFile(null);
    scrollToBottom();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="d-flex vh-100">
      <div className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? 'd-block' : 'd-none'}`} style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skilltree">Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/communities">Communities</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <button className="btn btn-primary mb-3" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
        <h2>Community Chat</h2>
        <hr />
        <div ref={chatContainerRef} className="chat-container bg-dark text-white p-3 shadow-sm" style={{ height: '60vh', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <strong>{message.user}</strong>: {message.text}
              {message.fileURL && (
                <div>
                  {message.fileURL.startsWith('data:image') ? (
                    <img src={message.fileURL} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  ) : (
                    <a href={message.fileURL} target="_blank" rel="noopener noreferrer">View File</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="mt-3">
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
            ></textarea>
          </div>
          <div className="mb-2">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Communities;
