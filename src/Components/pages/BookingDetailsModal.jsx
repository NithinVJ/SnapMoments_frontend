import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { Calendar, Clock, MapPin, User, Star, DollarSign } from 'react-feather';
import '../Style/BookingDetailsModal.css';

const BookingDetailsModal = ({ show, onHide, booking }) => {
  if (!booking) return null;

  const statusVariants = {
    confirmed: 'success',
    pending: 'warning',
    completed: 'primary'
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Booking Details</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="mb-2">{booking.event}</h4>
            <Badge variant={statusVariants[booking.status] || 'secondary'}>
              {booking.status.toUpperCase()}
            </Badge>
            <p className="text-muted small mt-1">Booking #{booking.id}</p>
          </div>
          <div className="text-right">
            <h5 className="text-primary">{booking.price}</h5>
            <p className="text-muted small">{booking.package}</p>
          </div>
        </div>

        <div className="booking-details">
          <DetailItem icon={<User />} title="Client" value={ <>
                <div>{booking.client}</div>
                <div className="text-muted small">{booking.bookingData.email}</div>
                <div className="text-muted small">{booking.bookingData.phone}</div>
              </>} />
          
          <DetailItem 
            icon={<Calendar />} 
            title="Date & Time" 
            value={
              <>
                <div>{booking.date}</div>
                <div className="text-muted small">{booking.time}</div>
              </>
            } 
          />
          
          <DetailItem icon={<MapPin />} title="Location" value={booking.location} />
          
          {booking.bookingData.notes && (
            <div className="mt-3">
              <h6 className="text-muted">NOTES</h6>
              <p className="text-muted">{booking.bookingData.notes}</p>
            </div>
          )}

          {booking.status === "completed" && (
            <>
              <div className="d-flex align-items-center mt-3">
                <Star className="text-warning mr-2" />
                <span className="mr-3">Rating:</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`mr-1 ${i < (booking.rating || 0) ? "text-warning fill-warning" : "text-muted"}`}
                  />
                ))}
              </div>
              
              <div className="d-flex align-items-center mt-2">
                <DollarSign className="mr-2" />
                <span>Payment:</span>
                <Badge variant={booking.paid ? "success" : "danger"} className="ml-2">
                  {booking.paid ? "Paid" : "Pending"}
                </Badge>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="light" onClick={onHide}>
          Close
        </Button>
        {booking.status === "pending" && (
          <Button variant="primary">
            Accept Booking
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

// Helper component for consistent detail items
const DetailItem = ({ icon, title, value }) => (
  <div className="d-flex mb-3">
    <div className="icon-container mr-3">
      {React.cloneElement(icon, { className: "text-muted" })}
    </div>
    <div>
      <h6 className="text-muted mb-1">{title}</h6>
      <div>{value}</div>
    </div>
  </div>
);

export default BookingDetailsModal;