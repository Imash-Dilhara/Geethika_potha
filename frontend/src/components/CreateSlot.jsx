import React from 'react';
import { Link } from  'react-router-dom';
import '../css/createSlot.css';

function CreateHymnSolt(){
    return (
        <>
            <div className="createSlot">
                <h1>This is not ready yet. We will prepare it shortly...</h1>
            </div>
            <div className='back-to-home-box'>
                <Link to='/'><button>Back to Home</button></Link>
            </div>
        </>
    );
}

export default CreateHymnSolt;