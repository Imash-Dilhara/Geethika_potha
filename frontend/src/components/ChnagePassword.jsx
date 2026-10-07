import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/changePass.css';

function ChangePassword(){

    const [searchParam] = useSearchParams();
    const [userName , setUserName] = useState('');

    useEffect(() => {
        document.title = "HymnFlow | Change Password"; ;
        
        const token = searchParam.get('token');
        if(token){
            try{
                const decode = jwtDecode(token);
                if(decode.name){
                    setUserName(decode.name);
                }
            }catch(e){
                console.log("Invalid token : " , e);
            }
        }
    },[searchParam]);

    return (
        <>
            <div className="changePass-content-box">
                <h1 className='welcomeMsg'>Hello {userName ? userName : "User"},</h1>
                <div className="change-pass-form-box">
                    <h1 className='changePassFormName'>Change Password</h1>
                    <form>
                        <div className="change-pass-form-field">
                            <input name="newPassword" id="newPassword" type="password" placeholder="Enter new Password"/>
                            <br />
                            <small></small>
                        </div>
                        <div className="change-pass-form-field">
                            <input name="newConfirmPassword" id="newConfirmPassword" type="password" placeholder="Confirm new Password"/>
                            <br />
                            <small></small>
                        </div>
                        <div className="change-pass-form-field">
                            <button>Change</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;