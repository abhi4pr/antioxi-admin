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

const Quotes = () => {
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
                const response = await axios.get(`${API_URL}/get_all_quotes?page=${currentPage}&perPage=${perPage}`);
                setData(response.data.quotes);
                setTotalPages(response.data.pagination.totalPages)
                setFilterData(response.data.quotes);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        setFilterData(data.filter((d) => d.quote_title.toLowerCase().includes(search.toLowerCase())));
    }, [search, data]);

    const handleDelete = async (quoteId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this quote?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_quote/${quoteId}`);
                            const updatedData = data.filter(quote => quote._id !== quoteId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('Quote Deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting quote', error);
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
            width: "5%",
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) => row.quote_title,
            sortable: true,
            width: "8%",
        },
        {
            name: "Description",
            selector: (row) => row.quote_desc,
            sortable: true,
            width: "8%",
        },
        {
            name: "Image",
            selector: (row) => row.quote_img,
            cell: (row) => <img src={row.quote_img} alt={row.quote_title} width="50" />,
            sortable: true,
            width: "8%",
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/motivational/${row._id}`}>
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
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card>
                    <Card.Body>
                        <Row style={{ marginBottom: 20 }}>
                            <div>
                                <h4 className="fw-bold">Quotes</h4>
                                <p className="text-muted">All quotes list</p>
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
                                <Link to="/motivational">
                                    <Button variant="primary">Add Quotes</Button>
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

export default Quotes;