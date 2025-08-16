function Validation(values) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!values.firstname) {
        errors.firstname = "Name Field should not be empty";
    } else {
        errors.firstname = "";
    }

    if (!values.lastname) {
        errors.lastname = "Last Name Field should not be empty";
    } else {
        errors.lastname = "";
    }

    if (!values.username) {
        errors.username = "Username Field should not be empty";
    } else {
        errors.username = "";
    }

    if (!values.email) {
        errors.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    } else {
        errors.email = "";
    }

    if (!values.password) {
        errors.password = "Password field should not be empty";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Password must be at least 8 characters long and contain at least one digit and one uppercase letter";
    } else {
        errors.password = "";
    }

    if (!values.role) {
        errors.role = "Role field should not be empty";
    } else {
        errors.role = "";
    }

    if (!values.specialization) {
        errors.specialization = "Specilization field should not be empty";
    } else {
        errors.specialization = "";
    }

    return errors;
}

export default Validation;
