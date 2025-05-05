import React from 'react';
import'../Style/Gallery.css'

function Gallery({ imageUrls = [] }) {
  return (
    <div>
      <h5><strong>Portfolio Gallery</strong></h5>
      <div className="row">
        {imageUrls.map((url, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className="portfolio-box">
              <img
                src={`http://localhost:8080/uploads/${url}`}
                alt={`Portfolio ${i + 1}`}
                className="img-fluid rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
