import React from "react";
import Navbar from "./navbar.jsx";
import Footer from './footer.jsx';
import './css/App.css';

function App(){
    return(
        <div>
            <Navbar/>
            <div class="contentBox">
                <h1 class="title">Explore Worship Hymns</h1>
                <p class="searchPara">Discover lyrics and curate songs for your upcoming worship session</p>
                <div class="searchBox">
                    <input type="text" class="searchBar" placeholder="Search for a hymn..."/>
                    <img src="assets/search-icon.png" class="searchIcon" alt="Search Icon"/>
                </div>
                <div class="sideBox">
                    <div class = "add">
                        <div>
                            <h1 class = "boxName">Add Hymn</h1>
                            <p>"Contribute to our growing library by adding new hymns. Click here to input song details, lyrics, and make them available for everyone."</p>
                            <h3>Click Here</h3>
                        </div>
                    </div>
                    <div class="left">
                        <div>
                            <h1 class="boxName">View Hymns</h1>
                            <p>"Discover all available hymns in our database. Click here to browse through the entire collection, find your favorite worship songs, and view their full details."</p>
                            <h3>Click Here</h3>
                        </div>
                    </div>
                    <div class="right">
                        <div>
                            <h1 class="boxName">Create Hymn Slot</h1>
                            <p>"Plan and organize your worship service with ease. Select up to 10 hymns from the library, customize their order, and launch them into a presentation-ready slot."</p>
                            <h3>Click Here</h3>
                        </div>
                    </div>
                </div>
        
                <h1 class= 'title'>How To Use HymnFlow</h1>
        
                <div class="modifySearchBox">
                    <img src="assets/modify-search.png" alt="Modify Search"/>
                    <div>
                        <h2>Master Your Search: The Journey of Discovery</h2>
                        <p>Use the advanced search capabilities to find songs by title, keywords, lyrical themes, meter, and liturgical season. The system works to deliver precise matches from our vast repository, ranging from foundational chants to contemporary praises, complete with quick previews for lyrics and tunes.</p>
                    </div>
                </div>
                <div class="modifySearchBox">
                    <img src="assets/select-icon.png" alt="select icon"/>
                    <div>
                        <h2>Curate Your Collection: Creating a Perfect Hymn Slot</h2>
                        <p>The 10-song slot system allows you to build curated lists for different church services (e.g., Sunday Service, Communion, Advent, or Festive Celebrations). Effortlessly add hymns, customize their sequence, and save your custom slots to match your service flow perfectly.</p>
                    </div>
                </div>
                <div class="modifySearchBox">
                    <img src="assets/presentation-icon.png" alt="presentation icon"/>
                    <div>
                        <h2>Present with Power: Launching Your Presentation Slides</h2>
                        <p>Launch clean, professional, and distraction-free slides in a single click. Features include optimal font choices for congregation readability, multiple slide layout options, subtle background graphics, and seamless transitions between hymns to support worship leaders.</p>
                    </div>
                </div>
        
                <h1 class="title">Status</h1>
        
                <div class="quickSection">
                    <div>
                        <img src="assets/group-icon.png" alt="Group Icon"/>
                        <h3>500+</h3>
                        <p>Hymns Available</p>
                    </div>
                    <div>
                        <img src="assets/playlist-icon.png" alt="Play List Icon"/>
                        <h3>100+</h3>
                        <p>Playlists Created</p>
                    </div>
                    <div>
                        <img src="assets/free-icon.png" alt="Free Icon"/>
                        <h3>100%</h3>
                        <p>Free to Use</p>
                    </div>
                </div>
                <p class="bibleTitle">"Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom through psalms, hymns, and songs from the Spirit, singing to God with gratitude in your hearts."</p>
                <p class="biblePart">Colossians 3:16</p>
            </div>
            <Footer/>
        </div>
    );
}

export default App;