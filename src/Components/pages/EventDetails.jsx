import React from 'react';
import { Form } from 'react-bootstrap';

function EventDetails({ bookingData, updateBookingData }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h4 className="fw-bold mb-4">Event Details</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Event Type</Form.Label>
          <Form.Select 
            value={bookingData.eventType}
            onChange={(e) => updateBookingData('eventType', e.target.value)}
            required
          >
            <option value="">Select event type</option>
            <option value="Wedding Photography">Wedding Photography</option>
            <option value="Engagement Photography">Engagement Photography</option>
            <option value="Portrait Photography">Portrait Photography</option>
            <option value="Family Photography">Family Photography</option>
            <option value="Event Photography">Event Photography</option>
            <option value="Nature Photography">Nature Photography</option>
            <option value="Wildlife Photography">Wildlife Photography</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Date</Form.Label>
          <Form.Control
            type="date"
            min={today}
            value={bookingData.eventDate}
            onChange={(e) => updateBookingData('eventDate', e.target.value)}
            required
          />
        </Form.Group>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={bookingData.startTime}
                onChange={(e) => updateBookingData('startTime', e.target.value)}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={bookingData.endTime}
                onChange={(e) => updateBookingData('endTime', e.target.value)}
                required
              />
            </Form.Group>
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Venue name and address"
            value={bookingData.location}
            onChange={(e) => updateBookingData('location', e.target.value)}
            required
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default EventDetails;