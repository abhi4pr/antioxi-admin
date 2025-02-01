import React, { useState } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

const Video = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card title="Hello Card" isOption>
                    <div className="text-center mb-4 mt-4">
                        <h4 className="fw-bold">Videos</h4>
                        <p className="text-muted">Add Videos to list</p>
                    </div>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formEmail">
                            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                                Video:
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPassword">
                            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                                Description:
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter description"
                                    name="description"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formImage">
                            <Form.Label column sm={2} style={{ textAlign: 'right' }}>
                                Video:
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Col>
                            <Form.Group as={Row} className="mt-3" controlId="formImage">
                                <Col sm={2}></Col>
                                <Col sm={3}>
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
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Col sm={{ span: 10, offset: 2 }} className="d-flex gap-2">
                                <Button type="submit" variant="primary">
                                    Submit
                                </Button>
                                <Button type="button" variant="danger">
                                    Cancel
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Video;
