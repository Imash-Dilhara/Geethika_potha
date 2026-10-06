export const validateRegister = async(formData) => {
    let errors = {};

    // First Name Validation
    if (!formData.firstName.trim()) {
        errors.firstName = "First name is required.";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const checkEmail = async(e) => {
        try{
            const response = await fetch('http://localhost:5000/api/allemail' , {
                method: 'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({
                    email : formData.email
                })
            });

            const data = await response.json();

            return data;
        }catch(e){
            console.log("Error connecting to server(Check email validation part) : " , e);
            alert("Server error. Please try again later.(Check email calidation part)");
            return false;
        }
    };

    if (!formData.email.trim()) {
        errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format.";
    }else{
        const isEmailExists = await checkEmail();
        if(isEmailExists){
            errors.email = "Email already registered. Please try another.";
        }
    }

    //OTP validation
    if(!formData.otp){
        errors.otp = "OTP code required.";
    }

    // Password Validation
    if (!formData.password) {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password Validation
    if(!formData.confirmPassword.trim()){
        errors.confirmPassword = "Again enter password";
    }else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
};

export const validateLogin = (formData) => {
    let errors = {};
    
    errors = validateEmail(formData.userEmail);

    if (!formData.userPassword.trim()) {
        errors.userPassword = "Password is required.";
    }else if(formData.userPassword.length < 8){
        errors.userPassword = "Invalid password.";
    }

    return errors;
};

export const validationAddHymn = (formData , file) => {
    let errors = {};

    if(!formData.title.trim()){
        errors.title = "Hymn title required.";
    }

    if(!file){
        errors.pdf = "Please upload a PDF hymn file";
    }

    return errors;
};

export const validateEmail = (email) => {
    let errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        errors.userEmail = "Email is required.";
    }else if(!emailRegex.test(email)){
        errors.userEmail = "Invalid email.";
    }

    return errors;
};