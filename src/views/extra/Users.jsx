import React, { useState, useEffect } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { API_URL } from '../../constants';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from './Loader'

const Users = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${API_URL}/get_all_users`);
                setData(response.data.users);
                setFilterData(response.data.users);
            } catch (error) {
                console.error('Error fetching data', error);
            }
            setLoading(false)
        };
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter((d) => {
            return d.user_name.toLowerCase().includes(search.toLowerCase());
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
            name: "name",
            selector: (row) => row.user_name,
            sortable: true,
        },
        {
            name: "email",
            selector: (row) => row.user_email,
            sortable: true,
        },
        {
            name: "contact",
            selector: (row) => row.user_phone,
            sortable: true,
        }
    ]

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Card title="Hello Card" isOption>
                    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                        <div>
                            <h4 className="fw-bold">Users</h4>
                            <p className="text-muted">All Users list</p>
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
                        progressPending={loading}
                        progressComponent={<Loader message="Fetching data, please wait..." />}
                    />
                </Card>
            </Row>
        </React.Fragment>
    );
};

export default Users;
