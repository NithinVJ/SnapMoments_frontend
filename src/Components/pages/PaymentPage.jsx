import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button, Card, Form, Spinner, Alert,
  Row, Col, Tab, Tabs, Modal, Badge
} from 'react-bootstrap';
import {
  ArrowLeft, Check, CreditCard, Shield,
  Calendar, MapPin, Clock, Smartphone, CheckCircle
} from 'react-feather';
import axios from 'axios';
import Lottie from 'react-lottie';
import successAnimation from '../../assets/success-animation.json';
import '../Style/PaymentPage.css';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentType } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(paymentType || 'remaining');
  const [amountToPay, setAmountToPay] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [saveCard, setSaveCard] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'advance_paid', 'fully_paid'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, paidRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
          axios.get(`http://localhost:8080/api/payments/totalPaid/${bookingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
        ]);
        setBooking(bookingRes.data);
        setTotalPaid(paidRes.data || 0);

        // Determine payment status based on amounts
        if (paidRes.data >= bookingRes.data.price) {
          setPaymentStatus('fully_paid');
        } else if (paidRes.data > 0) {
          setPaymentStatus('advance_paid');
        } else {
          setPaymentStatus('pending');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;
    let calculatedAmount = 0;
    if (paymentAmount === 'advance') {
      calculatedAmount = booking.price * 0.3;
    } else if (paymentAmount === 'remaining') {
      calculatedAmount = booking.price - totalPaid;
    } else {
      calculatedAmount = booking.price;
    }
    setAmountToPay(calculatedAmount);
  }, [paymentAmount, booking, totalPaid]);

  useEffect(() => {
    if (!booking || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, booking]);

  const processPayment = async () => {
    setIsProcessing(true);
    setError(null);
    setShowConfirmModal(false);

    try {
      const paymentData = {
        bookingId: booking.id,
        amount: amountToPay,
        paymentMethod,
        paymentType: paymentAmount,
        transactionId: `TXN-${Date.now()}`,
        paymentDetails: JSON.stringify({ 
          cardLast4: '4242', 
          paymentType: paymentAmount,
          saveCard 
        }),
        status: paymentAmount === 'full' ? 'fully_paid' : 
               paymentAmount === 'advance' ? 'advance_paid' : 
               totalPaid + amountToPay >= booking.price ? 'fully_paid' : 'advance_paid',
      };

      const response = await axios.post('http://localhost:8080/api/payments', paymentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      // Update payment status and show success
      const newStatus = paymentAmount === 'full' ? 'fully_paid' : 
                       (totalPaid + amountToPay >= booking.price) ? 'fully_paid' : 'advance_paid';
      
      setPaymentStatus(newStatus);
      setTotalPaid(prev => prev + amountToPay);
      setIsSuccess(true);

    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </Button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5">
        <Alert variant="warning">Booking not found</Alert>
        <Button onClick={() => navigate('/')} variant="secondary">
          Return Home
        </Button>
      </div>
    );
  }

  // If fully paid, show payment confirmation without payment options
  if (paymentStatus === 'fully_paid' && !isSuccess) {
    return (
      <div className="container py-5">
        <Card className="text-center">
          <Card.Body>
            <CheckCircle size={48} className="text-success mb-3" />
            <Card.Title>Payment Completed</Card.Title>
            <Card.Text className="text-muted mb-4">
              Your booking is fully paid with total payment of ₹{booking.price.toLocaleString('en-IN')}
            </Card.Text>

            <div className="payment-details bg-light p-3 rounded mb-4 text-left">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Booking ID</span>
                <span className="font-weight-bold">{booking.bookingCode}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Event</span>
                <span className="font-weight-bold">{booking.eventType}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Photographer</span>
                <span className="font-weight-bold">{booking.photographer?.fullName}</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-100 bg-custom-burgundy border-0"
            >
              Return to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: successAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div className="payment-success-container">
        <Card className="payment-success-card">
          <Card.Body className="text-center">
            <div className="payment-success-animation">
              <Lottie options={defaultOptions} height={120} width={120} />
            </div>
            <Card.Title className="mt-3 mb-2">Payment Successful!</Card.Title>
            <Card.Text className="text-muted mb-4">
              Thank you for your payment of ₹{amountToPay.toLocaleString('en-IN')}
            </Card.Text>
            <Badge 
              variant={paymentStatus === 'fully_paid' ? 'success' : 'warning'}
              className="mb-3"
            >
              {paymentStatus === 'fully_paid' ? 'Fully Paid' : 'Advance Paid'}
            </Badge>

            <div className="payment-details bg-light p-3 rounded mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Booking ID</span>
                <span className="font-weight-bold">{booking.bookingCode}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Event</span>
                <span className="font-weight-bold">{booking.eventType}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Photographer</span>
                <span className="font-weight-bold">{booking.photographer?.fullName}</span>
              </div>
            </div>

            {paymentStatus === 'advance_paid' && (
              <Alert variant="info" className="text-left">
                <strong>Remaining Payment:</strong> ₹{(booking.price - totalPaid).toLocaleString('en-IN')}
              </Alert>
            )}

            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-100 bg-custom-burgundy border-0"
            >
              Return to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="payment-page-container container py-5">
      {isProcessing && (
        <div className="payment-overlay">
          <div className="payment-loading-box text-center">
            <Spinner animation="border" variant="light" />
            <div className="text-white mt-3">Processing your payment...</div>
          </div>
        </div>
      )}

      <Button 
        onClick={() => navigate(-1)} 
        variant="link" 
        className="mb-4 text-custom-burgundy p-0"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Booking
      </Button>

      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="payment-card">
            <Card.Body>
              <Card.Title className="mb-3">Complete Your Payment</Card.Title>
              
              {paymentStatus === 'advance_paid' && (
                <Alert variant="info" className="mb-3">
                  You have already paid ₹{totalPaid.toLocaleString('en-IN')} as advance.
                </Alert>
              )}
              
              <div className="payment-progress mb-4">
                <div className={`progress-step ${paymentAmount === 'advance' ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Advance (30%)</div>
                </div>
                <div className={`progress-step ${paymentAmount === 'remaining' ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Remaining (70%)</div>
                </div>
                <div className={`progress-step ${paymentAmount === 'full' ? 'active' : ''}`}>
                  <div className="step-number">★</div>
                  <div className="step-label">Full Payment</div>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-bold">Payment Amount</Form.Label>
                  <div className="payment-options">
                    <Form.Check
                      type="radio"
                      id="advance"
                      name="paymentAmount"
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>Advance Payment</span>
                          <span className="font-weight-bold text-custom-burgundy">
                            ₹{(booking.price * 0.3).toLocaleString('en-IN')}
                          </span>
                        </div>
                      }
                      checked={paymentAmount === 'advance'}
                      onChange={() => setPaymentAmount('advance')}
                      disabled={paymentStatus === 'advance_paid'}
                    />
                    <Form.Check
                      type="radio"
                      id="remaining"
                      name="paymentAmount"
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>Remaining Payment</span>
                          <span className="font-weight-bold text-custom-burgundy">
                            ₹{(booking.price - totalPaid).toLocaleString('en-IN')}
                          </span>
                        </div>
                      }
                      checked={paymentAmount === 'remaining'}
                      onChange={() => setPaymentAmount('remaining')}
                      disabled={paymentStatus === 'pending'}
                    />
                    <Form.Check
                      type="radio"
                      id="full"
                      name="paymentAmount"
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>Full Payment</span>
                          <span className="font-weight-bold text-custom-burgundy">
                            ₹{booking.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      }
                      checked={paymentAmount === 'full'}
                      onChange={() => setPaymentAmount('full')}
                    />
                  </div>
                </Form.Group>

                <hr className="my-4" />

                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-bold">Payment Method</Form.Label>
                  <Tabs
                    activeKey={paymentMethod}
                    onSelect={(k) => setPaymentMethod(k)}
                    className="mb-3"
                  >
                    <Tab 
                      eventKey="card" 
                      title={
                        <span className="d-flex align-items-center">
                          <CreditCard size={16} className="mr-2" />
                          Card
                        </span>
                      }
                    >
                      <div className="mt-3">
                        <Form.Group className="mb-3">
                          <Form.Label>Name on Card</Form.Label>
                          <Form.Control type="text" placeholder="John Doe" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Card Number</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="1234 5678 9012 3456" 
                            required 
                          />
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Expiry Date</Form.Label>
                              <Form.Control type="text" placeholder="MM/YY" required />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CVV</Form.Label>
                              <Form.Control type="text" placeholder="..." required />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="checkbox" 
                            label="Save this card for future payments" 
                            id="saveCard"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                          />
                        </Form.Group>
                      </div>
                    </Tab>
                    <Tab 
                      eventKey="upi" 
                      title={
                        <span className="d-flex align-items-center">
                          <Smartphone size={16} className="mr-2" />
                          UPI
                        </span>
                      }
                    >
                      <Form.Group className="mt-3">
                        <Form.Label>UPI ID</Form.Label>
                        <Form.Control placeholder="yourname@upi" />
                      </Form.Group>
                    </Tab>
                  </Tabs>
                </Form.Group>

                <div className="security-badge p-3 bg-light rounded mb-4">
                  <div className="d-flex align-items-center">
                    <Shield size={24} className="text-custom-burgundy mr-3" />
                    <div>
                      <h6 className="mb-1">Secure Payment</h6>
                      <small className="text-muted">
                        <Check size={14} className="mr-1" /> 
                        256-bit SSL Encryption
                      </small>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-100 bg-custom-burgundy border-0 py-3"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${amountToPay.toLocaleString('en-IN')}`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="payment-card">
            <Card.Body>
              <Card.Title className="mb-3">Booking Summary</Card.Title>
              
              {timeLeft > 0 && (
                <div className="countdown-banner bg-light p-2 rounded text-center mb-3">
                  <Clock size={16} className="mr-2" />
                  Complete payment in {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')} to secure your booking
                </div>
              )}

              <div className="d-flex align-items-center mb-4">
                <img 
                  src={booking.photographer?.profileImage || "/placeholder-user.jpg"} 
                  alt="Photographer" 
                  className="rounded-circle mr-3" 
                  width={60} 
                  height={60}
                />
                <div>
                  <h6 className="mb-0">{booking.photographer?.fullName}</h6>
                  <small className="text-muted">{booking.photographer?.specialty} Photography</small>
                </div>
              </div>

              <div className="booking-details mb-4">
                <div className="d-flex mb-3">
                  <Calendar size={18} className="text-muted mr-2 mt-1" />
                  <div>
                    <p className="mb-0 font-weight-bold">
                      {new Date(booking.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <small className="text-muted">
                      {booking.startTime} - {booking.endTime}
                    </small>
                  </div>
                </div>
                <div className="d-flex">
                  <MapPin size={18} className="text-muted mr-2 mt-1" />
                  <p className="mb-0">{booking.location}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="payment-breakdown mb-4">
                <h6 className="mb-3">Payment Summary</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Price</span>
                  <span className="font-weight-bold">₹{booking.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount Paid</span>
                  <span className="text-success">₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Remaining Balance</span>
                  <span className="text-danger">₹{(booking.price - totalPaid).toLocaleString('en-IN')}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mt-3 font-weight-bold text-custom-burgundy">
                  <span>
                    {paymentAmount === "advance" ? "Advance Payment" : 
                     paymentAmount === "remaining" ? "Remaining Payment" : "Full Payment"}
                  </span>
                  <span>₹{amountToPay.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="booking-id bg-light p-3 rounded">
                <p className="mb-0 d-flex align-items-center">
                  <Calendar size={16} className="text-custom-burgundy mr-2" />
                  <small>Booking ID: {booking.bookingCode}</small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to pay <strong>₹{amountToPay.toLocaleString('en-IN')}</strong> for:</p>
          <ul className="mb-3">
            <li>{booking.eventType} Photography</li>
            <li>{new Date(booking.eventDate).toLocaleDateString()}</li>
            <li>Photographer: {booking.photographer?.fullName}</li>
          </ul>
          <p className="text-muted small">Payment method: {paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}</p>
          <div className="payment-summary-confirm mt-3">
            <div className="d-flex justify-content-between">
              <span>Total Price:</span>
              <span>₹{booking.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Already Paid:</span>
              <span>₹{totalPaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Remaining After This Payment:</span>
              <span>₹{(booking.price - totalPaid - amountToPay).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={processPayment}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}