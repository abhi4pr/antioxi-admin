import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Checkpoint = () => {
    const navigate = useNavigate();
    const { checkpointId } = useParams();
    const [formData, setFormData] = useState({
        cp_title: '',
        cp_des: '',
        cp_video: null,
        tasks: [],
        position: { x: '', y: '' } // Position as an object
    });
    const [videoPreview, setVideoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (checkpointId) {
            axios.get(`${API_URL}/get_single_checkpoint_by_admin/${checkpointId}`)
                .then((response) => {
                    const { cp_title, cp_des, cp_video, tasks, position } = response.data.checkpoint;
                    setFormData({
                        cp_title,
                        cp_des,
                        cp_video: null,
                        tasks: Array.isArray(tasks) ? tasks : [],
                        position: position || { x: '', y: '' }
                    });
                    setVideoPreview(cp_video || null);
                })
                .catch((error) => {
                    console.error('Error fetching checkpoint data:', error);
                    toast.error("Error fetching checkpoint data.");
                });
        }
    }, [checkpointId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.cp_title.trim()) {
            newErrors.cp_title = "Title is required";
        }
        if (!checkpointId && !formData.cp_des) {
            newErrors.cp_des = "Description is required";
        }
        if (!checkpointId && formData.tasks.length === 0) {
            newErrors.tasks = "Tasks are required";
        }
        if (!checkpointId && (!formData.position.x || !formData.position.y)) {
            newErrors.position = "Position (x, y) is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTaskChange = (event) => {
        const taskList = event.target.value.split('\n').map(task => task.trim()).filter(task => task);
        setFormData({ ...formData, tasks: taskList });
    }

    const handlePositionChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, position: { ...formData.position, [name]: value } });
    };

    const handleVideoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoPreview(URL.createObjectURL(file));
            setFormData({ ...formData, cp_video: file });
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
        data.append('cp_title', formData.cp_title);
        data.append('cp_des', formData.cp_des);
        data.append('tasks', JSON.stringify(formData.tasks));
        data.append('position', JSON.stringify(formData.position));
        if (formData.cp_video) {
            data.append('cp_video', formData.cp_video);
        }

        try {
            if (checkpointId) {
                await axios.put(`${API_URL}/update_checkpoint_by_admin/${checkpointId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Checkpoint updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_checkpoint_by_admin`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Checkpoint added successfully!');
            }
            navigate('/checkpoints');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit checkpoint.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{checkpointId ? 'Edit Checkpoint' : 'Add Checkpoint'}</h4>
                    <p className="text-muted">{checkpointId ? 'Edit the checkpoint details' : 'Add a new checkpoint'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formTitle">
                        <Form.Label column sm={2}>Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="cp_title"
                                value={formData.cp_title}
                                onChange={handleChange}
                                isInvalid={!!errors.cp_title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.cp_title}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDescription">
                        <Form.Label column sm={2}>Description:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter description"
                                name="cp_des"
                                value={formData.cp_des}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">{errors.cp_des}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formTasks">
                        <Form.Label column sm={2}>Tasks:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter tasks, each on a new line"
                                name="tasks"
                                value={formData.tasks.join('\n')}  // Convert array to string for display
                                onChange={handleTaskChange}
                            />
                        </Col>
                        <Form.Control.Feedback type="invalid">{errors.tasks}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPosition">
                        <Form.Label column sm={2}>Position:</Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder="X position"
                                name="x"
                                value={formData.position.x}
                                onChange={handlePositionChange}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder="Y position"
                                name="y"
                                value={formData.position.y}
                                onChange={handlePositionChange}
                            />
                        </Col>
                        <Form.Control.Feedback type="invalid">{errors.position}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formVideo">
                        <Form.Label column sm={2}>Video:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                            />
                        </Col>
                        <Col sm={10} className="mt-3">
                            {videoPreview && (
                                <video controls width="300">
                                    <source src={videoPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Submitting...' : checkpointId ? 'Update' : 'Submit'}
                            </Button>
                            <Button variant="danger" onClick={() => navigate('/checkpoints')}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Checkpoint;