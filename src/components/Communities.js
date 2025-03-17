import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/general.css';

const MAX_FILE_SIZE = 1048576; // 1MB in bytes

const Communities = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !file) return;

    let fileURL = null;
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds the 1MB limit.');
        return;
      }
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
    setFileError('');
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

  const textareaStyles = {
    backgroundColor: isTextareaFocused || newMessage ? 'transparent' : 'white',
    color: newMessage ? 'white' : 'rgb(215, 169, 255)',
    border: '1px solid rgba(215, 169, 255, 0.2)',
    borderRadius: '8px',
    resize: 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="d-flex with-nav">

      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4 overflow-auto">

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
              onFocus={() => setIsTextareaFocused(true)}
              onBlur={() => setIsTextareaFocused(false)}
              placeholder="Type your message here..."
              style={textareaStyles}
            ></textarea>
          </div>
          <div className="mb-2">
            <input
              type="file"
              className="form-control"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileError('');
              }}
            />
            {fileError && <div className="text-danger">{fileError}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Communities;
