import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from './Loader';

const Questions = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/get_all_questions?page=${currentPage}&perPage=${perPage}`);
                setData(response.data.questions);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const result = data.filter((question) => {
            return question.question.toLowerCase().includes(search.toLowerCase());
        });
        setFilterData(result);
    }, [search, data]);

    const handleDelete = (questionId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this question?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_question/${questionId}`);
                            const updatedData = data.filter(question => question._id !== questionId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('Question Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting question', error);
                            toast.error('Error deleting question');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        console.log('Deletion cancelled');
                    }
                }
            ]
        });
    };

    const columns = [
        {
            name: "S.No",
            cell: (row, index) => <div>{(currentPage - 1) * perPage + index + 1}</div>,
            width: "5%",
            sortable: true,
        },
        {
            name: "Question",
            selector: (row) => row.question,
            sortable: true,
            width: '20%'
        },
        {
            name: "Options",
            selector: (row) => row.options.join(', '),
            sortable: true,
            width: '10%'
        },
        {
            name: " Category",
            selector: (row) => row?.question_cat,
            sortable: true,
            width: "8%",
        },
        {
            name: "Sequence",
            selector: (row) => row.question_seq,
            sortable: true,
            width: "8%",
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/question/${row._id}`}>
                    <button className="w-100 btn btn-outline-info btn-sm user-button">
                        Edit
                    </button>
                </Link>
            ),
            width: "8%",
        },
        {
            name: "Delete",
            cell: (row) => (
                <button
                    className="w-100 btn btn-outline-danger btn-sm user-button"
                    onClick={() => handleDelete(row._id)}
                >
                    Delete
                </button>
            ),
            width: "8%",
        },
    ];

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card>
                    <Card.Body>
                        <Row style={{ marginBottom: 20 }}>
                            <div>
                                <h4 className="fw-bold">Questions</h4>
                                <p className="text-muted">All questions list</p>
                            </div>
                            <Col md={6}>
                                <input
                                    type="text"
                                    placeholder="Search Questions..."
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={6} className="text-end">
                                <Link to="/question">
                                    <Button variant="primary">Add Question</Button>
                                </Link>
                            </Col>
                        </Row>

                        {loading ? <Loader /> : (
                            <DataTable
                                columns={columns}
                                data={filterData}
                                pagination={false}
                            />
                        )}

                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <Button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Questions;