import React, { useState } from 'react';
import './css/addHymn.css';

function AddHymn() { 

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <div className="addHymnFormBox">
                <div className='gradientBox'>
                    <h1>Create and Publish New Hymn</h1>
                    <form action="" className='addHymnForm'>
                        <label htmlFor="hymnTitle">Hymn Title : </label>
                        <input id='hymnTitle' type="text" placeholder='Hymn name type here'/>
                        
                        <label htmlFor="pdfFile">Choose the pdf file :</label>
                        <div className="uploadFileBox">
                            <input 
                                type="file" 
                                id="pdfFile" 
                                className="actual-file-input" 
                                onChange={handleFileChange} 
                            />
                            <label htmlFor="pdfFile" className="posh-file-button">
                                <i>Upload PDF Hymn</i>
                            </label>
                            
                            <span>{file ? file.name : 'No file chosen'}</span>
                        </div>

                        <label htmlFor="singerFname">Singer : </label>
                        <div className='singerNameBox'>
                            <input id='singerFname' type="text" placeholder='First name type here'/>
                            <input id='singerLname' type="text" placeholder='Last name type here'/>
                        </div>
                        <div className="addButton">
                            <button>
                                <img src="assets/save-icon-white.png" alt="Save Icon" />
                                Add Hymn
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddHymn;