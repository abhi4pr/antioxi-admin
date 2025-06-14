import React, { useState, useEffect } from 'react';
import { Card, Row, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import Loader from './Loader';
import api from '../../utility/api'

const Levels = () => {
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
                const response = await api.get(`${API_URL}/levels?page=${currentPage}&perPage=${perPage}`);
                setData(response.data.levels);
                setTotalPages(response.data.totalPages)
                setFilterData(response.data.levels);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        setFilterData(data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase())));
    }, [search, data]);

    const handleDelete = async (audioId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this level?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await api.delete(`${API_URL}/levels/${audioId}`);
                            const updatedData = data.filter(quote => quote._id !== audioId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('level Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting level', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Deletion cancelled')
                }
            ]
        });
    };

    const columns = [
        {
            name: "S.No",
            cell: (row, index) => <div>{(currentPage - 1) * perPage + index + 1}</div>,
            sortable: true,
        },
        {
            name: "Level Number",
            selector: (row) => row.levelNumber,
            sortable: true,

        },
        {
            name: "Name",
            selector: (row) => row.title,
            sortable: true,

        },
        {
            name: "Steps",
            // selector: (row) => row.steps.length,
            cell: (row) => <div>{row.steps.length} Steps</div>,
            sortable: true,

        },
        
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/level/${row._id}`}>
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
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card>
                    <Card.Body>
                        <Row style={{ marginBottom: 20 }}>
                            <div>
                                <h4 className="fw-bold">level</h4>
                                <p className="text-muted">All level list</p>
                            </div>
                            <Col md={6}>
                                <input
                                    type="text"
                                    placeholder="Search level..."
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={6} className="text-end">
                                <Link to="/level">
                                    <Button variant="primary">Add level</Button>
                                </Link>
                            </Col>
                        </Row>

                        {loading ? <Loader /> : (
                            <DataTable
                                columns={columns}
                                data={filterData}
                                pagination
                                paginationServer
                                paginationPerPage={perPage}
                                paginationTotalRows={totalPages * perPage}
                                onChangePage={(page) => setCurrentPage(page)}
                            />
                        )}

                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Levels;