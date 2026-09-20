export const validateRegister = (formData) => {
    let errors = {};

    // First Name Validation
    if (!formData.firstName.trim()) {
        errors.firstName = "First name is required.";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format.";
    }

    // Password Validation
    if (!formData.password) {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password Validation
    if(!formData.confirmPassword.trim()){
        errors.confirmPassword = "*Again enter password";
    }else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
};

export const validateLogin = (formData) => {
    let errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail.trim()) {
        errors.userEmail = "Email is required.";
    }else if(!emailRegex.test(formData.userEmail)){
        errors.userEmail = "Invalid email.";
    }
    
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