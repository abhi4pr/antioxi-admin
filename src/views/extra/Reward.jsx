import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Reward = () => {
    const navigate = useNavigate();
    const { rewardId } = useParams();
    const [formData, setFormData] = useState({
        reward_title: '',
        reward_desc: '',
        reward_logo: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (rewardId) {
            axios.get(`${API_URL}/get_single_reward/${rewardId}`)
                .then((response) => {
                    const { reward_title, reward_desc, reward_logo } = response.data.reward;
                    setFormData({ reward_title, reward_desc, reward_logo: null });
                    setImagePreview(`${reward_logo}`);
                })
                .catch((error) => {
                    console.error('Error fetching reward data:', error);
                    toast.error("Error fetching reward data.");
                });
        }
    }, [rewardId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.reward_title.trim()) {
            newErrors.reward_title = "Title is required";
        }
        if (!rewardId && !formData.reward_logo) {
            newErrors.reward_logo = "Image is required";
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
            setFormData({ ...formData, reward_logo: file });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }

        const data = new FormData();
        data.append('reward_title', formData.reward_title);
        data.append('reward_desc', formData.reward_desc);
        if (formData.reward_logo) {
            data.append('reward_logo', formData.reward_logo);
        }

        try {
            if (rewardId) {
                await axios.put(`${API_URL}/update_reward/${rewardId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Reward updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_reward`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Reward added successfully!');
            }
            navigate('/rewards');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit rewards.";
            toast.error(errorMessage);
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
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="reward_title"
                                value={formData.reward_title}
                                onChange={handleChange}
                                isInvalid={!!errors.reward_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.reward_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDescription">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                name="reward_desc"
                                value={formData.reward_desc}
                                onChange={handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Image:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="reward_logo"
                                accept="image/*"
                                onChange={handleImageChange}
                                isInvalid={!!errors.reward_logo}
                            />
                            <Form.Control.Feedback type="invalid">{errors.reward_logo}</Form.Control.Feedback>
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
                                        border: '1px solid #ddd',
                                    }}
                                />
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
                            <Button type="submit" variant="primary">{rewardId ? 'Update' : 'Submit'}</Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/rewards')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Reward;