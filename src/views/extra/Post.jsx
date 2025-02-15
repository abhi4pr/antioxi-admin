import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Post = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [formData, setFormData] = useState({
        user_name: '',
        post_title: '',
        post_message: '',
        post_image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (postId) {
            axios.get(`${API_URL}/get_single_post/${postId}`)
                .then((response) => {
                    const { user_name, post_title, post_message, post_image } = response.data.post;
                    setFormData({ user_name, post_title, post_message, post_image: null });
                    setImagePreview(`${post_image}`);
                })
                .catch((error) => {
                    console.error('Error fetching post data:', error);
                    toast.error("Error fetching post data.");
                });
        }
    }, [postId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.user_name.trim()) {
            newErrors.user_name = "User name is required";
        }
        if (!formData.post_title.trim()) {
            newErrors.post_title = "Post title is required";
        }
        if (!formData.post_message.trim()) {
            newErrors.post_message = "Post message is required";
        }
        if (!postId && !formData.post_image) {
            newErrors.post_image = "Image is required";
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
            setFormData({ ...formData, post_image: file });
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
        data.append('user_name', formData.user_name);
        data.append('post_title', formData.post_title);
        data.append('post_message', formData.post_message);
        if (formData.post_image) {
            data.append('post_image', formData.post_image);
        }

        try {
            if (postId) {
                await axios.put(`${API_URL}/update_post/${postId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_post`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post added successfully!');
            }
            navigate('/posts');
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
                    <h4 className="fw-bold">{postId ? 'Edit Post' : 'Add Post'}</h4>
                    <p className="text-muted">{postId ? 'Edit the post details' : 'Add a new post'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formUserName">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>User Name:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter user name"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                isInvalid={!!errors.user_name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.user_name}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPostMessage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Post Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter post message"
                                name="post_title"
                                value={formData.post_title}
                                onChange={handleChange}
                                isInvalid={!!errors.post_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.post_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPostMessage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Post Message:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter post message"
                                name="post_message"
                                value={formData.post_message}
                                onChange={handleChange}
                                isInvalid={!!errors.post_message}
                            />
                            <Form.Control.Feedback type="invalid">{errors.post_message}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Image:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="post_image"
                                accept="image/*"
                                onChange={handleImageChange}
                                isInvalid={!!errors.post_image}
                            />
                            <Form.Control.Feedback type="invalid">{errors.post_image}</Form.Control.Feedback>
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
                                {loading ? 'Submitting...' : postId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/posts')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Post;