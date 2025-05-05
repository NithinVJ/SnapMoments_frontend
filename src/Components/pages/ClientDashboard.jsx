import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Calendar, Clock, MapPin, User,
  CreditCard, MessageSquare, FileText, Search,
  Bell, ChevronRight, Star, Download, Filter
} from 'react-feather';
import '../Style/ClientDashboard.css';
import BookingDetailsModal from '../pages/ClientBookingDetailsModal';
import ChatModal from '../pages/ChatModal';


export default function ClientDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [photographer, setPhotographer] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/bookings/user/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();

        // Process bookings into upcoming and past
        const now = new Date();
        const upcoming = [];
        const past = [];

        data.forEach(booking => {
          const bookingDate = new Date(`${booking.eventDate}T${booking.startTime}`);
          if (bookingDate > now) {
            upcoming.push(formatBooking(booking));
          } else {
            past.push(formatBooking(booking, true));
          }
        });

        setUpcomingBookings(upcoming);
        setPastBookings(past);

        // Mock notifications
        setNotifications([
          {
            id: 1,
            title: "Booking Confirmed",
            message: `Your ${upcoming[0]?.eventType || 'photography'} booking has been confirmed.`,
            time: "2 hours ago",
            read: false,
          },
          {
            id: 2,
            title: "Payment Reminder",
            message: "Final payment for your session is due in 3 days.",
            time: "1 day ago",
            read: true,
          }
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleMessagePhotographer = (booking) => {
    const photographerDetails = booking.photographerDetails;
    setPhotographer({
      token: "photog_" + photographerDetails.id,
      name: photographerDetails.fullName || photographerDetails.name,
      role: "PHOTOGRAPHER"
    });
    setCurrentBooking(booking); // store the full booking object
    setCurrentBookingId(booking.id); // optional
    setShowChat(true);
  };


  const formatBooking = (booking, isPast = false) => {
    const formatted = {
      id: booking.bookingCode,
      event: booking.eventType,
      photographer: booking.photographer.fullName,
      photographerImage: booking.photographer.imageUrls?.[0] || "/src/assets/potrait1.jpg",
      date: new Date(booking.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: `${booking.startTime} - ${booking.endTime}`,
      location: booking.location,
      package: booking.packageName,
      status: booking.status.toLowerCase(),
      price: `₹${booking.price.toLocaleString('en-IN')}`,
      photographerDetails: booking.photographer
    };

    if (isPast) {
      formatted.rating = Math.floor(Math.random() * 5) + 1;
    }

    return formatted;
  };

  function HandleLogout() {
    navigate("/");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
  }

  if (loading) {
    return (
      <div className="min-vh-100 bg-custom-lightblue d-flex justify-content-center align-items-center">
        <div className="spinner-border text-custom-burgundy" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-custom-lightblue d-flex justify-content-center align-items-center">
        <div className="alert alert-danger">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  // Calculate total spent
  const totalSpent = pastBookings.reduce((sum, booking) => {
    return sum + parseFloat(booking.price.replace(/[^0-9.-]+/g, ""));
  }, 0);

  return (
    <div className="min-vh-100 bg-custom-lightblue">
      <header className="bg-white shadow-sm">
        <div className="container px-4 py-4 d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <Camera className="text-custom-burgundy me-2" size={24} />
            <span className="text-custom-burgundy fs-4 fw-bold">SnapMoments</span>
          </Link>

          <div className="d-flex align-items-center gap-4">
            <div className="position-relative d-none d-md-block">
              <Search className="position-absolute left-3 top-50 translate-middle-y" size={16} />
              <input
                type="text"
                placeholder="Search photographers or events..."
                className="form-control ps-5"
                style={{ width: '256px' }}
              />
            </div>

            <div className="position-relative">
              <button
                className="btn p-2 rounded-circle hover-bg-gray"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="position-absolute top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                  2
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
                  <div className="overflow-auto" style={{ maxHeight: '384px', zIndex: '999' }}>
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
                  alt="Client"
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">My Account</h6></li>
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

      <main className="container px-4 py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
          <div>
            <h1 className="fs-3 fw-bold mb-1">Welcome, {localStorage.getItem("userName") || 'User'}!</h1>
            <p className="text-muted mb-0">Manage your photography bookings and appointments</p>
          </div>
          <button className="btn btn-custom-burgundy mt-3 mt-md-0">
            <Calendar size={16} className="me-2" />
            Book New Session
          </button>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">Upcoming Bookings</h6>
                <h3 className="fw-bold">{upcomingBookings.length}</h3>
                <p className="text-muted fs-sm mb-0">
                  {upcomingBookings.length > 0
                    ? `Next: ${upcomingBookings[0].event} on ${upcomingBookings[0].date}`
                    : 'No upcoming bookings'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
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
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted fs-sm mb-2">Total Spent</h6>
                <h3 className="fw-bold">₹{totalSpent.toLocaleString('en-IN')}</h3>
                <p className="text-muted fs-sm mb-0">
                  Across {pastBookings.length} photography session{pastBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <ul className="nav nav-tabs border-0">
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
                  className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                  onClick={() => setActiveTab('past')}
                >
                  Past Bookings
                </button>
              </li>
            </ul>
            <button className="btn btn-outline-secondary d-none d-md-flex">
              <Filter size={16} className="me-2" />
              Filter
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <div className="row g-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="col-12">
                    <div className="card overflow-hidden">
                      <div className="row g-0">
                        <div className="col-md-3 bg-custom-lightblue-10 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="fw-bold mb-2">{booking.event}</h5>
                            <span className={`badge ${booking.status === "confirmed" ? "bg-success-light text-success" :
                              booking.status === "pending" ? "bg-warning-light text-warning" :
                                "bg-primary-light text-primary"
                              }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                                  src={booking.photographerImage} 
                                  alt={booking.photographer} 
                                  className="rounded-circle" 
                                  width="40" 
                                  height="40" 
                                /> */}
                                <div>
                                  <p className="fw-medium mb-0">Photographer: {booking.photographer}</p>
                                  <div className="d-flex align-items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={12}
                                        className={`${i < 5 ? "text-warning fill-warning" : "text-muted"}`}
                                      />
                                    ))}
                                    <span className="text-muted fs-xs ms-1">5.0</span>
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
                              {booking.status === "confirmed" && (
                                <button className="btn btn-custom-burgundy">
                                  Complete Payment
                                </button>
                              )}
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleMessagePhotographer(booking)}
                              >
                                <MessageSquare size={16} className="me-2" />
                                Message Photographer
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
                  <Calendar size={48} className="text-muted mb-4" />
                  <h3 className="fs-5 fw-medium mb-2">No upcoming bookings</h3>
                  <p className="text-muted mb-4">You don't have any photography sessions scheduled.</p>
                  <button className="btn btn-custom-burgundy">
                    Book a Photographer
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="row g-4">
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
                                  src={booking.photographerImage} 
                                  alt={booking.photographer} 
                                  className="rounded-circle" 
                                  width="40" 
                                  height="40" 
                                /> */}
                                <div>
                                  <p className="fw-medium mb-0">Photographer: {booking.photographer}</p>
                                  <div className="d-flex align-items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={12}
                                        className={`${i < booking.rating ? "text-warning fill-warning" : "text-muted"}`}
                                      />
                                    ))}
                                    <span className="text-muted fs-xs ms-1">{booking.rating}.0</span>
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
                              <button className="btn btn-custom-burgundy">
                                <Download size={16} className="me-2" />
                                Download Photos
                              </button>
                              {!booking.rating && (
                                <button className="btn btn-outline-secondary">
                                  <Star size={16} className="me-2" />
                                  Leave Review
                                </button>
                              )}
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
                  <button className="btn btn-custom-burgundy">
                    Book Your First Session
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fs-4 fw-bold mb-0">Recommended Photographers</h2>
            <button className="btn btn-link p-0 text-custom-burgundy">
              View All
              <ChevronRight size={16} className="ms-1" />
            </button>
          </div>
          <div className="row g-4">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="col-sm-6 col-lg-4">
                <div className="card h-100 overflow-hidden">
                  <div className="ratio ratio-16x9">
                    {/* <img 
                      src={booking.photographerImage} 
                      alt={booking.photographer} 
                      className="object-fit-cover" 
                    /> */}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0">{booking.photographer}</h5>
                      <div className="d-flex align-items-center">
                        <Star size={16} className="text-warning fill-warning" />
                        <span className="ms-1 fw-medium fs-sm">5.0</span>
                      </div>
                    </div>
                    <p className="text-muted mb-3">{booking.photographerDetails?.specialty || 'Photography Specialist'}</p>
                    <button className="btn btn-custom-burgundy w-100">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <Camera size={24} className="text-custom-lightblue me-2" />
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

      {photographer && (
        <ChatModal
          show={showChat}
          onHide={() => setShowChat(false)}
          currentUserToken={localStorage.getItem('authToken') || `user_${userId}`}
          currentUserName={localStorage.getItem('userName') || 'User'}
          currentUserRole="CLIENT"
          recipientToken={photographer.token}
          recipientName={photographer.name}
          recipientRole={photographer.role}
          bookingId={currentBooking?.id || "booking123"}
          booking={currentBooking} // ← Add this
        />
      )}

    </div>
  );
}