import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Container, InputGroup, FormControl, } from 'react-bootstrap';
import { FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import '../Style/Photographer.css';
import Navigation from './Navigation';
import Footer from './Footer';

const photographersData = [
  {
    name: 'Photographer 7',
    specialty: 'Wedding & Events',
    location: 'New York, NY',
    rating: 4.2,
    image: '/src/assets/wedding.jpg',
  },
  {
    name: 'Photographer 8',
    specialty: 'Portrait & Family',
    location: 'Los Angeles, CA',
    rating: 4.4,
    image: '/src/assets/potrait.jpg',
  },
  {
    name: 'Photographer 9',
    specialty: 'Commercial & Fashion',
    location: 'Chicago, IL',
    rating: 4.6,
    image: '/src/assets/potrait1.jpg',
  },
  {
    name: 'Photographer 10',
    specialty: 'Nature & Wildlife',
    location: 'Denver, CO',
    rating: 4.5,
    image: '/images/photographer1.JPG',
  },
  {
    name: 'Photographer 11',
    specialty: 'Fashion & Beauty',
    location: 'Miami, FL',
    rating: 4.3,
    image:'',
  },
  {
    name: 'Photographer 12',
    specialty: 'Editorial',
    location: 'Austin, TX',
    rating: 4.7,
    image: '/images/photographer3.JPG',
  },
  {
    name: 'Photographer 13',
    specialty: 'Street Photography',
    location: 'Seattle, WA',
    rating: 4.1,
    image: '/images/photographer1.JPG',
  },
  {
    name: 'Photographer 14',
    specialty: 'Studio',
    location: 'Boston, MA',
    rating: 4.8,
    image: '',
  },
  {
    name: 'Photographer 15',
    specialty: 'Candid',
    location: 'San Francisco, CA',
    rating: 4.5,
    image: '/images/photographer3.JPG',
  },
  
];

function Photographer() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredPhotographers = photographersData.filter((photographer) => {
    return (
      photographer.name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty ? photographer.specialty === specialty : true) &&
      (location ? photographer.location === location : true)
    );
  });

  const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
  const currentPhotographers = filteredPhotographers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
    <Navigation />
    <div>
      
      <Container className="py-5">
        <h2 className="text-center fw-bold">Featured Photographers</h2>
        <p className="text-center text-muted mb-4">
          Browse our curated list of professional photographers ready to capture your special moments.
        </p>
      </Container>

      <div className="featured-wrapper">
        <Container>
          <Row className="mb-4">
            <Col md={4} className="mb-2">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search photographers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                <option value="">Specialty</option>
                <option>Wedding & Events</option>
                <option>Portrait & Family</option>
                <option>Commercial & Fashion</option>
                <option>Nature & Wildlife</option>
              </Form.Select>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Location</option>
                <option>New York, NY</option>
                <option>Los Angeles, CA</option>
                <option>Chicago, IL</option>
                <option>Denver, CO</option>
                <option>Miami, FL</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Button className="w-100 btn-maroon">
                <FaFilter className="me-2" /> Filter
              </Button>
            </Col>
          </Row>

          <Row>
            {currentPhotographers.map((photographer, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="shadow photographer-card">
                  {photographer.image ? (
                    <Card.Img
                      variant="top"
                      src={photographer.image}
                      className="photographer-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span className="text-muted">Image Placeholder</span>
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="fw-bold">{photographer.name}</Card.Title>
                    <Card.Text>{photographer.specialty}</Card.Text>
                    <Card.Text className="text-muted">
                      <i className="bi bi-geo-alt"></i> {photographer.location}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        <FaStar className="text-warning" /> {photographer.rating}
                      </span>
                      <Button className="btn-maroon btn-sm">View Portfolio</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="pagination-wrapper">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                className={`me-2 ${index + 1 === currentPage ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Container>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Photographer;
