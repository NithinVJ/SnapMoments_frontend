import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { Send } from 'react-feather';
import '../Style/ChatModal.css';

const ChatModal = ({
    show,
    onHide,
    bookingId,
    currentUserToken,
    currentUserName,
    currentUserRole,
    recipientToken,
    recipientName,
    recipientRole
}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Setup WebSocket connection when modal opens
    useEffect(() => {
        if (!show || socketRef.current) return;

        const ws = new WebSocket(`ws://localhost:8080/ws/chat?token=${currentUserToken}`);

        ws.onopen = () => {
            console.log('✅ WebSocket Connected');
            socketRef.current = ws;
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        };

        ws.onclose = () => {
            console.log('❌ WebSocket Disconnected');
            socketRef.current = null;
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [show, currentUserToken]);

    // Close WebSocket when modal closes
    useEffect(() => {
        if (!show && socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    }, [show]);

    // Fetch chat history when modal opens
    useEffect(() => {
        if (show) {
            fetchChatHistory();
            markMessagesAsRead();
        }
    }, [show, bookingId]);

    // Poll every 5 seconds if no socket and modal is open
    useEffect(() => {
        if (!socketRef.current && show) {
            const intervalId = setInterval(() => {
                fetchChatHistory();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [show, bookingId]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChatHistory = async () => {
        if (!bookingId && !recipientToken) return;
        try {
            if (!loading) setLoading(true);

            const url = bookingId
                ? `http://localhost:8080/api/chat/history/${bookingId}`
                : `http://localhost:8080/api/chat/direct/${recipientToken}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: localStorage.getItem('authToken')
                }
            });

            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching chat history:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const markMessagesAsRead = async () => {
        if (!bookingId) return;
        try {
            await fetch(`http://localhost:8080/api/chat/mark-read/${bookingId}`, {
                method: 'PUT',
                headers: {
                    Authorization: localStorage.getItem('authToken')
                }
            });
            console.log(`📩 Marked messages as read for booking ${bookingId}`);
        } catch (err) {
            console.error('Failed to mark messages as read:', err.message);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const requestBody = {
            bookingId,
            senderToken: currentUserToken,
            senderName: currentUserName,
            senderRole: currentUserRole,
            recipientToken,
            recipientName,
            recipientRole,
            content: newMessage
        };

        try {
            const response = await fetch('http://localhost:8080/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('authToken')
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error('Failed to send message');
            const sentMessage = await response.json();

            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err.message);
            setError(err.message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Chat with {recipientName} ({recipientRole})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="chat-container">
                        <div
                            className="chat-messages"
                            style={{
                                height: '400px',
                                overflowY: 'auto',
                                marginBottom: '20px',
                                borderBottom: '1px solid #eee',
                                paddingBottom: '10px'
                            }}
                        >
                            {messages.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-3 d-flex ${
                                            message.senderToken === currentUserToken
                                                ? 'justify-content-end'
                                                : 'justify-content-start'
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-3 ${
                                                message.senderToken === currentUserToken
                                                    ? 'bg-primary text-white'
                                                    : 'bg-light'
                                            }`}
                                            style={{ maxWidth: '70%' }}
                                        >
                                            <div className="fw-bold mb-1">
                                                {message.senderName}
                                            </div>
                                            <div>{message.content}</div>
                                            <div className="text-end small mt-1">
                                                {new Date(message.timestamp).toLocaleString([], {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <Form onSubmit={sendMessage}>
                            <div className="d-flex">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="ms-2"
                                    style={{ height: 'fit-content' }}
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ChatModal;
