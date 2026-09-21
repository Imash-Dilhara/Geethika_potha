import React, { useState, useEffect } from 'react';
import '../css/viewAllHymn.css';

function ViewAllHymn() {
    const [hymns, setHymns] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/getallhymns')
            .then(response => response.json())
            .then(data => setHymns(data))
            .catch(error => console.error("Error fetching data : ", error));
    }, []);

    useEffect(() => {
        const urls = {};

        hymns.forEach((hymn, index) => {
            if (hymn.pdf && hymn.pdf.data) {
                const uint8Array = new Uint8Array(hymn.pdf.data);
                const blob = new Blob([uint8Array], { type: 'application/pdf' });
                urls[hymn.r_no || index] = URL.createObjectURL(blob);
            }
        });

        return () => {
            Object.values(urls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [hymns]);

    return (
        <div className="tableBox">
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
                    {hymns.map((hymn, index) => {                
                        return (
                            <tr key={hymn.id || index}>
                                <td>{index + 1}</td>
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
        </div>
    );
}

export default ViewAllHymn;