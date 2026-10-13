import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/createSlot.css';
import '../css/viewAllHymn.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const MAX_HYMNS = 10;

// Hymn ekata unique key ekak
const getId = (hymn) => hymn.id ?? hymn.h_no ?? hymn.r_no ?? hymn.title;

function CreateSlot() {
    const [hymns, setHymns] = useState([]);
    const [filterHymn, setFilterHymn] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/getallhymns`)
            .then(res => res.json())
            .then(data => {
                setHymns(data);
                setFilterHymn(data);
            })
            .catch(e => console.error('Error fetching data:', e));
    }, []);

    const handleChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value) {
            setFilterHymn(hymns);
            return;
        }

        try {
            const res = await fetch(`${API}/api/searchhymns?search=${encodeURIComponent(value)}`);
            if (!res.ok) throw new Error('Search Error!');
            const data = await res.json();
            setFilterHymn(data);
        } catch (e) {
            console.error(e);
        }
    };

    const isSelected = (hymn) => selected.some((h) => getId(h) === getId(hymn));

    const toggleHymn = (hymn) => {
        if (isSelected(hymn)) {
            setSelected((prev) => prev.filter((h) => getId(h) !== getId(hymn)));
        } else {
            if (selected.length >= MAX_HYMNS) {
                alert('Maximum hymns are 10!');
                return;
            }
            setSelected((prev) => [...prev, hymn]);
        }
    };

    const getHymnNo = (hymn) => {
        const index = hymns.findIndex((h) => getId(h) === getId(hymn));
        return String(index + 1).padStart(3, '0');
    };


    //Create to PDF
    const downloadMargePDF = async() => {
        
    };

    //Create to PPTX
    const downloadMargePPTX = async() => {
    };

    return (
        <div className="tableBox">
            <div className="searchHymnBox">
                <h1 className="title">Create Slot Hymns</h1>
                <div className="searchContent">
                    <div className="searchBox">
                        <input
                            type="text"
                            className="searchBar"
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder="Search for a hymn..."
                        />
                        <img src="assets/search-icon.png" className="searchIcon" alt="Search Icon" />
                    </div>

                    {searchTerm && (
                        <div className="searchResult">
                            {filterHymn.length > 0 ? (
                                filterHymn.map((hymn) => (
                                    <div
                                        className="searchResultItem"
                                        key={getId(hymn)}
                                        onClick={() => toggleHymn(hymn)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3>{hymn.title}</h3>
                                        {isSelected(hymn) && (
                                            <img src="assets/checkmark.png" alt="Check Mark" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No Hymns found</p>
                            )}
                        </div>
                    )}
                </div>
                <h1 className="title allHymnTitle">All Hymn</h1>
            </div>

            <table border={1}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Title</th>
                        <th className="checkBox-field">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {hymns.map((hymn, index) => (
                        <tr key={getId(hymn)}>
                            <td>{String(index + 1).padStart(3, '0')}</td>
                            <td>{hymn.title}</td>
                            <td className="checkBox-field">
                                <input
                                    className="checkBox"
                                    type="checkbox"
                                    checked={isSelected(hymn)}
                                    onChange={() => toggleHymn(hymn)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="selectedHymns">
                <h2>
                    Selected Hymns
                    <span id="count"> ({selected.length}/{MAX_HYMNS})</span>
                </h2>

                {selected.length > 0 && (
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Title</th>
                                <th className="checkBox-field">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selected.map((hymn) => (
                                <tr className='selected-table-data-row' key={getId(hymn)}>
                                    <td>{getHymnNo(hymn)}</td>
                                    <td>{hymn.title}</td>
                                    <td className="checkBox-field checkBox-remove">
                                        <button onClick={() => toggleHymn(hymn)}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pdf-pptx-button-box">
                <button className='pdfBtnGenerate' onClick={downloadMargePDF} disabled={selected.length === 0}>Create to PDF</button>
                <button className='pptxBtnGenerate' onClick={downloadMargePPTX} disabled={selected.length === 0}>Create to PPTX</button>
            </div>

            <div className="back-to-home-box">
                <Link to="/"><button>Back to Home</button></Link>
            </div>
        </div>
    );
}

export default CreateSlot;