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

const Videos = () => {
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
                const response = await axios.get(`${API_URL}/get_all_videos`);
                setData(response.data.videos);
                setFilterData(response.data.videos);
                setTotalPages(response.data.pagination.totalPages)
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const result = data.filter((d) => {
            return d.video_title.toLowerCase().includes(search.toLowerCase());
        });
        setFilterData(result);
    }, [search]);

    const handleDelete = async (videoId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this video?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_video/${videoId}`);
                            const updatedData = data.filter(task => task._id !== videoId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('video Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting video', error);
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
            name: "Title",
            selector: (row) => row.video_title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.video_desc,
            sortable: true,
        },
        {
            name: "Video",
            selector: (row) =>
                <video width="320" height="100" controls>
                    <source src={row.video_src} type="video/mp4" />
                </video>,
            sortable: true,
        },
        {
            name: "YT Video",
            selector: (row) => row.video_url ? row.video_url : 'Not given',
            sortable: true,
        },
        {
            name: "Video cat",
            selector: (row) => row.video_cat,
            sortable: true,
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/video/${row._id}`}>
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
                                <h4 className="fw-bold">Videos</h4>
                                <p className="text-muted">All Videos list</p>
                            </div>
                            <Col md={6}>
                                <input
                                    type="text"
                                    placeholder="Search Videos..."
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={6} className="text-end">
                                <Link to="/video">
                                    <Button variant="primary">Add Video</Button>
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

export default Videos;
