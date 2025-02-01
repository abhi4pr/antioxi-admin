import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Task = ({ taskToEdit }) => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [formData, setFormData] = useState({
        task_title: '',
        task_desc: '',
        task_cat: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (taskId) {
            axios.get(`${API_URL}/get_single_task/${taskId}`)
                .then((response) => {
                    setFormData(response.data.task);
                })
                .catch((error) => {
                    console.error('Error fetching task data:', error);
                    toast.error("Error fetching task data.");
                });
        }
    }, [taskId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.task_title.trim()) {
            newErrors.task_title = "Task title is required";
        }
        if (!formData.task_cat.trim()) {
            newErrors.task_cat = "Task category is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }

        try {
            if (taskId) {
                await axios.put(`${API_URL}/update_task/${taskId}`, formData);
                toast.success('Task updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_task`, formData);
                toast.success('Task added successfully!');
            }
            navigate('/tasks');
            // setFormData({ task_title: '', task_desc: '', task_cat: '' }); 
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit task.";
            toast.error(errorMessage);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{taskId ? 'Edit Task' : 'Add Task'}</h4>
                    <p className="text-muted">{taskId ? 'Edit the task details' : 'Add a new task'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formTitle">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Title:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter task title"
                                name="task_title"
                                value={formData.task_title}
                                onChange={handleChange}
                                isInvalid={!!errors.task_title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.task_title}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formDescription">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Description:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter task description"
                                name="task_desc"
                                value={formData.task_desc}
                                onChange={handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formCategory">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Category:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter task category"
                                name="task_cat"
                                value={formData.task_cat}
                                onChange={handleChange}
                                isInvalid={!!errors.task_cat}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.task_cat}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                                {taskId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/tasks')}>
                                Cancel
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Task;
