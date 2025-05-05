import React from 'react'

function Contact() {
  return (
    <div className="row">
      <div className="col-md-6">
        <h5><strong>Contact Information</strong></h5>
        <p><i className="bi bi-envelope"></i> john.doe@example.com</p>
        <p><i className="bi bi-telephone"></i> +1 (555) 123-4567</p>
        <p><i className="bi bi-globe"></i> www.johndoephotography.com</p>
        <h6>Social Media</h6>
        <p>
          <i className="bi bi-instagram me-2"></i> @johndoephoto
          <br />
          <i className="bi bi-facebook me-2"></i> johndoephotography
          <br />
          <i className="bi bi-twitter me-2"></i> @johndoephoto
        </p>
      </div>
      <div className="col-md-6">
        <h5><strong>Send a Message</strong></h5>
        <form>
          <div className="row mb-2">
            <div className="col">
              <input type="text" className="form-control" placeholder="Your Name" />
            </div>
            <div className="col">
              <input type="email" className="form-control" placeholder="Your Email" />
            </div>
          </div>
          <input type="text" className="form-control mb-2" placeholder="Subject" />
          <textarea className="form-control mb-2" rows="3" placeholder="Message"></textarea>
          <button className="btn btn-danger w-100">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact
