import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Audio = () => {
    const navigate = useNavigate();
    const { audioId } = useParams();
    const [formData, setFormData] = useState({
        audio_title: '',
        audio_desc: '',
        audio_file: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (audioId) {
            axios.get(`${API_URL}/get_single_audio/${audioId}`)
                .then((response) => {
                    const { audio_title, audio_desc, audio_file } = response.data.audio;
                    setFormData({ audio_title, audio_desc, audio_file: null });
                    setImagePreview(`${audio_file}`);
                })
                .catch((error) => {
                    console.error('Error fetching quote data:', error);
                    toast.error("Error fetching quote data.");
                });
        }
    }, [audioId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.audio_title.trim()) {
            newErrors.audio_title = "Title is required";
        }
        if (!audioId && !formData.audio_file) {
            newErrors.audio_file = "Image is required";
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
            setFormData({ ...formData, audio_file: file });
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
        data.append('audio_title', formData.audio_title);
        data.append('audio_desc', formData.audio_desc);
        if (formData.audio_file) {
            data.append('audio_file', formData.audio_file);
        }

        try {
            if (audioId) {
                await axios.put(`${API_URL}/update_audio/${audioId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Quote updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_audio`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Quote added successfully!');
            }
            navigate('/audios');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit quote.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{audioId ? 'Edit audio' : 'Add audio'}</h4>
                    <p className="text-muted">{audioId ? 'Edit the audio details' : 'Add a new audio'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formTitle">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="audio_title"
                                value={formData.audio_title}
                                onChange={handleChange}
                                isInvalid={!!errors.audio_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.audio_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDescription">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                name="audio_desc"
                                value={formData.audio_desc}
                                onChange={handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formImage">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>Audio:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                name="audio_file"
                                accept="audio/mp3"
                                onChange={handleImageChange}
                            // isInvalid={!!errors.audio_file}
                            />
                            <Form.Control.Feedback type="invalid">{errors.audio_file}</Form.Control.Feedback>
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
                                {loading ? 'Submitting...' : audioId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/audios')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Audio;