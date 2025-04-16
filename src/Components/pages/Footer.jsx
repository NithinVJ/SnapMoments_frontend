import React from 'react'
import { FaCamera } from 'react-icons/fa';
import '../Style/Footer.css'

function Footer() {
  return (
    <>
    {/* Footer */}
    
    <footer className="footer-section font-poppins text-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-2">
              <FaCamera className="me-2" />
              SnapMoments
            </h5>
            <p>Connecting photographers with clients for memorable events.</p>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/photographers" className="footer-link">Photographers</a></li>
              <li><a href="/events" className="footer-link">Events</a></li>
              <li><a href="/about" className="footer-link">About Us</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-white mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="/contact" className="footer-link">Contact Us</a></li>
              <li><a href="/faq" className="footer-link">FAQ</a></li>
              <li><a href="/terms" className="footer-link">Terms of Service</a></li>
              <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold text-white mb-3">Subscribe</h6>
            <p >Stay updated with our latest news and offers.</p>
            <div className="d-flex">
              <input type="email" placeholder="Your email" className="form-control me-2 footer-input" />
              <button className="btn btn-danger">Subscribe</button>
            </div>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text pt-2">
          © 2025 SnapMoments. All rights reserved.
        </div>
      </div>
    </footer>
  </>
  )
}

export default Footer
