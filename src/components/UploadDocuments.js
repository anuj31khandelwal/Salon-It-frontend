import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import './UploadDocuments.css';

const UploadDocuments = () => {
  const { salonId } = useParams();
  console.log("Fetched salonId from params:", salonId);
  const [documents, setDocuments] = useState({
    cosmetologyLicense: null,
    idProof: null,
    taxId: null,
    bankAccountDetails: null,
    serviceMenu: null,
    bestWorkPhotos: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments({
      ...documents,
      [name]: files[0], // Only saving the first file uploaded
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        formData.append(key, documents[key]);
      }
    });

    try {
      const response = await fetch(`http://localhost:8080/api/salons/upload-documents/${salonId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        alert('Error uploading documents');
        setSubmissionStatus('error');
      } else {
        const result = await response.json();
        setSubmissionStatus({
          referenceId: result.referenceId,
          message: `We are verifying your docs, and your salon will be live in 2-3 business days. Your reference ID is: ${result.referenceId}. You can reach our customer care at +91 9414333018.`,
        });
        alert("Documents uploaded successfully!");
        navigate(`/SalonDashboard/${salonId}`);
      }
    } catch (error) {
      alert('Error uploading documents');
      console.error('Error during document upload:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-document-page">
      <h1>Upload Required Documents</h1>
      {submissionStatus && submissionStatus.referenceId ? (
        <div className="verification-message">
          <h2>Verification In Progress</h2>
          <p>{submissionStatus.message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cosmetology License Copy:</label>
            <input type="file" name="cosmetologyLicense" onChange={handleFileChange} required />
          </div>
          <div>
            <label>ID Proof:</label>
            <input type="file" name="idProof" onChange={handleFileChange} required />
          </div>
          <div>
            <label>Tax ID (if applicable):</label>
            <input type="file" name="taxId" onChange={handleFileChange} />
          </div>
          <div>
            <label>Bank Account Details:</label>
            <input type="file" name="bankAccountDetails" onChange={handleFileChange} required />
          </div>
          <div>
            <label>Your Service Menu:</label>
            <input type="file" name="serviceMenu" onChange={handleFileChange} required />
          </div>
          <div>
            <label>Photos of Your Best Work:</label>
            <input type="file" name="bestWorkPhotos" onChange={handleFileChange} required />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadDocuments;
