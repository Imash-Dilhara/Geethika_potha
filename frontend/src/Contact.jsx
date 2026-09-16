import React from 'react';
import './css/contact.css';

function Contact(){
    return(
        <>
            <div className="contact_body">
                <div className="formBox">
                    <h1 className='title'>Get In Touch</h1>
                    <form action="">
                        <label htmlFor="">Name</label><br/>
                        <input type="text" placeholder='Ex : Sunil De Silva' /><br /><br />
                        <label htmlFor="">Email Address</label><br/>
                        <input type="email" placeholder='Ex : sunil@example.com'/><br /><br />
                        <label htmlFor="">Subject</label><br />
                        <input type="text" placeholder='Enter the subject what you write'/><br /><br />
                        <label htmlFor="">Message</label><br />
                        <textarea name="" id="" placeholder='Write message here'></textarea><br /><br />
                        <div className='buttonBox'>
                            <button><img src="assets/email.png" alt="Message Send Image" />Send Message</button>
                        </div>
                    </form>
                </div>
                <div className="contactWithUsBox formBox">
                    <h1 className='title'>Contact With Us</h1>
                    <h3>Email :</h3>
                    <div className='contactContent'>
                        <img src="assets/email.png" alt="Email image" />
                        <p>imashdilhara1225@gmail.com</p>
                    </div>
                    <h3>Location :</h3>
                    <div className="contactContent">
                        <img src="assets/location.png" alt="Location image" />
                        <p>Sri Lanka</p>
                    </div>
                    <h3>Contact Number :</h3>
                    <div className="contactContent">
                        <img src="assets/call.png" alt="Location image" />
                        <p>072 302 3095</p>
                    </div>
                    <h3>Community Note :</h3>
                    <p className='communityPara'>Whether you are a choir leader, worship coordinator, or a poetry enthusiast, your suggestions help us grow this digital sanctuary.</p>
                    <div className="socialMedia">
                        <img src="assets/fb.png" alt="" />
                        <img src="assets/instagram.png" alt="" />
                        <img src="assets/linkedin.png" alt="" />
                        <img src="assets/whatsapp.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;