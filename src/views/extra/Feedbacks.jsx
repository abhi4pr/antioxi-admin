import React, { useState, useEffect } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Feedbacks = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/get_all_feedbacks`);
                setData(response.data.quotes);
                setFilterData(response.data.quotes);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFilterData(data?.filter((d) => d?.user_name?.toLowerCase()?.includes(search?.toLowerCase())));
    }, [search, data]);

    const columns = [
        {
            name: "S.No",
            cell: (row, index) => <div>{index + 1}</div>,
            width: "9%",
            sortable: true,
        },
        {
            name: "User name",
            selector: (row) => row.user_name,
            sortable: true,
        },
        {
            name: "User email",
            selector: (row) => row.user_email,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.feed_message,
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

export default Feedbacks;
