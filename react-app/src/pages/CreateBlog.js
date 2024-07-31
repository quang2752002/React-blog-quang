import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Logout from "../components/Logout";
import BlogAPI from '../api/BlogAPI'; // Ensure this is updated to the correct API file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qs from 'qs'; // Import qs for form encoding

export default function CreateBlog() {
    const [location, setLocation] = useState([]);
    const [type, setType] = useState([]);
    const [newBlog, setNewBlog] = useState({
        name: '',
        Idtype: '', // Initialize as empty string
        state: '', // Initialize as empty string
        arr: [],
        date: '', // Initialize as empty string
        note: '',
        detail: ''
    });
    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await BlogAPI.getListLocation();
                setLocation(response.data.data || []); // Adjust based on actual API response
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                setError('Failed to fetch locations.');
            } finally {
                setLoading(false);
            }
        };

        const fetchType = async () => {
            try {
                const response = await BlogAPI.getListType();
                setType(response.data.data || []); // Adjust based on actual API response
            } catch (error) {
                console.error('Failed to fetch types:', error);
                setError('Failed to fetch types.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
        fetchType();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setNewBlog((prevState) => {
                const arr = checked
                    ? [...prevState.arr, value]
                    : prevState.arr.filter((id) => id !== value);
                return { ...prevState, arr };
            });
        } else if (type === "radio") {
            setNewBlog({ ...newBlog, [name]: value });
        } else {
            setNewBlog({ ...newBlog, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        
        try {
            const response = await BlogAPI.add({
                name: newBlog.name,
                Idtype: Number(newBlog.Idtype),
                state: newBlog.state === 'Yes', // Ensure boolean conversion
                arr: newBlog.arr.map(Number), // Convert array items to numbers
                date: newBlog.date,
                note: newBlog.note,
                detail: newBlog.detail
            });
            toast.success('Blog added successfully!');
            console.log(response.data);
            setNewBlog({
                name: '',
                Idtype: '',
                state: '',
                arr: [],
                date: '',
                note: '',
                detail: ''
            });
        } catch (error) {
            console.error('Failed to add blog:', error.response ? error.response.data : error.message);
            setFormError('Failed to add blog.');
            toast.error('Failed to add blog.');
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {/* Page Wrapper */}
            {/* <div id="wrapper"> */}
                {/* Sidebar */}
                {/* <Sidebar /> */}
                {/* End of Sidebar */}

                {/* Content Wrapper */}
                {/* <div id="content-wrapper" className="d-flex flex-column"> */}

                    {/* Main Content */}
                    {/* <div id="content"> */}

                        {/* Topbar */}
                        {/* <Topbar /> */}
                        {/* End of Topbar */}

                        {/* Begin Page Content */}
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h1 className=''> New Blog</h1>
                                </div>
                                <div className="card-body">
                                    {/* Add Blog Form */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Blog Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={newBlog.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="note">Note:</label>
                                            <textarea
                                                rows={3}
                                                className="form-control"
                                                id="note"
                                                name="note"
                                                value={newBlog.note}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="detail">Detail:</label>
                                            <textarea
                                                rows={6}
                                                className="form-control"
                                                id="detail"
                                                name="detail"
                                                value={newBlog.detail}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label>Location:</label>
                                            <div className="form-check-inline-container">
                                                {location.map((loc) => (
                                                    <div key={loc.Id} className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`location-${loc.Id}`}
                                                            name="arr"
                                                            value={loc.Id.toString()} // Ensure value is a string
                                                            checked={newBlog.arr.includes(loc.Id.toString())} // Ensure checked comparison uses string
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label" htmlFor={`location-${loc.Id}`}>
                                                            {loc.Name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Public:</label>
                                            <br />
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="public-yes"
                                                    name="state"
                                                    value="Yes"
                                                    checked={newBlog.state === 'Yes'}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="public-yes">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="public-no"
                                                    name="state"
                                                    value="No"
                                                    checked={newBlog.state === 'No'}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="public-no">
                                                    No
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="Idtype">Type:</label>
                                                <select
                                                    className="form-control"
                                                    id="Idtype"
                                                    name="Idtype"
                                                    value={newBlog.Idtype}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Type</option>
                                                    {type.map((typ) => (
                                                        <option key={typ.Id} value={typ.Id}>
                                                            {typ.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="date">Date:</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="date"
                                                    name="date"
                                                    value={newBlog.date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                                        <br />
                                       <div className=' text-center'>
                                       <button type="submit" className="btn btn-success">Add Blog</button>
                                        {formError && <p className="text-danger">{formError}</p>}
                                        <a href='/' className="btn btn-primary ml-1">Quay lại</a>
                                       </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* /.container-fluid */}

                    {/* </div> */}
                    {/* End of Main Content */}

                    {/* Footer */}
                    <Footer />
                    {/* End of Footer */}

                {/* </div> */}
                {/* End of Content Wrapper */}

            {/* </div> */}
            {/* End of Page Wrapper */}

            <ToastContainer />
            {/* <Logout /> */}
        </>
    );
}
