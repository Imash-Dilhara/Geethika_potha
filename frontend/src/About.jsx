import React from 'react';
import './css/about.css';

function About(){
    return(
        <>
            <div className="about_body">
                <div className='about_contectBox_intro'>
                    <img src="assets/logo.png" alt="HymnsFlow Logo" />
                    <div>
                        <h1 className="about_title">Introduction</h1>
                        <p>HymnFlow is a comprehensive digital web application designed to serve as a centralized archive for Sri Lankan traditional and modern poetry, hymns, song lyrics, and literary compositions. In an era where digital transformation touches every aspect of modern life, this platform bridges the gap between rich cultural heritage and contemporary technology, ensuring that timeless verses and musical compositions are preserved and easily accessible to everyone.</p>
                    </div>
                </div>
                <div className='about_contectBox'>
                    <h1 className="about_title">Our Mission & Vision</h1>
                    <div className="m_v_box">
                            <div className="mission_vision">
                            <h2 className="mission_vision_title">Mission</h2>
                            <p>To create an expansive, well-structured digital archive of Sri Lankan poetry and hymns, making cultural and lyrical art forms universally accessible to students, researchers, and art lovers worldwide.</p>
                        </div>
                        <div className="mission_vision">
                            <h2 className="mission_vision_title">Vision</h2>
                            <p>To evolve into the definitive online platform for discovering, exploring, and celebrating the rich diversity of Sri Lankan lyrical and literary arts through innovative web solutions.</p>
                        </div>
                    </div>
                </div>
                <div className="about_contectBox">
                    <h1 className="about_title">Our Story / Background</h1>
                    <p>The inspiration behind HymnFlow stems from a very common practical challenge faced by many church communities and worship teams. Often, preparing for worship services involves the tedious and time-consuming process of manually typing out, copying, or searching for hymn lyrics across scattered sources.</p>
                    <p>Recognizing this struggle, this platform was created to provide a simple, centralized, and reliable digital solution. Our goal is to ensure that anyone—whether in a church choir, a worship gathering, or practicing at home—can effortlessly find and access the lyrics they need at any given moment. What started as a solution to ease worship preparation has grown into a dedicated digital sanctuary, making it seamless and joyful to lift our voices in song without the hassle of administrative hurdles.</p>
                </div>
                <img className='aboutImage' src="assets/about.jpg" alt="About photo" />
            </div>
        </>
    );
}

export default About;
