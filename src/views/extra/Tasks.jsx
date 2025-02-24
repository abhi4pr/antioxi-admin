import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import Loader from './Loader';

const Tasks = () => {
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
                const response = await axios.get(`${API_URL}/get_all_tasks`);
                setData(response.data.tasks);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const result = data.filter((task) => {
            return task.task_title.toLowerCase().includes(search.toLowerCase());
        });
        setFilterData(result);
    }, [search, data]);

    const handleDelete = async (taskId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this task?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_task/${taskId}`);
                            const updatedData = data.filter(task => task._id !== taskId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('Task Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting task', error);
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
            name: "Task Title",
            selector: (row) => row.task_title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.task_desc,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.task_cat,
            sortable: true,
        },
        {
            name: "Sequence",
            selector: (row) => row.task_seq,
            sortable: true,
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/task/${row._id}`}>
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
                    <Card.Body>
                        <Row style={{ marginBottom: 20 }}>
                            <div>
                                <h4 className="fw-bold">Tasks</h4>
                                <p className="text-muted">All Tasks list</p>
                            </div>
                            <Col md={6}>
                                <input
                                    type="text"
                                    placeholder="Search Tasks..."
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={6} className="text-end">
                                <Link to="/task">
                                    <Button variant="primary">Add Task</Button>
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
        </React.Fragment >
    );
};

export default Tasks;
