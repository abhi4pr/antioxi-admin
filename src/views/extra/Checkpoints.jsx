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

const Checkpoints = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const perPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/get_all_checkpoints`);
                setData(response.data.checkpoints);
                setFilterData(response.data.checkpoints);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFilterData(data.filter((d) => d.cp_title.toLowerCase().includes(search.toLowerCase())));
    }, [search]);

    const handleDelete = async (quoteId) => {
        console.log('You cant delete any checkpoints')
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this checkpoint?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_checkpoint/${quoteId}`);
                            const updatedData = data.filter(quote => quote._id !== quoteId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('checkpoint Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting checkpoint', error);
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
            cell: (row, index) => <div>{index + 1}</div>,
            width: "5%",
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) => row.cp_title,
            sortable: true,
            width: "8%",
        },
        {
            name: "Description",
            selector: (row) => row.cp_des,
            sortable: true,
            width: "8%",
        },
        {
            name: "Video",
            selector: (row) => row.cp_video,
            cell: (row) =>
                <video width="320" height="100" controls>
                    <source src={row.cp_video} type="video/mp4" />
                </video>,
            sortable: true,
            width: "8%",
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/checkpoint/${row._id}`}>
                    <button className="w-100 btn btn-outline-info btn-sm user-button">
                        Edit
                    </button>
                </Link>
            ),
            width: "8%",
        },
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card>
                    <Card.Body>
                        <Row style={{ marginBottom: 20 }}>
                            <div>
                                <h4 className="fw-bold">Checkpoints</h4>
                                <p className="text-muted">All checkpoints list</p>
                            </div>
                            <Col md={6}>
                                <input
                                    type="text"
                                    placeholder="Search checkpoints..."
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={6} className="text-end">
                                <Link to="/checkpoint">
                                    <Button variant="primary">Add Checkpoints</Button>
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
                    </Card.Body>
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Checkpoints;