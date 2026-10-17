import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { validationAddHymn } from '../utils/creat-account-validation';
import Loading from '../components/Loading';
import '../css/addHymn.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function AddHymn() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = 'HymnFlow | Add Hymn';
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) return;

        const validationError = validationAddHymn(formData, file);
        setErrors(validationError);

        if (Object.keys(validationError).length !== 0) {
            return;
        }

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert('Please, First register!');
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('firstName', formData.firstName || 'Unknown');
        dataToSend.append('lastName', formData.lastName || 'Unknown');
        dataToSend.append('userId', userId);

        if (file) {
            dataToSend.append('pdf', file);
        }

        setUploading(true);

        try {
            const response = await fetch(`${API_BASE}/api/addhymn`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataToSend
            });

            const result = await response.json();

            if (response.ok) {
                alert('Hymn added successfully!');
                console.log('Form submitted successfully!', result.message);
                setErrors({});
                setFormData({
                    title: '',
                    firstName: '',
                    lastName: ''
                });
                setFile(null);
            } else {
                alert(`Error: ${result.message || 'Something went wrong'}`);
            }
        } catch (e) {
            console.error('Error submitting hymn:', e);
            alert('Server error. Please check your backend connection.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="addHymnFormBox">
                <div className="gradientBox">
                    {uploading && (
                        <div className="upload-overlay">
                            <Loading text="Uploading hymn, please wait..." />
                        </div>
                    )}

                    <h1>Create and Publish New Hymn</h1>
                    <i className="constraints">Please check if the hymn you are trying to add already exists before adding it.</i>
                    <form className="addHymnForm" onSubmit={handleSubmit} noValidate>
                        <label htmlFor="hymnTitle">Hymn Title : </label>
                        <input
                            name="title"
                            id="hymnTitle"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Hymn name type here"
                            disabled={uploading}
                        />
                        <small>{errors.title}</small>

                        <label htmlFor="pdfFile">Choose the pdf file :</label>
                        <div className="uploadFileBox">
                            <input
                                name="pdf"
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                className="actual-file-input"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                            <label htmlFor="pdfFile" className="posh-file-button">
                                <i>Upload PDF Hymn</i>
                            </label>

                            <span>{file ? file.name : 'No file chosen'}</span>
                        </div>
                        <small>{errors.pdf}</small>

                        <label htmlFor="singerFname">Singer : </label>
                        <div className="singerNameBox">
                            <input
                                name="firstName"
                                id="singerFname"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name type here"
                                disabled={uploading}
                            />
                            <input
                                name="lastName"
                                id="singerLname"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name type here"
                                disabled={uploading}
                            />
                        </div>
                        <div className="addButton">
                            <button type="submit" disabled={uploading}>
                                <img src="assets/save-icon-white.png" alt="Save Icon" />
                                {uploading ? 'Uploading...' : 'Add Hymn'}
                            </button>
                        </div>
                    </form>
                    <div className="back-to-home-box">
                        <Link to="/"><button>Back to Home</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddHymn;