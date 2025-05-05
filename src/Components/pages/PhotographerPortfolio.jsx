import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Style/PhotographerPortfolio.css';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Gallery from './Gallery';
import Pricing from './Pricing';
import Availability from './Availability';
import Contact from './Contact';

const PhotographerProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [photographer, setPhotographer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/photographer/${id}`)
      .then(response => {
        setPhotographer(response.data);
        console.log(response.data)
      })
      .catch(error => console.error("Failed to fetch photographer:", error));
  }, [id]);

  const renderContent = () => {
    if (!photographer) return null;

    switch (activeTab) {
      case 'portfolio': return <Gallery imageUrls={photographer.imageUrls} />;
      case 'pricing': return <Pricing pricing={photographer.pricingPlans} />;
      case 'availability': return <Availability availability={photographer.availabilityDates} />;
      case 'contact': return <Contact photographer={photographer} />;
      default: return null;
    }
  };

  if (!photographer) return <div className="text-center mt-5">Loading profile...</div>;

  return (
    <div className="photographer-profile-container">
      {/* Header Section */}
      <div className="photographer-header">
        <div className="photographer-image">
          <img
            src={`http://localhost:8080/uploads/${photographer.imageUrls[0]}`}
            alt={photographer.fullName}
          />
        </div>
        
        <div className="photographer-info">
          <h1>{photographer.fullName}</h1>
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{photographer.rating || '4.9'} ({photographer.reviewCount || '127'} reviews)</span>
          </div>
          
          <div className="specialty">
            <strong>Specialty:</strong> {photographer.specialty || 'Wedding Photography'}
          </div>
          
          <div className="location">
            <FaMapMarkerAlt className="location-icon" />
            <span>{photographer.location || 'New York, NY'}</span>
          </div>

          <div className="Bio"> 
            <span>{photographer.bio}</span>
          </div>
          
          <div className="tags">
            {photographer.tags?.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="action-buttons">
            <button className="check-availability" onClick={() => setActiveTab('availability')}>
              Check Availability
            </button>
            <button className="btn btn-maroon me-2" onClick={()=>navigate(`/booking/${id}`)}>Book Now</button>

          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={activeTab === 'portfolio' ? 'active' : ''}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={activeTab === 'pricing' ? 'active' : ''}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button 
          className={activeTab === 'availability' ? 'active' : ''}
          onClick={() => setActiveTab('availability')}
        >
          Availability
        </button>
        <button 
          className={activeTab === 'contact' ? 'active' : ''}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      {/* Content Section */}
      <div className="profile-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PhotographerProfile;







