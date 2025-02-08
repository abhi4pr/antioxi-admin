import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Motivational = () => {
    const navigate = useNavigate();
    const { quoteId } = useParams();
    const [formData, setFormData] = useState({
        quote_title: '',
        quote_desc: '',
        quote_img: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (quoteId) {
            axios.get(`${API_URL}/get_single_quote/${quoteId}`)
                .then((response) => {
                    const { quote_title, quote_desc, quote_img } = response.data.quote;
                    setFormData({ quote_title, quote_desc, quote_img: null });
                    setImagePreview(`${quote_img}`);
                })
                .catch((error) => {
                    console.error('Error fetching quote data:', error);
                    toast.error("Error fetching quote data.");
                });
        }
    }, [quoteId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.quote_title.trim()) {
            newErrors.quote_title = "Title is required";
        }
        if (!quoteId && !formData.quote_img) {
            newErrors.quote_img = "Image is required";
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
            setFormData({ ...formData, quote_img: file });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }

        const data = new FormData();
        data.append('quote_title', formData.quote_title);
        data.append('quote_desc', formData.quote_desc);
        if (formData.quote_img) {
            data.append('quote_img', formData.quote_img);
        }

        try {
            if (quoteId) {
                await axios.put(`${API_URL}/update_quote/${quoteId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Quote updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_quote`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Quote added successfully!');
            }
            navigate('/motivationals');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit quote.";
            toast.error(errorMessage);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{quoteId ? 'Edit Quote' : 'Add Quote'}</h4>
                    <p className="text-muted">{quoteId ? 'Edit the quote details' : 'Add a new quote'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formTitle">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="quote_title"
                                value={formData.quote_title}
                                onChange={handleChange}
                                isInvalid={!!errors.quote_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.quote_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDescription">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                name="quote_desc"
                                value={formData.quote_desc}
                                onChange={handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Image:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="quote_img"
                                accept="image/*"
                                onChange={handleImageChange}
                                isInvalid={!!errors.quote_img}
                            />
                            <Form.Control.Feedback type="invalid">{errors.quote_img}</Form.Control.Feedback>
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
                            <Button type="submit" variant="primary">{quoteId ? 'Update' : 'Submit'}</Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/quotes')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Motivational;