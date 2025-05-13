const Validation = ({ first_name, last_name, phone_number, email, password, confirmPassword }, isFalse = false) => {
    const error = [];
    if (!isFalse) {
        if (first_name === "" || first_name === undefined) {
            error.push('check the fileds First name is required');
        }
        if (last_name === "" || last_name === undefined) {
            error.push('check the fileds Last name is required');
        }
        if (phone_number === "" || phone_number === undefined) {
            error.push('check the filed phoneNumber is required');
        }
        else if (!/^\d{10}$/.test(phone_number)) {
            error.push('Phone number must be a 10-digit number.');
        }
    }
    if (email === "" || email === undefined) {
        error.push('check the fileds Email is required');
    }
    else if (!/[A-Za-z.0-9]{1,}@[A-Za-z]{2,15}[.][A-Za-z]{3,}$/.test(email)) {
        error.push('Email ID must be a valid email address.');
    }
    if (password === undefined || password === "") {
        error.push('check the filed password is required');
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$/.test(password)) {
        error.push('Password must be at least 10 characters long.and special character and lower and uppercase and number');
    }
    if (confirmPassword === undefined || confirmPassword === "") {
        error.push('check the filed Confirmpassword is required');
    }
    return error
}
const order_userData_Validation = ({ country, firstname, lastname, address, city, state, pincode, phonenumber }) => {
    const error = [];
    if (country === "" || country === undefined) {
        error.push('check the fileds country is required');
    }
    // if (firstname === "" || firstname === undefined) {
    //     error.push('check the fileds First name is required');
    // }
    if (lastname === "" || lastname === undefined) {
        error.push('check the fileds Last name is required');
    }
    if (address === "" || address === undefined) {
        error.push('check the filed address is required');
    }
    if (city === "" || city === undefined) {
        error.push('check the fileds city is required');
    }
    if (state === "" || state === undefined) {
        error.push('check the fileds state is required');
    }
    if (pincode === "" || pincode === undefined) {
        error.push('check the fileds pincode is required');
    }
    if (phonenumber === "" || phonenumber === undefined) {
        error.push('check the filed phoneNumber is required');
    }
    else if (!/^\d{10}$/.test(phonenumber)) {
        error.push('Phone number must be a 10-digit number.');
    }
    return error
}
module.exports = { Validation, order_userData_Validation }