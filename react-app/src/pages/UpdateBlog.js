import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Logout from "../components/Logout";
import BlogAPI from '../api/BlogAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateBlog() {
    const { id } = useParams(); // Lấy id từ useParams
    const navigate = useNavigate();

    const [location, setLocation] = useState([]);
    const [type, setType] = useState([]);
    const [newBlog, setNewBlog] = useState({
        id: '',
        name: '',
        Idtype: '',
        state: '',
        arr: [],
        date: '',
        note: '',
        detail: ''
    });

    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useParams id:', id); // Log id từ useParams

        const fetchLocation = async () => {
            try {
                const response = await BlogAPI.getListLocation();
                setLocation(response.data.data || []);
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
                setType(response.data.data || []);
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

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await BlogAPI.get(id);
                const blogData = response.data.data;
                setNewBlog({
                    id: blogData.Id,
                    name: blogData.Name,
                    Idtype: blogData.IdType,
                    state: blogData.State ? 'Yes' : 'No',
                    date: blogData.Date.slice(0, 10),
                    note: blogData.Note,
                    detail: blogData.Detail,
                    arr: response.data.arr.map(id => id.toString())
                });
            } catch (error) {
                console.error('Failed to fetch blog:', error);
                setError('Failed to fetch blog.');
            }
        };
        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setNewBlog(prevState => {
                const arr = checked
                    ? [...prevState.arr, value]
                    : prevState.arr.filter(id => id !== value);
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

        const blogData = {
            id: newBlog.id,
            name: newBlog.name,
            Idtype: Number(newBlog.Idtype),
            state: newBlog.state === 'Yes',
            arr: newBlog.arr.join('-'),
            date: newBlog.date,
            note: newBlog.note,
            detail: newBlog.detail
        };

        console.log('Submitting blog data with id:', id); // Log id đang sử dụng
        console.log('Blog data:', blogData); // Log dữ liệu blog đang gửi

        try {
            await BlogAPI.update(blogData);
            toast.success('Blog updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Failed to update blog:', error.response ? error.response.data : error.message);
            setFormError('Failed to update blog.');
            toast.error('Failed to update blog.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {/* <div id="wrapper"> */}
                {/* <Sidebar /> */}
                {/* <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content"> */}
                        {/* <Topbar /> */}
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <h1 className=''>Update Blog</h1>
                                </div>
                                <div className="card-body">
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
                                                {location.map(loc => (
                                                    <div key={loc.Id} className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`location-${loc.Id}`}
                                                            name="arr"
                                                            value={loc.Id.toString()}
                                                            checked={newBlog.arr.includes(loc.Id.toString())}
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
                                                    {type.map(typ => (
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
                                       <div className='text-center'>
                                       <button type="submit" className="btn btn-success">Update Blog</button>
                                        {formError && <p className="text-danger">{formError}</p>}
                                        <a href='/' className="btn btn-primary ml-1">Quay lại</a>
                                       </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    {/* </div>
                    <Footer />
                </div>
            </div> */}
            <ToastContainer />
            {/* <Logout /> */}
        </>
    );
}
