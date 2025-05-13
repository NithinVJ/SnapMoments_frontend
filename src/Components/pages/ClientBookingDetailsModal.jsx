import React from 'react';
import { Modal } from 'react-bootstrap';
import { 
  Calendar, Clock, MapPin, User, Star,
  CreditCard, MessageSquare, CheckCircle
} from 'react-feather';

const ClientBookingDetailsModal = ({ show, onHide, booking }) => {
  if (!booking) return null;

  const handlePaymentClick = (booking, paymentType) => {
    // Navigate to payment page with booking details and payment type
    navigate(`/dashboard/payment`, {
      state: {
        booking,
        paymentType // 'advance' or 'remaining'
      }
    });
  };
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{booking.event} Booking Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="row">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Booking Information</h5>
                
                <div className="d-flex align-items-start mb-3">
                  <Calendar size={18} className="text-custom-burgundy mt-1 me-3" />
                  <div>
                    <h6 className="fw-medium mb-1">Date</h6>
                    <p className="text-muted mb-0">{booking.date}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <Clock size={18} className="text-custom-burgundy mt-1 me-3" />
                  <div>
                    <h6 className="fw-medium mb-1">Time Slot</h6>
                    <p className="text-muted mb-0">{booking.time}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <MapPin size={18} className="text-custom-burgundy mt-1 me-3" />
                  <div>
                    <h6 className="fw-medium mb-1">Location</h6>
                    <p className="text-muted mb-0">{booking.location}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <CreditCard size={18} className="text-custom-burgundy mt-1 me-3" />
                  <div>
                    <h6 className="fw-medium mb-1">Package</h6>
                    <p className="text-muted mb-0">{booking.package} ({booking.price})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Photographer Details</h5>
                
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src={booking.photographerImage} 
                    alt={booking.photographer} 
                    className="rounded-circle me-3" 
                    width="60" 
                    height="60" 
                  />
                  <div>
                    <h6 className="fw-bold mb-1">{booking.photographer}</h6>
                    <div className="d-flex align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < 5 ? "text-warning fill-warning" : "text-muted"} me-1`}
                        />
                      ))}
                      <span className="text-muted ms-1">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <CheckCircle size={18} className="text-success mt-1 me-3" />
                  <div>
                    <h6 className="fw-medium mb-1">Booking Status</h6>
                    <span className={`badge ${
                      booking.status === "confirmed" ? "bg-success-light text-success" :
                      booking.status === "pending" ? "bg-warning-light text-warning" :
                      "bg-primary-light text-primary"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <button className="btn btn-custom-burgundy w-100 mb-2">
                    <MessageSquare size={16} className="me-2" />
                    Message Photographer
                  </button>
                  {booking.status === "confirmed" && (
                    <button className="btn btn-outline-secondary w-100">
                      <CreditCard size={16} className="me-2" onClick={() => handlePaymentClick(booking, 'remaining')} />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClientBookingDetailsModal;