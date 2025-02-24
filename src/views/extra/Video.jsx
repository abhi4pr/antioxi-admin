import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Video = () => {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [formData, setFormData] = useState({
        video_title: '',
        video_desc: '',
        video_url: '',
        video_cat: '',
        video_src: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const categories = ['Yoga', 'Motivational', 'Journey', 'Status'];

    useEffect(() => {
        if (videoId) {
            axios.get(`${API_URL}/get_single_video/${videoId}`)
                .then((response) => {
                    const { video_title, video_desc, video_url, video_src, video_cat } = response.data.video;
                    setFormData({ video_title, video_desc, video_url, video_src: null, video_cat });
                    setImagePreview(`${video_src}`);
                })
                .catch((error) => {
                    console.error('Error fetching post data:', error);
                    toast.error("Error fetching post data.");
                });
        }
    }, [videoId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.video_title.trim()) {
            newErrors.video_title = "Video title is required";
        }
        if (!formData.video_desc.trim()) {
            newErrors.video_desc = "video desc is required";
        }
        if (!formData.video_cat.trim()) {
            newErrors.video_cat = "video cat is required";
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
            setFormData({ ...formData, video_src: file });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }
        setLoading(true);

        const data = new FormData();
        data.append('video_title', formData.video_title);
        data.append('video_desc', formData.video_desc);
        data.append('video_cat', formData.video_cat);
        if (formData.video_src) {
            data.append('video_src', formData.video_src);
        }

        try {
            if (videoId) {
                await axios.put(`${API_URL}/update_video/${videoId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Video updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_video`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Video added successfully!');
            }
            navigate('/videos');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit post.";
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
                    <Form.Group as={Row} className="mb-3" controlId="formUserName">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Video title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter video title"
                                name="video_title"
                                value={formData.video_title}
                                onChange={handleChange}
                                isInvalid={!!errors.video_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.video_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPostMessage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>video description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter video message"
                                name="video_desc"
                                value={formData.video_desc}
                                onChange={handleChange}
                                isInvalid={!!errors.video_desc}
                            />
                            <Form.Control.Feedback type="invalid">{errors.video_desc}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPostMessage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>video url:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                // as="textarea"
                                // rows={3}
                                placeholder="Enter video url"
                                name="video_url"
                                value={formData.video_url}
                                onChange={handleChange}
                                isInvalid={!!errors.video_url}
                            />
                            <Form.Control.Feedback type="invalid">{errors.video_url}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formCategory">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Category:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Select
                                name="video_cat"
                                value={formData.video_cat}
                                onChange={handleChange}
                                isInvalid={!!errors.video_cat}
                            >
                                <option>Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.video_cat}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Video:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="video_src"
                                accept="video/*"
                                onChange={handleImageChange}
                                isInvalid={!!errors.video_src}
                            />
                            <Form.Control.Feedback type="invalid">{errors.video_src}</Form.Control.Feedback>
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
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Submitting...' : videoId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/videos')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Video;