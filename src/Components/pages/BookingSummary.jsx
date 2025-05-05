import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Style/BookingSummary.css';

function BookingSummary({ bookingData, photographer }) {
  return (
    <div className="booking-summary-container">
      <div className="booking-summary-card shadow rounded-4 p-4">
        <h4 className="text-center mb-4  fw-bold">📸 Booking Summary</h4>

        {/* Photographer Details */}
        <div className="section bg-light-purple">
          <h6 className="section-title"><i className="bi bi-person-vcard me-2"></i>Photographer</h6>
          <p><strong>Name:</strong> {photographer.fullName}</p>
          <p><strong>Location:</strong> {photographer.location}</p>
          <p><strong>Specialty:</strong> {photographer.specialty}</p>
        </div>

        {/* Event Details */}
        <div className="section bg-light-blue mt-3">
          <h6 className="section-title"><i className="bi bi-calendar-event me-2"></i>Event Details</h6>
          <p><strong>Event:</strong> {bookingData.eventType} on {bookingData.eventDate}</p>
          <p><strong>Time:</strong> {bookingData.startTime} - {bookingData.endTime}</p>
          <p><strong>Location:</strong> {bookingData.location}</p>
        </div>

        {/* Package Info */}
        <div className="section bg-light-green mt-3">
          <h6 className="section-title"><i className="bi bi-gift-fill me-2"></i>Package</h6>
          <p><strong>Package Name:</strong> {bookingData.packageName}</p>
          <p><strong>Price:</strong> ₹{bookingData.price}</p>
          <p><strong>Description:</strong> {bookingData.description}</p>
        </div>

        {/* Client Info */}
        <div className="section bg-light-yellow mt-3">
          <h6 className="section-title"><i className="bi bi-person-lines-fill me-2"></i>Client Info</h6>
          <p><strong>Name:</strong> {bookingData.fullName}</p>
          <p><strong>Email:</strong> {bookingData.email}</p>
          <p><strong>Phone:</strong> {bookingData.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
