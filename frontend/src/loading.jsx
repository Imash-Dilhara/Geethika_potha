import './css/loading.css';

function Loading({ text = 'Loading...' }) {
    return (
        <div className="hymn-loader">
            <div className="spinner"></div>
            <p>{text}</p>
        </div>
    );
}

export default Loading;