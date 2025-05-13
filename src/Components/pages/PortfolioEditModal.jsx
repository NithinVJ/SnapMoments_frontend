import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../Style/PortfolioEditModal.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, X, Plus, Calendar, Check, XCircle, Tag, DollarSign, Image, Mail, Phone, Globe, Instagram, Facebook, Twitter } from 'react-feather';

const PortfolioEditModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [photographer, setPhotographer] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    specialty: '',
    location: '',
    bio: '',
    tags: [],
    pricingPlans: [],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newPricingPlan, setNewPricingPlan] = useState({ title: '', price: '', details: '', popular: false });
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/photographer/${id}`);
        setPhotographer(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          specialty: response.data.specialty || '',
          location: response.data.location || '',
          bio: response.data.bio || '',
          tags: response.data.tags || [],
          pricingPlans: response.data.pricingPlans || [],
          contactInfo: response.data.contactInfo || { email: '', phone: '', website: '' },
          socialMedia: response.data.socialMedia || { instagram: '', facebook: '', twitter: '' }
        });
        setAvailabilityDates(response.data.availabilityDates || []);
        setPreviewImages(response.data.portfolioImages || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photographer:", error);
        setError("Failed to load portfolio data");
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [id]);

  useEffect(() => {
    return () => {
      previewImages.forEach(image => {
        if (typeof image === 'string' && image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [previewImages]);

  const handleClose = () => {
    setShow(false);
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleAddAvailability = (status) => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (!availabilityDates.some(d => d.date === dateStr)) {
        setAvailabilityDates(prev => [...prev, { date: dateStr, status }]);
        setSelectedDate(null);
      }
    }
  };

  const handleRemoveAvailability = (dateToRemove) => {
    setAvailabilityDates(prev => prev.filter(avail => avail.date !== dateToRemove));
  };

  const handleAddPricingPlan = () => {
    if (newPricingPlan.title && newPricingPlan.price) {
      setFormData(prev => ({ ...prev, pricingPlans: [...prev.pricingPlans, newPricingPlan] }));
      setNewPricingPlan({ title: '', price: '', details: '', popular: false });
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
    if (e.target.files && e.target.files.length > 0) {
      previewImages.forEach(image => {
        if (typeof image === 'string' && image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });

      const files = Array.from(e.target.files);
      setImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const updatedData = { ...formData, availabilityDates, id };
      const formDataToSend = new FormData();
      formDataToSend.append("photographer", JSON.stringify(updatedData));
      images.forEach(image => formDataToSend.append("images", image));

      await axios.put(`http://localhost:8080/photographer/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setSuccess(true);
      setTimeout(() => handleClose(), 1500);
      alert("Portfolio edited successfully");
    } catch (error) {
      console.error("Error updating portfolio:", error);
      setError(error.response?.data?.message || "Failed to update portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" centered>
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
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered className="portfolio-edit-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Camera className="me-2" size={20} />
          Edit Your Portfolio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {success && <Alert variant="success">Portfolio updated successfully! Redirecting...</Alert>}

        {/* Navigation Tabs */}
        <div className="portfolio-tabs mb-4">
          <div className="d-flex flex-wrap justify-content-center">
            <Button 
              variant={activeTab === 'basic' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('basic')}
              className="me-2 mb-2"
            >
              Basic Info
            </Button>
            <Button 
              variant={activeTab === 'contact' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('contact')}
              className="me-2 mb-2"
            >
              Contact
            </Button>
            <Button 
              variant={activeTab === 'availability' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('availability')}
              className="me-2 mb-2"
            >
              Availability
            </Button>
            <Button 
              variant={activeTab === 'pricing' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('pricing')}
              className="me-2 mb-2"
            >
              Pricing
            </Button>
            <Button 
              variant={activeTab === 'gallery' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveTab('gallery')}
              className="mb-2"
            >
              Gallery
            </Button>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
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
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="Your professional name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Primary Specialty</Form.Label>
                        <Form.Select
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleInputChange}
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
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="Where you're based"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
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
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag (e.g. 'portrait', 'wedding')"
                      />
                      <Button
                        variant="outline-primary"
                        onClick={handleAddTag}
                        className="ms-2"
                        type="button"
                      >
                        <Plus size={18} />
                      </Button>
                    </div>
                    <div className="tags-container">
                      {formData.tags.map((tag, i) => (
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
                          name="email"
                          value={formData.contactInfo.email}
                          onChange={handleContactChange}
                          placeholder="your@email.com"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.contactInfo.phone}
                          onChange={handleContactChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      name="website"
                      value={formData.contactInfo.website}
                      onChange={handleContactChange}
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
                          name="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={handleSocialMediaChange}
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
                          name="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={handleSocialMediaChange}
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
                          name="twitter"
                          value={formData.socialMedia.twitter}
                          onChange={handleSocialMediaChange}
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
                        onChange={setSelectedDate}
                        className="form-control"
                        placeholderText="Select a date"
                        minDate={new Date()}
                      />
                      <Button
                        variant="success"
                        onClick={() => handleAddAvailability("Available")}
                        disabled={!selectedDate}
                      >
                        <Check className="me-2" size={16} /> Mark Available
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleAddAvailability("Booked")}
                        disabled={!selectedDate}
                      >
                        <XCircle className="me-2" size={16} /> Mark Booked
                      </Button>
                    </div>
                  </div>

                  <div className="availability-calendar">
                    <h6 className="mb-3">Your Availability</h6>
                    {availabilityDates.length > 0 ? (
                      <div className="calendar-entries">
                        {availabilityDates.map((entry, index) => (
                          <div
                            key={index}
                            className={`calendar-entry ${entry.status.toLowerCase()}`}
                          >
                            <span>{entry.date}</span>
                            <span className="status-badge">{entry.status}</span>
                            <button
                              type="button"
                              className="remove-entry"
                              onClick={() => handleRemoveAvailability(entry.date)}
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
                          value={newPricingPlan.title}
                          onChange={(e) => setNewPricingPlan({ ...newPricingPlan, title: e.target.value })}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          placeholder="Price"
                          value={newPricingPlan.price}
                          onChange={(e) => setNewPricingPlan({ ...newPricingPlan, price: e.target.value })}
                        />
                      </Col>
                      <Col md={5}>
                        <Form.Control
                          placeholder="Details (comma separated)"
                          value={newPricingPlan.details}
                          onChange={(e) => setNewPricingPlan({ ...newPricingPlan, details: e.target.value })}
                        />
                      </Col>
                      <Col md={1} className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Popular"
                          checked={newPricingPlan.popular}
                          onChange={(e) => setNewPricingPlan({ ...newPricingPlan, popular: e.target.checked })}
                        />
                      </Col>
                      <Col md={1}>
                        <Button
                          variant="primary"
                          onClick={handleAddPricingPlan}
                          disabled={!newPricingPlan.title || !newPricingPlan.price}
                          type="button"
                        >
                          <Plus size={16} />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div className="pricing-plans">
                    <Row className="g-4">
                      {formData.pricingPlans.length > 0 ? (
                        formData.pricingPlans.map((plan, index) => (
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
                                    onClick={() => handleRemovePricingPlan(index)}
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PortfolioEditModal;