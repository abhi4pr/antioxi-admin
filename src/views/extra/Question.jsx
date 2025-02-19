import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const Question = ({ questionToEdit }) => {
    const navigate = useNavigate();
    const { questionId } = useParams();
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        question_cat: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const categories = ['General', 'Journey'];

    useEffect(() => {
        if (questionId) {
            axios.get(`${API_URL}/get_single_question/${questionId}`)
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
        if (!formData.question_cat.trim()) {
            newErrors.question_cat = "Question category is required";
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
                await axios.put(`${API_URL}/update_question/${questionId}`, formData);
                toast.success('Question updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_question`, formData);
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
                                name="question_cat"
                                value={formData.question_cat}
                                onChange={handleChange}
                                isInvalid={!!errors.question_cat}
                            >
                                <option>Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.question_cat}
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
