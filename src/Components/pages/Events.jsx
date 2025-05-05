import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/Events.css';
import Navigation from './Navigation';
import Footer from './Footer';

const eventsData = [
  {
    title: 'Wedding Photography Workshop',
    date: 'June 15, 2025',
    location: 'New York, NY',
    price: '$299',
    type: 'Workshop',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
  {
    title: 'Portrait Photography Masterclass',
    date: 'July 22, 2025',
    location: 'Los Angeles, CA',
    price: '$199',
    type: 'Masterclass',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
  {
    title: 'Commercial Photography Essentials',
    date: 'August 10, 2025',
    location: 'Chicago, IL',
    price: '$249',
    type: 'Workshop',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
  {
    title: 'Wedding Photography Workshop',
    date: 'June 15, 2025',
    location: 'New York, NY',
    price: '$299',
    type: 'Workshop',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
  {
    title: 'Portrait Photography Masterclass',
    date: 'July 22, 2025',
    location: 'Los Angeles, CA',
    price: '$199',
    type: 'Masterclass',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
  {
    title: 'Commercial Photography Essentials',
    date: 'August 10, 2025',
    location: 'Chicago, IL',
    price: '$249',
    type: 'Workshop',
    description: 'Learn professional photography techniques from industry experts in this hands-on workshop.'
  },
];

const Events = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (type === '' || event.type === type) &&
    (location === '' || event.location.toLowerCase().includes(location.toLowerCase()))
  );

  return (
    <>
    
    <div className="events-page">
      <div className="text-center py-5">
        <h2 className="fw-bold">Upcoming Events</h2>
        <p className="text-muted">Browse our upcoming photography events, workshops, and classes to enhance your skills or find the perfect photographer for your event.</p>
      </div>
    </div>
    <div className='featured-wrapper'>
      <div className="container bg-white p-3 rounded shadow-sm mb-4 search-bar">
        <div className="row g-2">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Event Type</option>
              <option value="Workshop">Workshop</option>
              <option value="Masterclass">Masterclass</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-maroon w-100"><i className="bi bi-funnel-fill"></i> Filter</button>
          </div>
        </div>
      </div>
    
      <div className="container ">
        {filteredEvents.map((event, index) => (
          <div className="row mb-4 bg-white p-3 rounded shadow-sm" key={index}>
            <div className="col-md-3 placeholder-img"></div>
            <div className="col-md-9 d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h5 className="fw-bold">{event.title}</h5>
                <p className="mb-1 text-muted"><i className="bi bi-calendar-event me-2"></i>{event.date}</p>
                <p className="mb-2 text-muted"><i className="bi bi-geo-alt me-2"></i>{event.location}</p>
                <p>{event.description}</p>
              </div>
              <div className="text-end">
                <h5 className="text-danger fw-bold">{event.price}</h5>
                <button className="btn btn-maroon">Book Now</button>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className="page-item"><button className="page-link">&laquo;</button></li>
            <li className="page-item active"><button className="page-link">1</button></li>
            <li className="page-item"><button className="page-link">2</button></li>
            <li className="page-item"><button className="page-link">3</button></li>
            <li className="page-item"><button className="page-link">&raquo;</button></li>
          </ul>
        </nav>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Events;
