import React, { useState } from 'react';
import '../Style/Portfolio.css';
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Plus, Calendar, Check, XCircle, Tag, DollarSign, Image, Mail, Phone, Globe, Instagram, Facebook, Twitter } from 'react-feather';

function Portfolio() {
  // Basic Information
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  
  // Contact Information
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  
  // Social Media
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  
  // Tags & Skills
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  
  // Images
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Availability Calendar
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendar, setCalendar] = useState([]);
  
  // Pricing Plans
  const [pricingPlans, setPricingPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ 
    title: "", 
    price: "", 
    details: "", 
    popular: false 
  });
  
  // UI State
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const photographerId = localStorage.getItem("photographerId");
  const navigate = useNavigate();

  // Handle adding available/blocked dates
  const handleAddDate = (status) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (!calendar.some(entry => entry.date === formattedDate)) {
        setCalendar([...calendar, { date: formattedDate, status }]);
        setSelectedDate(null);
      }
    }
  };

  // Handle removing a date
  const handleRemoveDate = (dateToRemove) => {
    setCalendar(calendar.filter(entry => entry.date !== dateToRemove));
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle adding pricing plans
  const handleAddPlan = () => {
    if (newPlan.title && newPlan.price && newPlan.details) {
      setPricingPlans([...pricingPlans, newPlan]);
      setNewPlan({ title: "", price: "", details: "", popular: false });
    }
  };

  // Handle removing a plan
  const handleRemovePlan = (indexToRemove) => {
    setPricingPlans(pricingPlans.filter((_, index) => index !== indexToRemove));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const portfolioData = {
      fullName,
      specialty,
      location,
      bio,
      tags,
      pricingPlans,
      availabilityDates: calendar,
      contactInfo: {
        email,
        phone,
        website
      },
      socialMedia: {
        instagram,
        facebook,
        twitter
      },
      user: { id: photographerId }
    };

    const formData = new FormData();
    formData.append("portfolio", new Blob([JSON.stringify(portfolioData)], { 
      type: "application/json" 
    }));

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/photographer/create", 
        formData, 
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/photodashboard?refresh=true");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portfolio-page">
      <Container className="py-5">
        <div className="portfolio-header text-center mb-5">
          <h1 className="display-5 fw-bold text-gradient">Create Your Photography Portfolio</h1>
          <p className="lead text-muted">Showcase your unique style and attract your ideal clients</p>
        </div>

        {/* Progress Tabs */}
        <div className="portfolio-tabs mb-4">
          <div className="d-flex justify-content-center">
            <Button 
              variant={activeTab === 'basic' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('basic')}
              className="me-2"
            >
              Basic Info
            </Button>
            <Button 
              variant={activeTab === 'contact' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('contact')}
              className="me-2"
            >
              Contact
            </Button>
            <Button 
              variant={activeTab === 'availability' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('availability')}
              className="me-2"
            >
              Availability
            </Button>
            <Button 
              variant={activeTab === 'pricing' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('pricing')}
              className="me-2"
            >
              Pricing
            </Button>
            <Button 
              variant={activeTab === 'gallery' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {success && <Alert variant="success">Portfolio created successfully! Redirecting...</Alert>}

        <Form onSubmit={handleSubmit} className="portfolio-form">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="tab-content animate-fade-in">
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><Camera className="me-2" size={20} /> Basic Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          required 
                          placeholder="Your professional name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Primary Specialty</Form.Label>
                        <Form.Select 
                          value={specialty} 
                          onChange={(e) => setSpecialty(e.target.value)} 
                          required
                        >
                          <option value="">Select your specialty</option>
                          <option>Portrait Photography</option>
                          <option>Wedding Photography</option>
                          <option>Wildlife Photography</option>
                          <option>Event Photography</option>
                          <option>Nature Photography</option>
                          <option>Baby Shower</option>
                          <option>Commercial Photography</option>
                          <option>Fashion Photography</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      required 
                      placeholder="Where you're based"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      required 
                      placeholder="Tell your story and showcase your unique style"
                    />
                    <Form.Text className="text-muted">
                      This will be displayed on your public profile
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <Tag className="me-2" size={18} /> Tags/Skills
                    </Form.Label>
                    <div className="d-flex mb-2">
                      <Form.Control 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)} 
                        placeholder="Add a tag (e.g. 'portrait', 'wedding')" 
                      />
                      <Button 
                        variant="outline-primary" 
                        onClick={handleAddTag}
                        className="ms-2"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="tags-container">
                      {tags.map((tag, i) => (
                        <span key={i} className="tag-badge">
                          {tag}
                          <button 
                            type="button" 
                            className="tag-remove"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <div className="tab-content animate-fade-in">
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><Mail className="me-2" size={20} /> Contact Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="your@email.com"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Website</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)} 
                      placeholder="https://yourportfolio.com"
                    />
                  </Form.Group>

                  <h6 className="mb-3">
                    <Globe className="me-2" size={18} /> Social Media
                  </h6>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Instagram className="me-2" size={16} /> Instagram
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={instagram} 
                          onChange={(e) => setInstagram(e.target.value)} 
                          placeholder="@yourhandle"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Facebook className="me-2" size={16} /> Facebook
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={facebook} 
                          onChange={(e) => setFacebook(e.target.value)} 
                          placeholder="yourpage"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <Twitter className="me-2" size={16} /> Twitter
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={twitter} 
                          onChange={(e) => setTwitter(e.target.value)} 
                          placeholder="@yourhandle"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="tab-content animate-fade-in">
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><Calendar className="me-2" size={20} /> Availability Calendar</h5>
                </Card.Header>
                <Card.Body>
                  <div className="availability-controls mb-4">
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <DatePicker 
                        selected={selectedDate} 
                        onChange={(date) => setSelectedDate(date)} 
                        className="form-control"
                        placeholderText="Select a date"
                        minDate={new Date()}
                      />
                      <Button 
                        variant="success" 
                        onClick={() => handleAddDate("Available")}
                        disabled={!selectedDate}
                      >
                        <Check className="me-2" size={16} /> Mark Available
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleAddDate("Booked")}
                        disabled={!selectedDate}
                      >
                        <XCircle className="me-2" size={16} /> Mark Booked
                      </Button>
                    </div>
                  </div>

                  <div className="availability-calendar">
                    <h6 className="mb-3">Your Availability</h6>
                    {calendar.length > 0 ? (
                      <div className="calendar-entries">
                        {calendar.map((entry, index) => (
                          <div 
                            key={index} 
                            className={`calendar-entry ${entry.status.toLowerCase()}`}
                          >
                            <span>{entry.date}</span>
                            <span className="status-badge">{entry.status}</span>
                            <button 
                              type="button" 
                              className="remove-entry"
                              onClick={() => handleRemoveDate(entry.date)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <Calendar size={32} className="mb-2" />
                        <p>No availability dates added yet</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="tab-content animate-fade-in">
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><DollarSign className="me-2" size={20} /> Pricing Packages</h5>
                </Card.Header>
                <Card.Body>
                  <div className="pricing-form mb-4">
                    <Row className="g-3">
                      <Col md={3}>
                        <Form.Control 
                          placeholder="Package title" 
                          value={newPlan.title} 
                          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control 
                          placeholder="Price" 
                          value={newPlan.price} 
                          onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                        />
                      </Col>
                      <Col md={5}>
                        <Form.Control 
                          placeholder="Details (comma separated)" 
                          value={newPlan.details} 
                          onChange={(e) => setNewPlan({ ...newPlan, details: e.target.value })}
                        />
                      </Col>
                      <Col md={1} className="d-flex align-items-center">
                        <Form.Check 
                          type="checkbox" 
                          label="Popular" 
                          checked={newPlan.popular} 
                          onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
                        />
                      </Col>
                      <Col md={1}>
                        <Button 
                          variant="primary" 
                          onClick={handleAddPlan}
                          disabled={!newPlan.title || !newPlan.price || !newPlan.details}
                        >
                          <Plus size={16} />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="pricing-plans">
                    <Row className="g-4">
                      {pricingPlans.length > 0 ? (
                        pricingPlans.map((plan, index) => (
                          <Col lg={4} md={6} key={index}>
                            <Card className={`h-100 ${plan.popular ? 'popular-plan' : ''}`}>
                              {plan.popular && (
                                <div className="popular-badge">Most Popular</div>
                              )}
                              <Card.Body>
                                <Card.Title className="d-flex justify-content-between">
                                  {plan.title}
                                  <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => handleRemovePlan(index)}
                                  />
                                </Card.Title>
                                <Card.Subtitle className="mb-3 text-primary fw-bold">
                                  {plan.price}
                                </Card.Subtitle>
                                <ul className="plan-features">
                                  {plan.details.split(',').map((detail, i) => (
                                    <li key={i}>{detail.trim()}</li>
                                  ))}
                                </ul>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col className="text-center py-4 text-muted">
                          <DollarSign size={32} className="mb-2" />
                          <p>No pricing plans added yet</p>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="tab-content animate-fade-in">
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><Image className="me-2" size={20} /> Portfolio Gallery</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-4">
                    <Form.Label>Upload Your Best Work (Max 10 images)</Form.Label>
                    <Form.Control 
                      type="file" 
                      multiple 
                      onChange={handleImageChange} 
                      accept="image/*"
                      className="form-control-lg"
                    />
                    <Form.Text className="text-muted">
                      High-quality images that showcase your style and expertise
                    </Form.Text>
                  </Form.Group>

                  <div className="gallery-preview">
                    <Row className="g-3">
                      {previewImages.length > 0 ? (
                        previewImages.map((img, index) => (
                          <Col key={index} xs={6} md={4} lg={3}>
                            <div className="gallery-thumbnail">
                              <img 
                                src={img} 
                                alt={`Preview ${index + 1}`} 
                                className="img-fluid rounded"
                              />
                            </div>
                          </Col>
                        ))
                      ) : (
                        <Col className="text-center py-5 text-muted">
                          <Image size={48} className="mb-3" />
                          <p>No images selected yet</p>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="d-flex justify-content-between mt-4">
            <div>
              {activeTab !== 'basic' && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    const tabs = ['basic', 'contact', 'availability', 'pricing', 'gallery'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div>
              {activeTab !== 'gallery' ? (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    const tabs = ['basic', 'contact', 'availability', 'pricing', 'gallery'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Portfolio'}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Portfolio;