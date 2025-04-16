import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/FirstPage.css';

function FirstPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);


  return (
    <>
    <div className="homepage ">
      {/* Hero Section */}
      <div className="hero d-flex flex-column flex-lg-row align-items-center justify-content-between p-5 text-white">
        <div className="hero-text" data-aos="fade-up">
          <h1 className='title'>Capture Your <br/>Special Moments</h1>
          <p>Connect with professional photographers<br/> for your events. Book easily and create<br/> lasting memories.</p>
          <div className="d-flex flex-column flex-sm-row">
            <button className="btn btn-light me-sm-2 mb-2 mb-sm-0">Browse Events →</button>
            <input type="text" className="form-control w-auto d-inline" placeholder="Search..." />
          </div>
        </div>
        {/* <div className="image-placeholder" data-aos="zoom-in">Image Placeholder</div> */}
      </div>  
    </div>
    </>
  );
}

export default FirstPage;




















