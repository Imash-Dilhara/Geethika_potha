import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/viewAllHymn.css';

function ViewAllHymn() {
    const [allHymns, setAllHymns] = useState([]);
    const [searchTerm  , setSearchTerm] = useState('');
    const [hymns , setHymns] = useState([]);
    const [filterHymn , setFilterHymn] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/getallhymns`)
            .then(res => res.json())
            .then(data => {
                setHymns(data);
                setFilterHymn(data);
            }).catch(e => console.error(e));
    } , []);

    const handleChange = async(e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if(!value){
            setFilterHymn(hymns);
            return;
        }
        
        try{
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/searchhymns?search=${value}`);
            if(!res.ok){
                throw new Error('Search Error!');
            }
            const data = await res.json();
            setFilterHymn(data);
        }catch(e){
            console.error(e);
        }
    };

    

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/getallhymns`)
            .then(response => response.json())
            .then(data => setAllHymns(data))
            .catch(error => console.error("Error fetching data : ", error));
    }, []);

    useEffect(() => {
        const urls = {};

        document.title = 'HymnFlow | View Hymn';

        allHymns.forEach((hymn, index) => {
            if (hymn.pdf && hymn.pdf.data) {
                const uint8Array = new Uint8Array(hymn.pdf.data);
                const blob = new Blob([uint8Array], { type: 'application/pdf' });
                urls[hymn.r_no || index] = URL.createObjectURL(blob);
            }
        });

        return () => {
            Object.values(urls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [allHymns]);

    return (
        <div className="tableBox">
            <div className='searchHymnBox'>
                <h1 className='title'>Search Hymn</h1>
                <div className="searchContent">
                    <div className="searchBox">
                        <input type="text" className="searchBar" value={searchTerm} onChange={handleChange} placeholder="Search for a hymn..."/>
                        <img src="assets/search-icon.png" className="searchIcon" alt="Search Icon"/>
                    </div>
        
                    {searchTerm && (
                        <div className="searchResult">
                            {filterHymn.length > 0 ? (
                                filterHymn.map(hymn => (
                                    <div className="searchResultItem" key = {hymn.h_no}>
                                        <a href={hymn.pdfURL} target="_blank" rel="noopener noreferrer">
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
                <h1 className='title allHymnTitle'>All Hymn</h1>
            </div>

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
                    {allHymns.map((hymn, index) => {                
                        return (
                            <tr key={hymn.id || index}>
                                <td>{String(index + 1).padStart(3,"0")}</td>
                                <td>{hymn.title}</td>
                                <td>{hymn.singerFname}</td>
                                <td className='pdfLink'>
                                    {hymn.pdfURL ? (
                                        <a href={hymn.pdfURL} target='_blank' rel='noopener noreferrer'>View PDF</a>
                                    ) : (
                                        "No PDF "
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='back-to-home-box'>
                <Link to='/'><button>Back to Home</button></Link>
            </div>
        </div>
    );
}

export default ViewAllHymn;