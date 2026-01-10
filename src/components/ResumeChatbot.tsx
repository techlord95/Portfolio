'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './ResumeChatbot.module.css';
import { FaCommentDots, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../context/ChatContext';

export default function ResumeChatbot() {
  const { isOpen, setIsOpen, messages, setMessages, addMessage, isLoading, setIsLoading } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    addMessage({ role: 'user', text: userMessage });
    setIsLoading(true);

    try {
      const currentHistory = [...messages, { role: 'user', text: userMessage } as const];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage, 
          history: currentHistory.slice(0, -1) 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Add a placeholder message for streaming
      addMessage({ role: 'model', text: '' });

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedText += chunkValue;

        // Update the last message (which is the model response being streamed)
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = accumulatedText;
          }
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaRobot color="#4f46e5" />
              <h3 className={styles.title}>Chat with Rasmalai</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              <FaTimes />
            </button>
          </div>
          
          <div className={styles.messages} ref={messagesEndRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                {msg.role === 'model' ? (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && <div className={styles.typing}>Typing...</div>}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Rasmalai..."
              className={styles.input}
              rows={1}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} className={styles.sendButton}>
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        {isOpen ? <FaTimes className={styles.toggleButtonIcon} /> : <FaCommentDots className={styles.toggleButtonIcon} />}
      </button>

      {!isOpen && (
        <div className={styles.ctaLabel} onClick={() => setIsOpen(true)}>
          <p className={styles.ctaText}>Need AI Assistance?</p>
          <p className={styles.ctaSubText}>Chat with Rasmalai</p>
          <div className={styles.caret} />
        </div>
      )}
    </div>
  );
}
