import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Questions = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/get_all_questions`);
                setData(response.data.questions);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

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
            cell: (row, index) => <div>{index + 1}</div>,
            width: "9%",
            sortable: true,
        },
        {
            name: "Question",
            selector: (row) => row.question,
            sortable: true,
        },
        {
            name: "Options",
            selector: (row) => row.options.join(', '),
            sortable: true,
        },
        {
            name: "Sequence",
            selector: (row) => row.question_seq,
            sortable: true,
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
        },
    ];

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card>
                    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                        <div>
                            <h4 className="fw-bold">Questions</h4>
                            <p className="text-muted">All Questions list</p>
                        </div>
                        <Button
                            variant="primary"
                            as={Link}
                            to="/question"
                            className="btn-sm"
                        >
                            Add New
                        </Button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search here"
                        className="w-25 form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DataTable
                        columns={columns}
                        data={filterData}
                        fixedHeader
                        paginationPerPage={100}
                        fixedHeaderScrollHeight="64vh"
                        highlightOnHover
                        pagination
                    />
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Questions;
