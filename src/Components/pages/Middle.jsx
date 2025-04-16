import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Camera, CalendarEvent, StarFill, Calendar, GeoAlt } from "react-bootstrap-icons";
import "../Style/Middle.css";
import AOS from 'aos';


function Middle() {
  // const photographers = [
  //   { name: "Alex Johnson",specialty: "Wedding Photography",rating: 4.9,reviews: 124,location: "New York, NY",tags: ["Wedding", "Portrait", "Event"],},
  //   { name: "Sam Rivera",specialty: "Portrait Photography",rating: 4.8,reviews: 98,location: "Los Angeles, CA",tags: ["Portrait", "Fashion", "Studio"],},
  //   { name: "Taylor Kim",specialty: "Event Photography",rating: 4.7, reviews: 87,location: "Chicago, IL",tags: ["Event", "Corporate", "Concert"],},
  // ];

 
  const photographers = [
    { id: 1, name: "John Doe", specialty: "Wedding & Portrait Specialist", rating: 4.8 },
    { id: 2, name: "John Doe", specialty: "Wedding & Portrait Specialist", rating: 4.8 },
    { id: 3, name: "John Doe", specialty: "Wedding & Portrait Specialist", rating: 4.8 }
  ]

  const events = [
    { id: 1,title: "Wedding Photography Workshop", date: "June 15, 2025", location: "Coimbatore, NY", description: "Learn professional wedding photography techniques from industry experts.",},
    { id: 2, title: "Potrait Photography Workshop", date: "July 15, 2025", location: "Chennai, NY", description: "Learn professional potrait photography techniques from industry experts.",},
  ];

  const steps = [
    { icon: <Search size={28} color="#7c0a19" />, title: "Search", description: "Find photographers based on your event type, location, and date."},
    { icon: <Camera size={28} color="#7c0a19" />, title: "Connect",description: "Browse portfolios and connect with photographers that match your style."},
    {icon: <CalendarEvent size={28} color="#7c0a19" />,title: "Book", description: "Secure your booking with our simple payment process and enjoy your event."}
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Wedding Client',
      message: 'The photographer we found through SnapMoments was amazing! They captured every special moment of our wedding day perfectly.',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Wedding Client',
      message: 'The photographer we found through SnapMoments was amazing! They captured every special moment of our wedding day perfectly.',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Wedding Client',
      message: 'The photographer we found through SnapMoments was amazing! They captured every special moment of our wedding day perfectly.',
    },
  ];
  return (
    <>
    <div className="how-it-works-section py-5">
      <div className="container" data-aos="fade-up">
        <h2 className="text-center fw-bold mb-5">How SnapMoments Works</h2>
        <div className="row justify-content-center">
          {steps.map((step, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm p-4 h-100 text-center border-0">
                <div className="icon-wrapper mx-auto mb-3">
                  {step.icon}
                </div>
                <h5 className="fw-bold mb-2">{step.title}</h5>
                <p className="text-muted mb-0">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


    <div className="container my-5 font-poppins" data-aos="fade-up">
      <div className="d-flex justify-content-between align-items-center mb-4" >
        <h3 className="fw-bold">Featured Photographers</h3>
        <a href="#" className="text-maroon text-decoration-none fw-semibold">View All</a>
      </div>
      <div className="row">
        {photographers.map((photographer) => (
          <div className="col-md-4 mb-4" key={photographer.id}>
            <div className="card shadow-sm border-0 rounded-4">
              <div className="placeholder-image rounded-top"></div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 fw-semibold">{photographer.name}</h5>
                  <div className="text-warning d-flex align-items-center">
                    <StarFill className="me-1" />
                    <span>{photographer.rating}</span>
                  </div>
                </div>
                <p className="text-muted mb-3">{photographer.specialty}</p>
                <button className="btn btn-maroon w-100 rounded-3">View Portfolio</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


    <div className="upcoming-section py-5 font-poppins">
      <div className="container" data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Upcoming Events</h3>
          <a href="#" className="text-maroon fw-semibold text-decoration-none">View All</a>
        </div>
        <div className="row">
          {events.map(event => (
            <div className="col-md-6 mb-4" key={event.id}>
              <div className="card event-card shadow-sm border-0 rounded-4 d-flex flex-row">
                <div className="event-image rounded-start"></div>
                <div className="card-body">
                  <h5 className="fw-bold">{event.title}</h5>
                  <div className="text-muted mb-2">
                    <div><Calendar className="me-2" />{event.date}</div>
                    <div><GeoAlt className="me-2" />{event.location}</div>
                  </div>
                  <p className="text-muted">{event.description}</p>
                  <button className="btn btn-maroon">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="testimonials-section py-5 font-poppins">
      <div className="container" data-aos="fade-up">
        <h3 className="fw-bold text-center mb-5">What Our Clients Say</h3>
        <div className="row">
          {testimonials.map((testimonial) => (
            <div className="col-md-4 mb-4" key={testimonial.id}>
              <div className="testimonial-card p-4 shadow-sm rounded-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar me-3"></div>
                  <div>
                    <div className="fw-semibold">{testimonial.name}</div>
                    <div className="text-muted small">{testimonial.role}</div>
                  </div>
                </div>
                <p className="testimonial-message text-muted mb-0">
                  "{testimonial.message}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="cta-section font-poppins" >
      <div className="container text-center py-5">
        <h3 className="text-white fw-semibold mb-3">
          Ready to Capture Your Special Moments?
        </h3>
        <p className="text-white mb-4">
          Join SnapMoments today and connect with professional photographers for your next event.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="btn btn-light rounded-3 fw-medium">SignUp Now</button>
          <input
            type="email"
            placeholder="Your Email"
            className="form-control cta-input"
          />
        </div>
      </div>
    </div>
    </>
  );
}

export default Middle;
