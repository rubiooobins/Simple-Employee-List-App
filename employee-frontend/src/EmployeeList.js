import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeList.css';

function EmployeeList({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', position: '', department: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Set up axios instance with JWT token
  const axiosAuth = axios.create();
  axiosAuth.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axiosAuth.get('http://localhost:3000/employees')
      .then(res => setEmployees(res.data))
      .catch(() => setError('Failed to fetch employees'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axiosAuth.post('http://localhost:3000/employees', form);
      setForm({ name: '', position: '', department: '', email: '' });
      fetchEmployees();
      window.alert('Employee added successfully!');
    } catch {
      setError('Failed to add employee');
      window.alert('Failed to add employee');
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp._id);
    setForm({ name: emp.name, position: emp.position, department: emp.department, email: emp.email });
    setShowAddForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosAuth.put(`http://localhost:3000/employees/${editId}`, form);
      setEditId(null);
      setForm({ name: '', position: '', department: '', email: '' });
      fetchEmployees();
      window.alert('Employee updated successfully!');
    } catch {
      setError('Failed to update employee');
      window.alert('Failed to update employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axiosAuth.delete(`http://localhost:3000/employees/${id}`);
      fetchEmployees();
      window.alert('Employee deleted successfully!');
    } catch {
      setError('Failed to delete employee');
      window.alert('Failed to delete employee');
    }
  };

  return (
  <div className="employee-list-container">
    <div className="employee-list-card">
      <div className="employee-list-header">
        <h2>Employee List</h2>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="employee-list-scroll">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm ? (
        <form onSubmit={editId ? handleUpdate : handleAdd} className="employee-form">
          <div className="employee-form-row">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="employee-form-actions employee-actions-row">
            <button
              className="edit-btn"
              type="submit"
              style={{ marginLeft: 0 }}
            >
              {editId ? 'Update Employee' : 'Add Employee'}
            </button>
            <button
              className="logout-btn"
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ name: '', position: '', department: '', email: '' });
                setShowAddForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="employee-actions-row">
          <button className="edit-btn" onClick={() => setShowAddForm(true)}>
            + Add Employee
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>

    <div className="background-effects">
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>
    </div>
  </div>
)};
export default EmployeeList;
