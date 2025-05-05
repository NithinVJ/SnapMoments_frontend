import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, X, Check, MapPin, Calendar, DollarSign } from 'react-feather';

const PortfolioEditModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [photographer, setPhotographer] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: '',
    location: '',
    bio: '',
    tags: [],
    pricingPlans: []
  });
  const [newTag, setNewTag] = useState('');
  const [newPricingPlan, setNewPricingPlan] = useState({
    title: '',
    price: '',
    details: '',
    popular: false
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/photographer/${id}`);
        setPhotographer(response.data);
        setFormData({
          fullName: response.data.fullName,
          specialty: response.data.specialty,
          location: response.data.location,
          bio: response.data.bio,
          tags: [...response.data.tags],
          pricingPlans: [...response.data.pricingPlans]
        });
        setAvailabilityDates([...response.data.availabilityDates]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photographer:", error);
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [id]);

  const handleClose = () => {
    setShow(false);
    navigate(-1); // Go back to previous page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAvailability = (status) => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setAvailabilityDates(prev => [
        ...prev,
        { date: dateStr, status }
      ]);
      setSelectedDate(null);
    }
  };

  const handleRemoveAvailability = (dateToRemove) => {
    setAvailabilityDates(prev => 
      prev.filter(avail => avail.date !== dateToRemove)
    );
  };

  const handleAddPricingPlan = () => {
    if (newPricingPlan.title && newPricingPlan.price) {
      setFormData(prev => ({
        ...prev,
        pricingPlans: [...prev.pricingPlans, newPricingPlan]
      }));
      setNewPricingPlan({
        title: '',
        price: '',
        details: '',
        popular: false
      });
    }
  };

  const handleRemovePricingPlan = (index) => {
    setFormData(prev => {
      const updatedPlans = [...prev.pricingPlans];
      updatedPlans.splice(index, 1);
      return { ...prev, pricingPlans: updatedPlans };
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        availabilityDates,
        id // Ensure the ID is included
      };

      const formDataToSend = new FormData();
      formDataToSend.append("photographer", JSON.stringify(updatedData));
      
      images.forEach(image => {
        formDataToSend.append("images", image);
      });

      await axios.put(
        `http://localhost:8080/photographer/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      handleClose();
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Portfolio</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Your Portfolio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select specialty</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Event">Event</option>
                  <option value="Commercial">Commercial</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button
                    variant="outline-primary"
                    className="ms-2"
                    onClick={handleAddTag}
                    type="button"
                  >
                    Add
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="badge bg-primary d-flex align-items-center">
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => handleRemoveTag(tag)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <div className="d-flex mb-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    className="form-control"
                    placeholderText="Select date"
                  />
                  <Button
                    variant="outline-success"
                    className="ms-2"
                    onClick={() => handleAddAvailability("Available")}
                    type="button"
                    disabled={!selectedDate}
                  >
                    Add Available
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleAddAvailability("Booked")}
                    type="button"
                    disabled={!selectedDate}
                  >
                    Add Booked
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {availabilityDates.map((avail, index) => (
                    <span
                      key={index}
                      className={`badge d-flex align-items-center ${
                        avail.status === "Available" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {avail.date} ({avail.status})
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => handleRemoveAvailability(avail.date)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h5>Pricing Plans</h5>
              <div className="border p-3 rounded">
                <Row className="mb-3 g-3">
                  <Col md={3}>
                    <Form.Control
                      placeholder="Title"
                      value={newPricingPlan.title}
                      onChange={(e) =>
                        setNewPricingPlan({ ...newPricingPlan, title: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      placeholder="Price"
                      value={newPricingPlan.price}
                      onChange={(e) =>
                        setNewPricingPlan({ ...newPricingPlan, price: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      placeholder="Details"
                      value={newPricingPlan.details}
                      onChange={(e) =>
                        setNewPricingPlan({ ...newPricingPlan, details: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={1} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      label="Popular"
                      checked={newPricingPlan.popular}
                      onChange={(e) =>
                        setNewPricingPlan({ ...newPricingPlan, popular: e.target.checked })
                      }
                    />
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="primary"
                      onClick={handleAddPricingPlan}
                      type="button"
                      disabled={!newPricingPlan.title || !newPricingPlan.price}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>

                {formData.pricingPlans.map((plan, index) => (
                  <Row key={index} className="mb-2 g-3 align-items-center">
                    <Col md={3}>
                      <Form.Control plaintext readOnly value={plan.title} />
                    </Col>
                    <Col md={2}>
                      <Form.Control plaintext readOnly value={plan.price} />
                    </Col>
                    <Col md={5}>
                      <Form.Control plaintext readOnly value={plan.details} />
                    </Col>
                    <Col md={1}>
                      {plan.popular && <span className="badge bg-warning">Popular</span>}
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemovePricingPlan(index)}
                        type="button"
                      >
                        <X size={16} />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Update Portfolio Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  Select new images to replace existing ones (optional)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PortfolioEditModal;