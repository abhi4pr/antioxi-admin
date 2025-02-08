import React, { useState, useEffect } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

const Posts = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/get_all_posts`);
                setData(response.data.posts);
                setFilterData(response.data.posts);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFilterData(data.filter((d) => d.post_title.toLowerCase().includes(search.toLowerCase())));
    }, [search, data]);

    const handleDelete = async (quoteId) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`${API_URL}/delete_post/${postId}`);
                            const updatedData = data.filter(quote => quote._id !== postId);
                            setData(updatedData);
                            setFilterData(updatedData);
                            toast.success('Post Deleted successfully!');
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
            cell: (row, index) => <div>{index + 1}</div>,
            width: "9%",
            sortable: true,
        },
        {
            name: "Post Title",
            selector: (row) => row.post_title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.post_message,
            sortable: true,
        },
        {
            name: "Image",
            selector: (row) => <img src={row.post_image} alt={row.quote_title} width="50" />,
            sortable: true,
        },
        {
            name: "Posted by",
            selector: (row) => row.user_name,
            sortable: true,
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/post/${row._id}`}>
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
                <Card title="Hello Card" isOption>
                    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                        <div>
                            <h4 className="fw-bold">Posts</h4>
                            <p className="text-muted">All Posts list</p>
                        </div>
                        <Button
                            variant="primary"
                            as={Link}
                            to="/post"
                            className="btn-sm"
                        >
                            Add New
                        </Button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search here"
                        className="w-25 form-control "
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

export default Posts;
