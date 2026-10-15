import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import PptxGenJS from 'pptxgenjs';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Loading from '../loading';
import '../css/createSlot.css';
import '../css/viewAllHymn.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const MAX_HYMNS = 10;

const getId = (hymn) => hymn.h_no ?? hymn.id ?? hymn.title;

const fetchPdfBytes = async (hymn) => {
    if (!hymn.pdfURL) throw new Error('No PDF URL');
    const res = await fetch(hymn.pdfURL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
};

const saveBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
};

function CreateSlot() {
    const [hymns, setHymns] = useState([]);
    const [filterHymn, setFilterHymn] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);
    const [busy, setBusy] = useState(false);
    const [fileName, setFileName] = useState('Hymns-Collection');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'HymnFlow | Create Slot';

        fetch(`${API}/api/getallhymns`)
            .then((res) => res.json())
            .then((data) => {
                setHymns(data);
                setFilterHymn(data);
            })
            .catch((e) => console.error('Error fetching data:', e))
            .finally(() => setLoading(false));
    }, []);

    const fileNameHandle = (e) => {
        setFileName(e.target.value);
    };

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

    const getSafeFileName = () => fileName.trim() || 'Hymns-Collection';

    // Create PDF
    const downloadMargePDF = async () => {
        if (selected.length === 0 || busy) return;
        setBusy(true);

        try {
            const mergedPdf = await PDFDocument.create();
            const failed = [];

            for (const hymn of selected) {
                try {
                    const bytes = await fetchPdfBytes(hymn);
                    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
                    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    pages.forEach((page) => mergedPdf.addPage(page));
                } catch (err) {
                    console.error('PDF failed:', hymn.title, err);
                    failed.push(hymn.title);
                }
            }

            if (mergedPdf.getPageCount() === 0) {
                alert('No PDF files found to merge.');
                return;
            }

            if (failed.length > 0) {
                alert('Skip this hymns : ' + failed.join(', '));
            }

            const mergedBytes = await mergedPdf.save();
            saveBlob(new Blob([mergedBytes], { type: 'application/pdf' }), `${getSafeFileName()}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Can not create PDF.');
        } finally {
            setBusy(false);
        }
    };

    // Create PPTX
    const downloadMargePPTX = async () => {
        if (selected.length === 0 || busy) return;
        setBusy(true);

        try {
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9';
            const SLIDE_W = 10;
            const SLIDE_H = 5.625;
            const failed = [];
            let slideCount = 0;

            for (const hymn of selected) {
                try {
                    const bytes = await fetchPdfBytes(hymn);
                    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2 });

                        const canvas = document.createElement('canvas');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        await page.render({ canvasContext: ctx, viewport }).promise;

                        const ratio = viewport.width / viewport.height;
                        let w = SLIDE_W;
                        let h = w / ratio;
                        if (h > SLIDE_H) {
                            h = SLIDE_H;
                            w = h * ratio;
                        }

                        const slide = pptx.addSlide();
                        slide.background = { color: 'FFFFFF' };
                        slide.addImage({
                            data: canvas.toDataURL('image/png'),
                            x: (SLIDE_W - w) / 2,
                            y: (SLIDE_H - h) / 2,
                            w,
                            h,
                        });
                        slideCount++;
                    }
                } catch (err) {
                    console.error('PPTX failed:', hymn.title, err);
                    failed.push(hymn.title);
                }
            }

            if (slideCount === 0) {
                alert('No PDF files found to generate slides.');
                return;
            }

            if (failed.length > 0) {
                alert('Me hymns skip una: ' + failed.join(', '));
            }

            await pptx.writeFile({ fileName: `${getSafeFileName()}.pptx` });
        } catch (err) {
            console.error(err);
            alert('PPTX hadanna bari una.');
        } finally {
            setBusy(false);
        }
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

            {loading ? (
                <Loading text="Loading hymns..." />
            ) : (
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
            )}

            <div className="selectedHymns">
                <h2>
                    Selected Hymns
                    <span id="count"> ({selected.length}/{MAX_HYMNS})</span>
                </h2>

                {selected.length > 0 && (
                    <>
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
                                    <tr className="selected-table-data-row" key={getId(hymn)}>
                                        <td>{getHymnNo(hymn)}</td>
                                        <td>{hymn.title}</td>
                                        <td className="checkBox-field checkBox-remove">
                                            <button onClick={() => toggleHymn(hymn)}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="fileNameBox">
                            <input
                                className="fileName-field"
                                type="text"
                                placeholder="Enter file name"
                                value={fileName}
                                onChange={fileNameHandle}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="pdf-pptx-button-box">
                <button
                    className="pdfBtnGenerate"
                    onClick={downloadMargePDF}
                    disabled={selected.length === 0 || busy}
                >
                    {busy ? 'Please wait...' : 'Create to PDF'}
                </button>
                <button
                    className="pptxBtnGenerate"
                    onClick={downloadMargePPTX}
                    disabled={selected.length === 0 || busy}
                >
                    {busy ? 'Please wait...' : 'Create to PPTX'}
                </button>
            </div>

            <div className="back-to-home-box">
                <Link to="/">
                    <button>Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default CreateSlot;