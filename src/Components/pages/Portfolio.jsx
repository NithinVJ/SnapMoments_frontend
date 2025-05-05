import React, { useState } from 'react';
import '../Style/Portfolio.css';
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Portfolio() {
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const photographerId=localStorage.getItem("photographerId")

  const navigate=useNavigate()
  // Calendar
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendar, setCalendar] = useState([]);

  const handleAddDate = (status) => {
    if (selectedDate) {
      setCalendar([...calendar, { date: selectedDate.toISOString().split('T')[0], status }]);
      setSelectedDate(null);
    }
  };

  // Pricing Plans
  const [pricingPlans, setPricingPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ title: "", price: "", details: "", popular: false });

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleAddPlan = () => {
    if (newPlan.title && newPlan.price && newPlan.details) {
      setPricingPlans([...pricingPlans, newPlan]);
      setNewPlan({ title: "", price: "", details: "", popular: false });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const portfolioData = {
      fullName,
      specialty,
      location,
      bio,
      tags,
      pricingPlans,
      availabilityDates: calendar,
      user: { id: photographerId },

    };

    const formData = new FormData();
    formData.append("portfolio", new Blob([JSON.stringify(portfolioData)], { type: "application/json" }));

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await axios.post("http://localhost:8080/photographer/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Portfolio created successfully!");
      navigate("/photodashboard?refresh=true")
      console.log(response)
    } catch (err) {
      console.error(err);
      alert("Failed to create portfolio");
    }
  };

  return (
    <div className="portfolio-background">
      <Container className="portfolio-form">
        <h2 className="text-center">Create Your Portfolio</h2>
        <p className="text-center text-muted">Showcase your photography skills and attract potential clients</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Primary Specialty</Form.Label>
            <Form.Select value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
              <option>Select your specialty</option>
              <option>Portrait</option>
              <option>Wedding</option>
              <option>Studio</option>
              <option>Event</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} required />
          </Form.Group>

          {/* Tags */}
          <Form.Group className="mb-3">
            <Form.Label>Tags/Skills</Form.Label>
            <div className="d-flex">
              <Form.Control value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag" />
              <Button className="ms-2" onClick={handleAddTag}>Add</Button>
            </div>
            <div className="mt-2">
              {tags.map((tag, i) => <span key={i} className="tag-badge">{tag}</span>)}
            </div>
          </Form.Group>

          {/* Calendar Input */}
          <Form.Group className="mb-3">
            <Form.Label>Availability Calendar</Form.Label>
            <div className="d-flex gap-2 align-items-center">
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} className="form-control" />
              <Button onClick={() => handleAddDate("Available")} variant="success">Add Available</Button>
              <Button onClick={() => handleAddDate("Booked")} variant="danger">Add Booked</Button>
            </div>
            <div className="mt-2">
              {calendar.map((entry, index) => (
                <span key={index} className={`tag-badge ${entry.status.toLowerCase()}`}>
                  {entry.date} - {entry.status}
                </span>
              ))}
            </div>
          </Form.Group>

          {/* Pricing Plans */}
          <Form.Group className="mb-4">
            <Form.Label>Pricing Packages</Form.Label>
            <Row className="mb-2">
              <Col><Form.Control placeholder="Title" value={newPlan.title} onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })} /></Col>
              <Col><Form.Control placeholder="Price" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} /></Col>
              <Col><Form.Control placeholder="Details" value={newPlan.details} onChange={(e) => setNewPlan({ ...newPlan, details: e.target.value })} /></Col>
              <Col><Form.Check type="checkbox" label="Popular" checked={newPlan.popular} onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })} /></Col>
              <Col><Button onClick={handleAddPlan}>Add Plan</Button></Col>
            </Row>
            <Row>
              {pricingPlans.map((plan, index) => (
                <Col md={4} key={index}>
                  <Card className={plan.popular ? 'border-primary' : ''}>
                    <Card.Body>
                      <Card.Title>{plan.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{plan.price}</Card.Subtitle>
                      <Card.Text>{plan.details}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Portfolio Images</Form.Label>
            <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary">Save as Draft</Button>
            <Button variant="primary" type="submit">Publish Portfolio</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Portfolio
