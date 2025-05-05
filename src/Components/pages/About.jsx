import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Users, Target, Award, Star } from 'react-feather';
import '../Style/About.css';

export default function About() {
  return (
    <div className="min-vh-100 bg-custom-lightblue">
     

      {/* Hero Section */}
      <section className="py-5 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-custom-burgundy mb-4">About SnapMoments</h1>
          <p className="lead mb-5">Capturing life's precious moments with passion and professionalism</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/photographer" className="btn btn-custom-burgundy text-white">
              Browse Photographers
            </Link>
            <Link to="/events" className="btn btn-outline-custom-burgundy">
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-5 px-4 bg-white">
        <div className="container mx-auto">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="text-custom-burgundy mb-4">Our Story</h2>
              <p className="mb-3">
                Founded in 2023, SnapMoments began with a simple idea: to connect people with talented photographers 
                who can capture their special moments perfectly.
              </p>
              <p className="mb-3">
                What started as a small team of photography enthusiasts has grown into a trusted platform 
                serving thousands of clients nationwide.
              </p>
              <p className="mb-4">
                We're proud to have created a community where photographers can showcase their work and 
                clients can find the perfect match for their needs.
              </p>
              <Link to="/photographer" className="btn btn-custom-burgundy text-white">
                Meet Our Team
              </Link>
            </div>
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <img 
                    src="/src/assets/wedding.jpg" 
                    alt="Our team working" 
                    className="img-fluid rounded mb-3"
                  />
                  <img 
                    src="/src/assets/potrait.jpg" 
                    alt="Photography session" 
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-6 mt-5">
                  <img 
                    src="/src/assets/potrait.jpg" 
                    alt="Event coverage" 
                    className="img-fluid rounded mb-3"
                  />
                  <img 
                    src="/src/assets/wedding.jpg" 
                    alt="Client satisfaction" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-custom-burgundy mb-3">Our Mission & Vision</h2>
            <p className="lead">What drives us forward</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Target size={48} className="text-custom-burgundy mb-3" />
                  <h3 className="text-custom-burgundy">Our Mission</h3>
                  <p>
                    To make professional photography accessible to everyone by connecting clients with 
                    talented photographers through an easy-to-use platform that ensures quality, 
                    reliability, and memorable experiences.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Award size={48} className="text-custom-burgundy mb-3" />
                  <h3 className="text-custom-burgundy">Our Vision</h3>
                  <p>
                    To become the most trusted photography platform worldwide, known for exceptional 
                    service, outstanding photographers, and the ability to preserve life's most 
                    precious moments with artistry and professionalism.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-5 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-custom-burgundy mb-3">Our Core Values</h2>
            <p className="lead">The principles that guide everything we do</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Star size={32} className="text-custom-burgundy mb-3" />
                  <h4>Quality</h4>
                  <p>We maintain the highest standards in photography and service</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Users size={32} className="text-custom-burgundy mb-3" />
                  <h4>Community</h4>
                  <p>We foster connections between photographers and clients</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Award size={32} className="text-custom-burgundy mb-3" />
                  <h4>Excellence</h4>
                  <p>We strive for the best in every interaction and photograph</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <Camera size={32} className="text-custom-burgundy mb-3" />
                  <h4>Creativity</h4>
                  <p>We celebrate and nurture artistic expression</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-custom-burgundy mb-3">Meet Our Founders</h2>
            <p className="lead">The passionate team behind SnapMoments</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="/images/team-1.jpg" className="card-img-top" alt="Team Member" />
                <div className="card-body text-center">
                  <h4 className="text-custom-burgundy">Sarah Johnson</h4>
                  <p className="text-muted">CEO & Founder</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="/images/team-2.jpg" className="card-img-top" alt="Team Member" />
                <div className="card-body text-center">
                  <h4 className="text-custom-burgundy">Michael Chen</h4>
                  <p className="text-muted">CTO</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="/images/team-3.jpg" className="card-img-top" alt="Team Member" />
                <div className="card-body text-center">
                  <h4 className="text-custom-burgundy">Emily Rodriguez</h4>
                  <p className="text-muted">Head of Photography</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <img src="/images/team-4.jpg" className="card-img-top" alt="Team Member" />
                <div className="card-body text-center">
                  <h4 className="text-custom-burgundy">David Kim</h4>
                  <p className="text-muted">Marketing Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 px-4">
        <div className="container mx-auto">
          <div className="row g-4">
            <div className="col-md-3">
              <h5 className="text-white mb-3">SnapMoments</h5>
              <p>Capturing life's precious moments with passion and professionalism.</p>
            </div>
            <div className="col-md-3">
              <h5 className="text-white mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                <li className="mb-2"><Link to="/photographers" className="text-white text-decoration-none">Photographers</Link></li>
                <li className="mb-2"><Link to="/events" className="text-white text-decoration-none">Events</Link></li>
                <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5 className="text-white mb-3">Support</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/contact" className="text-white text-decoration-none">Contact Us</Link></li>
                <li className="mb-2"><Link to="/faq" className="text-white text-decoration-none">FAQs</Link></li>
                <li><Link to="/privacy" className="text-white text-decoration-none">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5 className="text-white mb-3">Connect</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="border-top border-secondary mt-4 pt-4 text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} SnapMoments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}