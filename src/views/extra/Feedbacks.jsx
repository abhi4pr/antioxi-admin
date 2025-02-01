import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";

const Feedbacks = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([
        {
            desi_id: 1,
            name: "Never Give Up",
            desc: "Success is the result of perseverance."
        },
        {
            desi_id: 2,
            name: "Dream Big",
            desc: "Dreams shape the future."
        },
        {
            desi_id: 3,
            name: "Work Hard",
            desc: "Hard work beats talent."
        },
    ]);
    const [filterdata, setFilterData] = useState([]);

    useEffect(() => {
        const result = data.filter((d) => {
            return d.name.toLowerCase().includes(search.toLowerCase());
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
            name: "User name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.desc,
            sortable: true,
        }
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card title="Hello Card" isOption>
                    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                        <div>
                            <h4 className="fw-bold">Feedbacks</h4>
                            <p className="text-muted">All Feedbacks list</p>
                        </div>
                        {/* <Button
                            variant="primary"
                            as={Link}
                            to="/motivational"
                            className="btn-sm"
                        >
                            Add New
                        </Button> */}
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

export default Feedbacks;
