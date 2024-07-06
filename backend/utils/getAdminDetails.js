const jwt = require('jsonwebtoken');
const JWT_Token = process.env.JWT_TOKEN;

function getUserCrn(token) {
    if (!token) {
        throw new Error('Authentication token not provided');
    }
    try {
        // Verify the token and decode its payload
        const decodedToken = jwt.verify(token, JWT_Token);
        // Return the user role
        return decodedToken.crn;
    } catch (error) {
        return false;
    }
}

module.exports = getUserCrn;
