import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera, Calendar, Clock, MapPin, User,
  MessageSquare, FileText, Search,
  Bell, Star, Filter, CheckCircle,
  XCircle, Settings, BarChart,
  DollarSign, Users, Edit, Plus, Upload
} from "react-feather";
import "../Style/PhotographerDashboard.css";
import axios from "axios";
import BookingDetailsModal from './BookingDetailsModal';
import ChatModal from '../pages/ChatModal'

export default function PhotographerDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [photographerDetails, setPhotographerDetails] = useState(null);
  const [profileExists, setProfileExists] = useState(true);
  const navigate = useNavigate();
  const photographerId = localStorage.getItem("photographerId");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [client, setClient] = useState(null);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  function HandleLogout() {
    localStorage.removeItem("photographerId");
    localStorage.removeItem("photographerName");
    localStorage.removeItem("photographerEmail");
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  const parseBookingDate = (eventDate, startTime) => {
    try {
      const timePart = startTime ? startTime : '00:00';
      return new Date(`${eventDate}T${timePart}`);
    } catch (e) {
      console.warn('Failed to parse date:', e);
      return new Date();
    }
  };





  const formatBooking = (booking) => {
    return {
      id: booking.bookingCode,
      event: booking.eventType,
      client: booking.fullName || `${booking.user?.firstName} ${booking.user?.lastName}`,
      clientImage: "/placeholder.svg?height=50&width=50&text=" +
        (booking.fullName ? booking.fullName.charAt(0) : 'C'),
      date: booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Date not specified',
      time: booking.startTime && booking.endTime
        ? `${booking.startTime} - ${booking.endTime}`
        : 'Time not specified',
      location: booking.location || 'Location not specified',
      package: booking.packageName || booking.selectedPackageId,
      status: booking.status ? booking.status.toLowerCase() : 'unknown',
      price: booking.price ? `₹${booking.price.toLocaleString('en-IN')}` : 'Price not specified',
      clientDetails: booking.user,
      photographerDetails: booking.photographer,
      bookingData: booking
    };
  };

  const handleMessageClient = (clientDetails, bookingId) => {
    if (!clientDetails || !clientDetails.id) {
      console.error("Invalid client details");
      return;
    }

    setClient({
      token: "user_" + clientDetails.id,
      name: `${clientDetails.firstName} ${clientDetails.lastName}`,
      role: "CLIENT"
    });

    setCurrentBookingId(bookingId);
    setShowChat(true);
  };
  const fetchPhotographerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch photographer details first
      const photographerResponse = await axios.get(
        `http://localhost:8080/photographer/by-user/${photographerId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      ).catch(err => {
        if (err.response?.status === 404) {
          setProfileExists(false);
          return null;
        }
        throw err;
      });

      if (!photographerResponse) {
        setLoading(false);
        return;
      }

      setPhotographerDetails(photographerResponse.data);
      setProfileExists(true);

      // Then fetch bookings using photographer's ID
      const bookingsResponse = await axios.get(
        `http://localhost:8080/api/bookings/photographer/${photographerResponse.data.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      const now = new Date();
      const upcoming = [];
      const past = [];

      bookingsResponse.data.forEach(booking => {
        const bookingDate = parseBookingDate(booking.eventDate, booking.startTime);
        const formattedBooking = formatBooking(booking);

        if (bookingDate > now) {
          upcoming.push(formattedBooking);
        } else {
          past.push(formattedBooking);
        }
      });

      setUpcomingBookings(upcoming);
      setPastBookings(past);

      setNotifications([
        {
          id: 1,
          title: "New Booking Request",
          message: `You have ${upcoming.filter(b => b.status === 'pending').length} pending requests`,
          time: "Today",
          read: false,
        }
      ]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (photographerId) {
      fetchPhotographerData();
    }
  }, [photographerId]);

  const handleProfileCreated = () => {
    fetchPhotographerData();
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      setUpcomingBookings(upcomingBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/decline`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      setUpcomingBookings(upcomingBookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleMarkAsPaid = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/mark-paid`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      setPastBookings(pastBookings.map(booking =>
        booking.id === bookingId ? { ...booking, paid: true } : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Calculate stats
  const confirmedBookings = upcomingBookings.filter(b => b.status === 'confirmed');
  const pendingBookings = upcomingBookings.filter(b => b.status === 'pending');
  const totalEarnings = pastBookings.reduce((sum, booking) => {
    return sum + parseFloat(booking.price.replace(/[^0-9.-]+/g, "") || 0);
  }, 0);
  const averageRating = pastBookings.length > 0
    ? (pastBookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / pastBookings.length).toFixed(1)
    : 0;

  const handleCreateProfileClick = () => {
    navigate("/portfolio");
  };

  if (!profileExists) {
    return (
      <div className="photographer-dashboard d-flex justify-content-center align-items-center">
        <div className="text-center p-4">
          <Camera size={48} className="text-custom-burgundy mb-3" />
          <h3>Photographer Profile Not Found</h3>
          <p className="mb-4">You need to create a photographer profile to access the dashboard</p>
          <button
            className="btn btn-custom-burgundy"
            onClick={handleCreateProfileClick}
          >
            Create Photographer Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="photographer-dashboard d-flex justify-content-center align-items-center">
        <div className="spinner-border text-custom-burgundy" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photographer-dashboard d-flex justify-content-center align-items-center">
        <div className="alert alert-danger">
          Error loading dashboard: {error}
          <button className="btn btn-link" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="photographer-dashboard">
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <Camera className="text-custom-burgundy me-2" />
            <span className="text-custom-burgundy fw-bold">SnapMoments</span>
          </Link>

          <div className="d-flex align-items-center">
            <div className="d-none d-md-block position-relative me-3">
              <Search className="position-absolute top-50 translate-middle-y ms-3" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="form-control ps-5"
                style={{ width: '250px' }}
              />
            </div>

            <div className="position-relative me-3">
              <button
                className="btn p-2 rounded-circle hover-bg-gray"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell />
                <span className="position-absolute top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>

              {showNotifications && (
                <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg z-10" style={{ width: '320px' }}>
                  <div className="p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Notifications</h5>
                      <button className="btn btn-link p-0 text-custom-burgundy fs-sm">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="overflow-auto" style={{ maxHeight: '384px', zIndex: '1050' }}>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-bottom ${!notification.read ? 'bg-custom-lightblue-10' : ''}`}
                      >
                        <div className="d-flex justify-content-between">
                          <h6 className="fw-medium fs-sm mb-0">{notification.title}</h6>
                          <span className="text-muted fs-xs">{notification.time}</span>
                        </div>
                        <p className="text-muted fs-sm mt-1 mb-0">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button className="btn btn-link p-0 text-custom-burgundy fs-sm">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="dropdown">
              <button className="btn p-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                <img
                  src="/src/assets/potrait1.jpg"
                  alt="Photographer"
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">My Account</h6></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item">
                    <User className="me-2" size={16} />
                    Profile
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={HandleLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div>
            <h1 className="fs-3 fw-bold mb-1">{localStorage.getItem("photographerName")} Photographer </h1>
            <p className="text-muted mb-0">Manage your bookings, schedule, and earnings</p>
          </div>
          <div className="mt-3 mt-md-0">
            <button className="btn btn-outline-secondary me-2">
              <Calendar className="me-2" size={16} />
              Update Availability
            </button>
            {photographerDetails && (
              <button
                className="btn btn-custom-burgundy ms-2"
                onClick={() => navigate(`/portfolio/edit/${photographerDetails.id}`)}
              >
                <Edit className="me-2" size={16} />
                Edit Portfolio
              </button>
            )}
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">Upcoming Bookings</h6>
                <h3 className="fw-bold">{confirmedBookings.length}</h3>
                <p className="text-muted fs-sm mb-0">
                  {confirmedBookings.length > 0
                    ? `Next: ${confirmedBookings[0].event} on ${confirmedBookings[0].date}`
                    : 'No upcoming bookings'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">Completed Sessions</h6>
                <h3 className="fw-bold">{pastBookings.length}</h3>
                <p className="text-muted fs-sm mb-0">
                  {pastBookings.length > 0
                    ? `Last: ${pastBookings[0].event} on ${pastBookings[0].date}`
                    : 'No past bookings'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">This Month's Earnings</h6>
                <h3 className="fw-bold">₹{totalEarnings.toLocaleString('en-IN')}</h3>
                <p className="text-success fs-sm mb-0">
                  <span className="badge bg-success-light text-success">↑ 18.7%</span> from last month
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">Average Rating</h6>
                <h3 className="fw-bold">{averageRating}</h3>
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(averageRating) ? "text-warning fill-warning" : "text-muted"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Bookings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Requests
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past Bookings
              </button>
            </li>
          </ul>

          {activeTab === 'upcoming' && (
            <div className="row g-4 mt-2">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((booking) => (
                  <div key={booking.id} className="col-12">
                    <div className="card overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-3 bg-custom-lightblue-10 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="fw-bold mb-2">{booking.event}</h5>
                            <span className="badge bg-success-light text-success">
                              Confirmed
                            </span>
                            <p className="text-muted fs-sm mt-3 mb-0">Booking #{booking.id}</p>
                          </div>
                          <div className="mt-3 mt-md-0">
                            <h4 className="fw-bold text-custom-burgundy">{booking.price}</h4>
                            <p className="text-muted fs-sm mb-0">{booking.package}</p>
                          </div>
                        </div>
                        <div className="col-md-9 p-4">
                          <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-3 mb-4">
                                {/* <img
                                  src={booking.clientImage}
                                  alt={booking.client}
                                  className="rounded-circle"
                                  width="40"
                                  height="40"
                                /> */}
                                <div>
                                  <p className="fw-medium mb-0">Client: {booking.client}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2 mb-3">
                                <Calendar size={16} className="mt-1" />
                                <div>
                                  <p className="fw-medium mb-0">{booking.date}</p>
                                  <p className="text-muted fs-sm mb-0">{booking.time}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2">
                                <MapPin size={16} className="mt-1" />
                                <p className="mb-0">{booking.location}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleMessageClient(booking.clientDetails, booking.id)}
                              >
                                <MessageSquare size={16} className="me-2" />
                                Message Client
                              </button>

                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <FileText size={16} className="me-2" />
                                View Details
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeclineBooking(booking.id)}
                              >
                                <XCircle size={16} className="me-2" />
                                Cancel Booking
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <Calendar size={48} className="text-muted mb-4" />
                  <h3 className="fs-5 fw-medium mb-2">No upcoming bookings</h3>
                  <p className="text-muted mb-4">You don't have any confirmed photography sessions scheduled.</p>
                  <button className="btn btn-custom-burgundy">
                    Update Availability
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="row g-4 mt-2">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => (
                  <div key={booking.id} className="col-12">
                    <div className="card overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-3 bg-custom-lightblue-10 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="fw-bold mb-2">{booking.event}</h5>
                            <span className="badge bg-warning-light text-warning">
                              Pending
                            </span>
                            <p className="text-muted fs-sm mt-3 mb-0">Booking #{booking.id}</p>
                          </div>
                          <div className="mt-3 mt-md-0">
                            <h4 className="fw-bold text-custom-burgundy">{booking.price}</h4>
                            <p className="text-muted fs-sm mb-0">{booking.package}</p>
                          </div>
                        </div>
                        <div className="col-md-9 p-4">
                          <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-3 mb-4">
                                {/* <img
                                  src={booking.clientImage}
                                  alt={booking.client}
                                  className="rounded-circle"
                                  width="40"
                                  height="40"
                                /> */}
                                <div>
                                  <p className="fw-medium mb-0">Client: {booking.client}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2 mb-3">
                                <Calendar size={16} className="mt-1" />
                                <div>
                                  <p className="fw-medium mb-0">{booking.date}</p>
                                  <p className="text-muted fs-sm mb-0">{booking.time}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2">
                                <MapPin size={16} className="mt-1" />
                                <p className="mb-0">{booking.location}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                              <button
                                className="btn btn-custom-burgundy"
                                onClick={() => handleAcceptBooking(booking.id)}
                              >
                                <CheckCircle size={16} className="me-2" />
                                Accept Booking
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleMessageClient(booking.clientDetails, booking.id)}
                              >
                                <MessageSquare size={16} className="me-2" />
                                Message Client
                              </button>


                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeclineBooking(booking.id)}
                              >
                                <XCircle size={16} className="me-2" />
                                Decline Booking
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <Clock size={48} className="text-muted mb-4" />
                  <h3 className="fs-5 fw-medium mb-2">No pending requests</h3>
                  <p className="text-muted mb-4">You don't have any pending booking requests at the moment.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="row g-4 mt-2">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <div key={booking.id} className="col-12">
                    <div className="card overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-3 bg-custom-lightblue-10 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="fw-bold mb-2">{booking.event}</h5>
                            <span className="badge bg-secondary-light text-secondary">
                              Completed
                            </span>
                            <p className="text-muted fs-sm mt-3 mb-0">Booking #{booking.id}</p>
                          </div>
                          <div className="mt-3 mt-md-0">
                            <h4 className="fw-bold text-custom-burgundy">{booking.price}</h4>
                            <p className="text-muted fs-sm mb-0">{booking.package}</p>
                          </div>
                        </div>
                        <div className="col-md-9 p-4">
                          <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-3 mb-4">
                                {/* <img
                                  src={booking.clientImage}
                                  alt={booking.client}
                                  className="rounded-circle"
                                  width="40"
                                  height="40"
                                /> */}
                                <div>
                                  <p className="fw-medium mb-0">Client: {booking.client}</p>
                                  <div className="d-flex align-items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={12}
                                        className={`${i < (booking.rating || 0) ? "text-warning fill-warning" : "text-muted"}`}
                                      />
                                    ))}
                                    <span className="text-muted fs-xs ms-1">{booking.rating || 0}.0</span>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2 mb-3">
                                <Calendar size={16} className="mt-1" />
                                <div>
                                  <p className="fw-medium mb-0">{booking.date}</p>
                                  <p className="text-muted fs-sm mb-0">{booking.time}</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start gap-2">
                                <MapPin size={16} className="mt-1" />
                                <p className="mb-0">{booking.location}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                              {!booking.paid && (
                                <button
                                  className="btn btn-custom-burgundy"
                                  onClick={() => handleMarkAsPaid(booking.id)}
                                >
                                  <DollarSign size={16} className="me-2" />
                                  Mark as Paid
                                </button>
                              )}
                              <button className="btn btn-outline-secondary">
                                <Upload size={16} className="me-2" />
                                Upload Photos
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <FileText size={16} className="me-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <Clock size={48} className="text-muted mb-4" />
                  <h3 className="fs-5 fw-medium mb-2">No past bookings</h3>
                  <p className="text-muted mb-4">You haven't completed any photography sessions yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <Camera className="text-custom-lightblue me-2" />
              <span className="fs-4 fw-bold text-white">SnapMoments</span>
            </div>
            <div className="d-flex gap-4">
              <Link to="/terms" className="text-gray-400 hover-text-white fs-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover-text-white fs-sm">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-gray-400 hover-text-white fs-sm">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400 fs-sm">
            <p className="mb-0">&copy; {new Date().getFullYear()} SnapMoments. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {selectedBooking && (
        <BookingDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          booking={selectedBooking}
        />
      )}

      {client && (
        <ChatModal
          show={showChat}
          onHide={() => setShowChat(false)}
          currentUserToken={localStorage.getItem('authToken') || `photog_${photographerId}`}
          currentUserName={localStorage.getItem('photographerName') || 'Photographer'}
          currentUserRole="PHOTOGRAPHER"
          recipientToken={client.token}
          recipientName={client.name}
          recipientRole={client.role}
          bookingId={currentBookingId} // Now using the actual booking ID
        />
      )}


    </div>
  );
}