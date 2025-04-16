import React, { useState } from 'react';
import '../Style/Portfolio.css';
import { Form, Button, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

function Portfolio() {
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [pricingInfo, setPricingInfo] = useState("");

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [images, setImages] = useState([]);

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleAddDate = () => {
    if (selectedDate && !availabilityDates.includes(selectedDate.toDateString())) {
      setAvailabilityDates([...availabilityDates, selectedDate.toDateString()]);
      setSelectedDate(null);
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
      availabilityDates,
      pricingInfo
    };

    const formData = new FormData();
    formData.append("portfolio", new Blob([JSON.stringify(portfolioData)], { type: "application/json" }));

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await axios.post("http://localhost:8080/photographer/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Portfolio created successfully!");
      console.log(response.data);
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

          {/* Tags/Skills */}
          <Form.Group className="mb-3">
            <Form.Label>Tags/Skills</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag (e.g. Portrait)"
              />
              <Button variant="primary" className="ms-2" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              {tags.map((tag, i) => (
                <span key={i} className="tag-badge">{tag}</span>
              ))}
            </div>
          </Form.Group>

          {/* Dates */}
          <Form.Group className="mb-3">
            <Form.Label>Availability Dates</Form.Label>
            <div className="d-flex gap-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
              <Button onClick={handleAddDate}>Add Date</Button>
            </div>
            <div className="mt-2">
              {availabilityDates.map((d, i) => (
                <span key={i} className="tag-badge">{d}</span>
              ))}
            </div>
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Portfolio Images</Form.Label>
            <Form.Control type="file" multiple onChange={handleImageChange} accept="image/*" />
          </Form.Group>

          {/* Pricing */}
          <Form.Group className="mb-3">
            <Form.Label>Pricing Information</Form.Label>
            <Form.Control as="textarea" rows={3} value={pricingInfo} onChange={(e) => setPricingInfo(e.target.value)} />
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

export default Portfolio;
