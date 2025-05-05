import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import '../Style/Photographer.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function Photographer() {
  const [photographers, setPhotographers] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/photographer/all')
      .then(response => {
        setPhotographers(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching photographers:', error));
  }, []);

  const filteredPhotographers = photographers.filter(photographer => {
    const name = photographer.fullName;
    const spec = photographer.specialty;
    const loc = photographer.location;

    return (
      name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty ? spec === specialty : true) &&
      (location ? loc === location : true)
    );
  });

  const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
  const currentPhotographers = filteredPhotographers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      
      <div className="py-5 container-fluid">
       
          <h2 className="text-center fw-bold">Featured Photographers</h2>
          <p className="text-center text-muted mb-4">
            Browse our curated list of professional photographers ready to capture your special moments.
          </p>

        <div>
          {/* Filters */}
          <Row className="mb-4">
            <Col md={4} className="mb-2">
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
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
                <option>Wedding </option>
                <option>Portrait </option>
                <option>Event</option>
                <option>Studio</option>
              </Form.Select>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Location</option>
                <option>Kanyakumari</option>
                <option>Parasala</option>
                <option>Choozhal</option>
                <option>Aralvaimozhi</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Button className="w-100 btn-maroon">
                <FaFilter className="me-2" /> Filter
              </Button>
            </Col>
          </Row>

          {/* Cards */}
          <Row>
            {currentPhotographers.map((photographer, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="shadow photographer-card">
                  {photographer.imageUrls && photographer.imageUrls.length > 0 ? (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080/uploads/${photographer.imageUrls[0]}`}
                      className="photographer-image"
                    />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                  <Card.Body>
                    <Card.Title className="fw-bold">{photographer.fullName || 'No Name'}</Card.Title>
                    <Card.Text>{photographer.specialty || 'N/A'}</Card.Text>
                    <Card.Text className="text-muted">
                      <i className="bi bi-geo-alt"></i> {photographer.location || 'Unknown'}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        <FaStar className="text-warning" /> {photographer.rating || 'N/A'}
                      </span>
                      <Button
                        className="btn-maroon btn-sm"
                        onClick={() => navigate(`/photographerportfolio/${photographer.id}`)}
                      >
                        View Portfolio
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="pagination-wrapper mt-4 text-center">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                className={`me-2 ${index + 1 === currentPage ? 'btn-maroon' : 'btn-outline-secondary'}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          </div>
        
      </div>
      <Footer />
    </>
  );
}

export default Photographer;
