import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";

const Videos = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([
        {
            video_id: 1,
            title: "Never Give Up",
            desc: "Success is the result of perseverance.",
            video: "https://via.placeholder.com/150"
        },
        {
            video_id: 2,
            title: "Dream Big",
            desc: "Dreams shape the future.",
            video: "https://via.placeholder.com/150"
        },
        {
            video_id: 3,
            title: "Work Hard",
            desc: "Hard work beats talent.",
            video: "https://via.placeholder.com/150"
        },
    ]);
    const [filterdata, setFilterData] = useState([]);

    useEffect(() => {
        const result = data.filter((d) => {
            return d.title.toLowerCase().includes(search.toLowerCase());
        });
        setFilterData(result);
    }, [search]);

    const columns = [
        {
            name: "S.No",
            cell: (row, index) => <div>{index + 1}</div>,
            width: "9%",
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.desc,
            sortable: true,
        },
        {
            name: "Video",
            selector: (row) => row.video,
            sortable: true,
        },
        {
            name: "Edit",
            cell: (row) => (
                <Link to={`/admin/desi-dept-auth/${row.desi_id}`}>
                    <button className="w-100 btn btn-outline-info btn-sm user-button">
                        Edit
                    </button>
                </Link>
            ),
        },
        {
            name: "Delete",
            cell: (row) => (
                <Link to={`/admin/desi-dept-auth/${row.desi_id}`}>
                    <button className="w-100 btn btn-outline-danger btn-sm user-button">
                        Delete
                    </button>
                </Link>
            ),
        },
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card title="Hello Card" isOption>
                    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                        <div>
                            <h4 className="fw-bold">Videos</h4>
                            <p className="text-muted">All Videos list</p>
                        </div>
                        <Button
                            variant="primary"
                            as={Link}
                            to="/video"
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
                        data={filterdata}
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

export default Videos;
