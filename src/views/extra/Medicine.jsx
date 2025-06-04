import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utility/api';
import { jwtDecode } from 'jwt-decode';

const Medicine = () => {
  const navigate = useNavigate();
  const { medicineId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [idFromToken, setIdFromToken] = useState('');

  useEffect(() => {
    if (medicineId) {
      api
        .get(`${API_URL}/medicines/${medicineId}`)
        .then((response) => {
          const { name, description, price, images, category } = response.data.medicine;
          setFormData((prev) => ({
            ...prev,

            name,
            description,
            price,
            category,
            images: []
          }));
          setImagePreviews(images || []);
        })
        .catch((error) => {
          console.error('Error fetching medicine data:', error);
          toast.error('Error fetching medicine data.');
        });
    }
  }, [medicineId]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'name is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'price is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'medecine description is required';
    }
    if (!medicineId && imagePreviews.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const totalImages = imagePreviews.length + files.length;

    if (totalImages > 3) {
      toast.error('You can upload a maximum of 3 images.');
      return;
    }

    const newImagePreviews = [...imagePreviews];
    const newImages = [...formData.images];

    for (let file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        setImagePreviews([...newImagePreviews]);
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    }

    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = formData.images.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setFormData({ ...formData, images: updatedFiles });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);

    // Append images as an array
    formData.images.forEach((img, i) => {
      data.append(`images`, img);
    });

    try {
      if (medicineId) {
        await api.put(`${API_URL}/medicines/${medicineId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Post updated successfully!');
      } else {
        await api.post(`${API_URL}/medicines/add-medicine`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Medicine added successfully!');
      }
      navigate('/medicines');
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit medicine.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Card className="p-4">
        <div className="text-center mb-4">
          <h4 className="fw-bold">{medicineId ? 'Edit Medicine' : 'Add Medicine'}</h4>
          <p className="text-muted">{medicineId ? 'Edit the Medicine details' : 'Add a new Medicine'}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group as={Row} className="mb-3" controlId="formMedicineTitle">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Medicine Name:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Enter medicine title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formMedicineTitle">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Medicine Price:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                placeholder="Enter medicine price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Content */}
          <Form.Group as={Row} className="mb-3" controlId="formPostContent">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Medicine Description:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter medicine description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Category */}
          <Form.Group as={Row} className="mb-3" controlId="formCategory">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Category:
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select" name="category" value={formData.category} onChange={handleChange} isInvalid={!!errors.category}>
                <option value="">Select a category</option>
                <option value="Default">Default</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Image Upload */}
          <Form.Group as={Row} className="mb-3" controlId="formImages">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Images:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} isInvalid={!!errors.images} />
              <Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback>
              <div className="d-flex gap-2 mt-3 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <span
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        textAlign: 'center',
                        lineHeight: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              </div>
            </Col>
          </Form.Group>

          {/* Submit / Cancel */}
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Submitting...' : medicineId ? 'Update' : 'Submit'}
              </Button>
              <Button type="button" variant="danger" onClick={() => navigate('/medicines')}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>
    </Row>
  );
};

export default Medicine;
