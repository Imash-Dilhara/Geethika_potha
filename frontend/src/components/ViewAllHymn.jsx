import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import '../css/viewAllHymn.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function ViewAllHymn() {
    const [allHymns, setAllHymns] = useState([]);
    const [filterHymn, setFilterHymn] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'HymnFlow | View Hymn';

        fetch(`${API_BASE}/api/getallhymns`)
            .then(res => res.json())
            .then(data => {
                setAllHymns(data);
                setFilterHymn(data);
            })
            .catch(error => console.error('Error fetching data : ', error))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value) {
            setFilterHymn(allHymns);
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE}/api/searchhymns?search=${encodeURIComponent(value)}`
            );
            if (!res.ok) {
                throw new Error('Search Error!');
            }
            const data = await res.json();
            setFilterHymn(data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="tableBox">
            <div className="searchHymnBox">
                <h1 className="title">Search Hymn</h1>
                <div className="searchContent">
                    <div className="searchBox">
                        <input
                            type="text"
                            className="searchBar"
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder="Search for a hymn..."
                        />
                        <img
                            src="assets/search-icon.png"
                            className="searchIcon"
                            alt="Search Icon"
                        />
                    </div>

                    {searchTerm && (
                        <div className="searchResult">
                            {filterHymn.length > 0 ? (
                                filterHymn.map((hymn, index) => (
                                    <div
                                        className="searchResultItem"
                                        key={hymn.h_no || hymn.id || index}
                                    >
                                        <a
                                            href={hymn.pdfURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <h3>{hymn.title}</h3>
                                        </a>
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

            {loading ? (
                <Loading text="Loading hymns..." />
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Lyrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allHymns.map((hymn, index) => (
                            <tr key={hymn.id || index}>
                                <td>{String(index + 1).padStart(3, '0')}</td>
                                <td>{hymn.title}</td>
                                <td>
                                    {hymn.singerFname}{' '}
                                    {hymn.singerLname === 'Unknown' ? '' : hymn.singerLname}
                                </td>
                                <td className="pdfLink">
                                    {hymn.pdfURL ? (
                                        <a
                                            href={hymn.pdfURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View PDF
                                        </a>
                                    ) : (
                                        'No PDF'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="back-to-home-box">
                <Link to="/">
                    <button>Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default ViewAllHymn;