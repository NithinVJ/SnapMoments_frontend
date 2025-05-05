import React from 'react';
import { Form, Card } from 'react-bootstrap';

function PackageSelection({ bookingData, updateBookingData, photographer }) {
  const handlePackageChange = (id, title, price, details) => {
    updateBookingData('selectedPackageId', id);
    updateBookingData('packageName', title);
    updateBookingData('price', parseFloat(price));
    updateBookingData('description', details);
  };

  const packages = photographer?.pricingPlans || [];

  return (
    <div>
      <h4 className="fw-bold mb-4">Select Your Package</h4>
      <div className="package-options">
        {packages.length > 0 ? (
          packages.map((pkg, index) => {
            const { title, price, details, popular } = pkg;

            // Parse price safely
            const parsedPrice = parseFloat(price);
            if (!title || isNaN(parsedPrice)) return null;

            const packageId = `pkg-${index}`; // unique ID for React key

            return (
              <Card
                key={packageId}
                className={`mb-3 ${bookingData.selectedPackageId === packageId ? 'border-danger border-2' : ''}`}
                onClick={() =>
                  handlePackageChange(packageId, title, price, details || '')
                }
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Form.Check
                        type="radio"
                        name="package"
                        id={packageId}
                        label={`${title} - ₹${parsedPrice.toLocaleString()}`}
                        checked={bookingData.selectedPackageId === packageId}
                        onChange={() => {}}
                        inline
                      />
                      {popular && (
                        <span className="badge bg-danger ms-2">Most Popular</span>
                      )}
                    </div>
                  </div>
                  <div className="ms-4 mt-2">
                    <p className="text-muted mb-1">{details || 'No details provided.'}</p>
                  </div>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <p className="text-muted">No packages available for this photographer.</p>
        )}
      </div>
    </div>
  );
}

export default PackageSelection;
