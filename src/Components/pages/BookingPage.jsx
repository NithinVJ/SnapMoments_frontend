import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PackageSelection from './PackageSelection';
import EventDetails from './EventDetails';
import UserInfo from './UserInfo';
import BookingSummary from './BookingSummary';
import '../Style/BookingPage.css';
import { useParams, useNavigate } from 'react-router-dom';

function BookingPage() {
  const { id } = useParams(); // photographer ID from URL
  const navigate = useNavigate();

  // Get userId from localStorage safely
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId) : null;

  const [photographer, setPhotographer] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    selectedPackageId: '',
    packageName: '',
    price: 0,
    description: '',
    status: 'pending', // Default status
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    user: { id: userId }, // Important: avoid null here
    photographer: { id: id }
  });

  // Fetch photographer details
  useEffect(() => {
    axios.get(`http://localhost:8080/photographer/${id}`)
      .then(response => {
        setPhotographer(response.data);
        console.log("Photographer details:", response.data);
      })
      .catch(error => console.error("Failed to fetch photographer:", error));
  }, [id]);

  const updateBookingData = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'eventType', 'eventDate', 'startTime', 'endTime',
      'location', 'selectedPackageId', 'fullName', 'email', 'phone'
    ];

    const missingFields = requiredFields.filter(field => !bookingData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!userId) {
      alert("User is not logged in. Please log in to proceed with booking.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/api/bookings', {
        ...bookingData,
        user: { id: userId },
        photographer: { id: id },
        status: 'pending'
      });

      alert('Booking request submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking failed:', error);
      alert(`Booking failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page container-fluid">
      <h2 className="mt-4 fw-bold">Complete Your Booking</h2>
      <p className="text-muted mb-4">You're just a few steps away from securing your photography session.</p>

      <div className="book row">
        <div className="col-lg-8 my-5">
          <div className="card p-4 mb-5">
            <EventDetails bookingData={bookingData} updateBookingData={updateBookingData} />
            <hr />
            <PackageSelection
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              photographer={photographer}
            />
            <hr />
            <UserInfo bookingData={bookingData} updateBookingData={updateBookingData} />
            <div className="text-end mt-3">
              <button
                className="btn btn-primary px-4"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
              <p className="text-muted mt-2 small">
                Your booking will be marked as pending until confirmed by the photographer.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 my-5">
          <div className="booking-summary-wrapper">
            <BookingSummary
              bookingData={bookingData}
              photographer={photographer}
              status="pending"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
