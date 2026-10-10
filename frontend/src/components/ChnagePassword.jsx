import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { changePassword } from '../utils/creat-account-validation';
import '../css/changePass.css';

function ChangePassword(){

    const [searchParam] = useSearchParams();
    const [userName , setUserName] = useState('');
    const [id , setId] = useState('');
    const [isChange , setIsChange] = useState(false);
    const [errors , setErrors] = useState({});
    const [changeData , setChangeData] = useState({
        newPassword: '',
        newConfirmPassword: ''
    });

    const handleChange = (e) => {
        setChangeData( {...changeData , [e.target.name] : e.target.value} );
    };

    useEffect(() => {
        document.title = "HymnFlow | Change Password"; ;
        
        const token = searchParam.get('token');
        if(token){
            try{
                const decode = jwtDecode(token);
                if(decode.name){
                    setUserName(decode.name);
                    setId(decode.id);
                }
            }catch(e){
                console.log("Invalid token : " , e);
            }
        }
    },[searchParam]);

    const changePasswordSubmit = async(e) => {
        e.preventDefault();
        
        const changeError = changePassword(changeData);
        setErrors(changeError);

        if(Object.keys(changeError).length === 0){
            try{
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/change-password` , {
                    method: 'POST',
                    headers: {'Content-type' : 'application/json'},
                    body: JSON.stringify({
                        id : id,
                        newPassword : changeData.newPassword
                    })
                });

                const data = await response.json();

                if(response.ok){
                    alert("Password change successfully!");
                    setIsChange(true);
                }else{
                    alert("Password change fail. Try again!");
                    setIsChange(false);
                }
            }catch(err){
                console.error("Password change server : " , err);
            }
        }

    };

    return (
        <>
            <div className="changePass-content-box">
                <div className="headerBox">
                    <img src="../assets/logo-white.png" alt="Hymn Flow logo" />
                    <h1 className='welcomeMsg'>Hello {userName ? userName : "User"},</h1>
                </div>
                <div className="change-pass-form-box">
                    <h1 className='changePassFormName'>Change Password</h1>
                    <form onSubmit={changePasswordSubmit} noValidate>
                        <div className="change-pass-form-field">
                            <input 
                                name="newPassword" 
                                id="newPassword" 
                                type="password" 
                                placeholder="Enter new Password"
                                onChange={handleChange}
                            />
                            <small>{errors.password}</small>
                        </div>
                        <div className="change-pass-form-field">
                            <input 
                                name="newConfirmPassword" 
                                id="newConfirmPassword" 
                                type="password" 
                                placeholder="Confirm new Password"
                                onChange={handleChange}
                            />
                            <small>{errors.confirmPassword}</small>
                        </div>
                        <div className="change-pass-form-field">
                            <button>Change</button>
                        </div>
                    </form>
                </div>
            </div>

            {isChange && (
                <div className='afterChangedBox'>
                    
                </div>
            )}
        </>
    );
}

export default ChangePassword;