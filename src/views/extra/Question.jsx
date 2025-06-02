import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utility/api';

const Question = ({ questionToEdit }) => {
    const navigate = useNavigate();
    const { questionId } = useParams();
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        category: '',
        sequence: 0,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const categories = ['General', 'Journey', 'Health'];

    useEffect(() => {
        if (questionId) {
            api.get(`${API_URL}/questions/${questionId}`)
                .then((response) => {
                    setFormData(response.data.question);
                })
                .catch((error) => {
                    console.error('Error fetching question data:', error);
                    toast.error("Error fetching question data.");
                });
        }
    }, [questionId]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.question.trim()) {
            newErrors.question = "Question is required";
        }
        if (!formData.category.trim()) {
            newErrors.category = "Question category is required";
        }
        formData.options.forEach((option, index) => {
            if (!option.trim()) {
                newErrors[`option${index}`] = `Option ${index + 1} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('option')) {
            const index = parseInt(name.replace('option', ''), 10);
            const newOptions = [...formData.options];
            newOptions[index] = value;
            setFormData({ ...formData, options: newOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }
        setLoading(true);

        try {
            if (questionId) {
                await api.put(`${API_URL}/questions/${questionId}`, formData);
                toast.success('Question updated successfully!');
            } else {
                await api.post(`${API_URL}/questions/`, formData);
                toast.success('Question added successfully!');
            }
            navigate('/questions');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || "Failed to submit question.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="justify-content-center">
            <Card>
                <div className="text-center mb-4 mt-4">
                    <h4 className="fw-bold">{questionId ? 'Edit Question' : 'Add Question'}</h4>
                    <p className="text-muted">{questionId ? 'Edit the question details' : 'Add a new question'}</p>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formQuestion">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Question:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter question"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                isInvalid={!!errors.question}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.question}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formCategory">
                        <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                            Category:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Select
                                name="extra"
                                value={formData.extra}
                                onChange={handleChange}
                                isInvalid={!!errors.extra}
                            >
                                <option>Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.extra}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    {formData.options.map((option, index) => (
                        <Form.Group as={Row} className="mb-3" key={index} controlId={`formOption${index}`}>
                            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                                Option {index + 1}:
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Enter option ${index + 1}`}
                                    name={`option${index}`}
                                    value={option}
                                    onChange={handleChange}
                                    isInvalid={!!errors[`option${index}`]}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors[`option${index}`]}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    ))}

                    <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Submitting...' : questionId ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="danger" onClick={() => navigate('/questions')}>
                                Cancel
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card>
        </Row>
    );
};

export default Question;
