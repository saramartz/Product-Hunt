export default function validateSignup(values) {
    let errors = {}

    // Validate Name
    !values.name && (errors.name = 'Please enter a name')

    // Validate Email
    if (!values.email) {
        errors.email = 'Please enter an email'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Email not valid'
    }

    // Validate Password
    if (!values.password) {
        errors.password = 'Please enter a password'
    } else if (values.password.length < 6) {
        errors.password = 'Password must be 6 characters'
    }

    return errors
}
