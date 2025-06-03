import React, { useState, useEffect } from 'react';
import { Card, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { API_URL } from '../../constants';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from './Loader';
import api from '../../utility/api';

const Orders = () => {
  const [search, setSearch] = useState('');
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
        const response = await api.get(`${API_URL}/orders?page=${currentPage}&limit=${perPage}`);
        setData(response.data.orders);
        setFilterData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data.', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      const searchTerm = search.toLowerCase();
      return d.medicine.toLowerCase().includes(searchTerm) || d.user.toLowerCase().includes(searchTerm);
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: 'S.No',
      cell: (row, index) => <div>{index + 1}</div>,

      sortable: true
    },
    {
      name: 'medicine',
      selector: (row) => row.medicine,
      sortable: true
    },
    {
      name: 'user',
      selector: (row) => row.user,
      sortable: true
    },
    {
      name: 'quantity',
      selector: (row) => row.quantity,
      sortable: true
    },
    {
      name: 'Payment Mode',
      selector: (row) => row.payment_mode,
      sortable: true
    },
    {
      name: 'status',
      selector: (row) => row.status,
      sortable: true
    }
  ];

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Card title="Hello Card" isOption>
          <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
            <div>
              <h4 className="fw-bold">Orders</h4>
              <p className="text-muted">All Orders list</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <Loader />
          ) : (
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
        </Card>
      </Row>
    </React.Fragment>
  );
};

export default Orders;
