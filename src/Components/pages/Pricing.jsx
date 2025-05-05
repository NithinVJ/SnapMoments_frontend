import React from 'react';

function Pricing({ pricing = [] }) {
  return (
    <div>
      <h5><strong>Pricing Packages</strong></h5>
      <div className="row">
        {pricing.map((pkg, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className={`card ${pkg.popular ? 'border-danger' : ''}`}>
              <div className="card-body">
                {pkg.popular && <span className="badge bg-danger mb-2">Most Popular</span>}
                <h5 className="card-title">{pkg.title}</h5>
                <h3 className="text-danger">{pkg.price}</h3>
                <p>{pkg.details}</p>
                <button className="btn btn-outline-danger w-100">Select Package</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
