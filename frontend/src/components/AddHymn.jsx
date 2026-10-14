import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { validationAddHymn } from '../utils/creat-account-validation';
import '../css/addHymn.css';

function AddHymn() { 

    useEffect (() => {
        document.title = 'HymnFlow | Add Hymn';
    } , []);

    const [file, setFile] = useState(null);

    const [formData , setFormData] = useState({
        title : '',
        firstName: '',
        lastName:''
    });

    const [errors , setErrors] = useState({});

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleChange = (e) => {
        setFormData({...formData , [e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationError = validationAddHymn(formData , file);
        setErrors(validationError);

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if(!token || !userId){
            alert("Please, First register!");
            return;
        }

        if(Object.keys(validationError).length === 0){
            const dataToSend = new FormData();
            dataToSend.append('title' , formData.title);
            dataToSend.append('firstName' , formData.firstName || 'Unknown');
            dataToSend.append('lastName' , formData.lastName || 'Unknown');
            dataToSend.append('userId' , userId);

            if(file){
                dataToSend.append('pdf' , file);
            }

            try{
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/addhymn` , {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: dataToSend
                });

                const result = await response.json();

                if(response.ok){
                    alert("Hymn added successfully!");
                    console.log("Form submitted successfully!", result.message);
                    setErrors({});
                    setFormData({
                        title: '',
                        firstName: '',
                        lastName: ''
                    });
                    setFile(null);
                }else{
                    alert(`Error: ${result.message || 'Something went wrong'}`);
                }
            }catch(e){
                console.error("Error submitting hymn:", e);
                alert("Server error. Please check your backend connection.");
            }
        }
    };

    return (
        <>
            <div className="addHymnFormBox">
                <div className='gradientBox'>
                    <h1>Create and Publish New Hymn</h1>
                    <i className='constraints'>Please check if the hymn you are trying to add already exists before adding it.</i>
                    <form className='addHymnForm' onSubmit={handleSubmit} noValidate>
                        <label htmlFor="title">Hymn Title : </label>
                        <input name='title' id='hymnTitle' type="text" value={formData.title} onChange={handleChange} placeholder='Hymn name type here'/>
                        <small>{errors.title}</small>
                        
                        <label htmlFor="pdfFile">Choose the pdf file :</label>
                        <div className="uploadFileBox">
                            <input 
                                name='pdf'
                                type="file" 
                                id="pdfFile" 
                                accept='.pdf'
                                className="actual-file-input" 
                                onChange={handleFileChange} 
                            />
                            <label htmlFor="pdfFile" className="posh-file-button">
                                <i>Upload PDF Hymn</i>
                            </label>
                            
                            <span>{file ? file.name : 'No file chosen'}</span>
                        </div>
                        <small>{errors.pdf}</small>

                        <label htmlFor="singerFname">Singer : </label>
                        <div className='singerNameBox'>
                            <input name='firstName' id='singerFname' type="text" value={formData.firstName} onChange={handleChange} placeholder='First name type here'/>
                            <input name='lastName' id='singerLname' type="text" value={formData.lastName} onChange={handleChange} placeholder='Last name type here'/>
                        </div>
                        <div className="addButton">
                            <button type="submit">
                                <img src="assets/save-icon-white.png" alt="Save Icon" />
                                Add Hymn
                            </button>
                        </div>
                    </form>
                    <div className='back-to-home-box'>
                        <Link to='/'><button>Back to Home</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddHymn;