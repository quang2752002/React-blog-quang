import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Logout from "../components/Logout";
import BlogAPI from '../api/BlogAPI';

export default function ListBlog() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await BlogAPI.getAll({ name: searchTerm });
                const blogList = response.data || response;
                setBlogs(blogList.data);
                setFilteredBlogs(blogList.data);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
                setError('Failed to fetch blogs.');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [searchTerm]); // Fetch blogs whenever searchTerm changes

    useEffect(() => {
        const filtered = blogs.filter(blog =>
            blog.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(filtered);
    }, [searchTerm, blogs]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await BlogAPI.delete(id);
                setBlogs(blogs.filter(blog => blog.Id !== id));
                setFilteredBlogs(filteredBlogs.filter(blog => blog.Id !== id));
            } catch (error) {
                console.error('Failed to delete blog:', error);
                setError('Failed to delete blog.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {/* Page Wrapper */}
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
                                <h1 className=''>ListBlog </h1>
                            </div>
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Search blogs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <br />
                                {/* Blog Table */}
                                <table className="table border">
                                    <thead className='border'>
                                        <tr className='border'>
                                            <th className='border'>Id</th>
                                            <th className='border'>Tên</th>
                                            <th className='border'>Loại</th>
                                            <th className='border'>Trạng thái</th>
                                            <th className='border'>Vị trí</th>
                                            <th className='border'>Ngày public</th>
                                            <th className='border'>Edit</th>
                                            <th className='border'>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
                                            filteredBlogs.map(blog => (
                                                <tr key={blog.Id}>
                                                    <td className='border'>{blog.Id}</td>
                                                    <td className='border'>{blog.Name}</td>
                                                    <td className='border'>{blog.Type}</td>
                                                    <td className='border'>{blog.State ? 'Yes' : 'No'}</td>
                                                    <td className='border'>{blog.Location}</td>
                                                    <td className='border'>{blog.DateS}</td>

                                                    <td className='border'>
                                                        <a href={`/update/${blog.Id}`}><i className="fa-regular fa-pen-to-square"></i></a>
                                                    </td>
                                                    <td>
                                                        <div
                                                            onClick={() => handleDelete(blog.Id)}
                                                            className="text-danger"
                                                        >
                                                           <i className="fa-solid fa-trash"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8">No blogs available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* /.container-fluid */}
                {/* </div> */}
                {/* End of Main Content */}

                {/* Footer */}
                {/* <Footer /> */}
                {/* End of Footer */}
            {/* </div> */}
            {/* End of Content Wrapper */}
            {/* </div> */}
            {/* End of Page Wrapper */}
            {/* <Logout /> */}
        </>
    );
}
