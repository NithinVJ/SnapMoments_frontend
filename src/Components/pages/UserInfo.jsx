import React from 'react';
import { Form } from 'react-bootstrap';

function UserInfo({ bookingData, updateBookingData }) {
  return (
    <div>
      <h4 className="fw-bold mb-4">Your Information</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={bookingData.fullName}
            onChange={(e) => updateBookingData('fullName', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={bookingData.email}
            onChange={(e) => updateBookingData('email', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="+91 1234567890"
            value={bookingData.phone}
            onChange={(e) => updateBookingData('phone', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Special Requests</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Any special requirements or notes for the photographer..."
            value={bookingData.notes}
            onChange={(e) => updateBookingData('notes', e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default UserInfo;