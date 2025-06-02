import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utility/api';

const Reward = () => {
  const navigate = useNavigate();
  const { rewardId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rewardId) {
      api
        .get(`${API_URL}/rewards/${rewardId}`)
        .then((response) => {
          const { name, description, image } = response.data.reward;
          setFormData({ name, description, image: null });
          setImagePreview(`${image}`);
        })
        .catch((error) => {
          console.error('Error fetching reward data:', error);
          toast.error('Error fetching reward data.');
        });
    }
  }, [rewardId]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Title is required';
    }
    if (!rewardId && !formData.image) {
      newErrors.image = 'Image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
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
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (rewardId) {
        await api.put(`${API_URL}/rewards/${rewardId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Reward updated successfully!');
      } else {
        await api.post(`${API_URL}/rewards/add-reward`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Reward added successfully!');
      }
      navigate('/rewards');
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit rewards.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Card>
        <div className="text-center mb-4 mt-4">
          <h4 className="fw-bold">{rewardId ? 'Edit reward' : 'Add reward'}</h4>
          <p className="text-muted">{rewardId ? 'Edit the reward details' : 'Add a new reward'}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formTitle">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Title:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formDescription">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Description:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formImage">
            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
              Image:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="file" name="image" accept="image/*" onChange={handleImageChange} isInvalid={!!errors.image} />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
            </Col>
            <Col sm={2}></Col>
            <Col sm={3} className="mt-3">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Submitting...' : rewardId ? 'Update' : 'Submit'}
              </Button>
              <Button type="button" variant="danger" onClick={() => navigate('/rewards')}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card>
    </Row>
  );
};

export default Reward;
