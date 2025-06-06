import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utility/api';

const Video = () => {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        videoFile: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (videoId) {
            api
                .get(`${API_URL}/videos/${videoId}`)
                .then((response) => {
                    const { title, description, category, videoFile } = response.data.video;
                    setFormData({ title, description, category, videoFile: null });
                    setImagePreview(`${videoFile}`);
                })
                .catch((error) => {
                    console.error('Error fetching video data:', error);
                    toast.error('Error fetching video data.');
                });
        }
    }, [videoId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!videoId && !formData.videoFile) {
            newErrors.videoFile = 'video is required';
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
            setFormData({ ...formData, videoFile: file });
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
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (formData.videoFile) {
            data.append('videoFile', formData.videoFile);
        }

        try {
            if (videoId) {
                await api.put(`${API_URL}/videos/${videoId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Video updated successfully!');
            } else {
                await api.post(`${API_URL}/videos/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Video added successfully!');
            }
            navigate('/videos');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add video.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{videoId ? 'Edit video' : 'Add video'}</h4>
                    <p className="text-muted">{videoId ? 'Edit the video details' : 'Add a new video'}</p>
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
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
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

                    <Form.Group as={Row} className="mb-3" controlId="formCategory">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Category:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="category" value={formData.category} onChange={handleChange} isInvalid={!!errors.category}>
                                <option value="">Select a category</option>
                                <option value="General">General</option>
                                <option value="Music">Music</option>
                                <option value="Podcast">Podcast</option>
                                <option value="Audiobook">Audiobook</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Video:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="videoFile"
                                accept="video/mp4"
                                onChange={handleImageChange}
                            // isInvalid={!!errors.videoFile}
                            />
                            <Form.Control.Feedback type="invalid">{errors.videoFile}</Form.Control.Feedback>
                        </Col>
                        <Col sm={2}></Col>
                        <Col sm={3} className="mt-3">
                            {imagePreview && (
                                <video controls style={{ width: '100%' }}>
                                    <source src={imagePreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Submitting...' : videoId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/videos')}>
                                Cancel
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Video;
