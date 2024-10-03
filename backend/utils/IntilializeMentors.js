const Mentor = require('../models/mentors'); // Import the Mentor model

// List of mentors
const teachers = [
    "DR. PARMINDER SINGH",
    "AMANPREET SINGH BRAR",
    "JASBIR SINGH SAINI",
    "DR. KIRAN JYOTI",
    "DR. AMANDEEP KAUR SOHAL",
    "DR. AMIT JAIN",
    "DR. DALJEET SINGH",
    "DR. HARDEEP SINGH KANG",
    "DR. INDERJIT SINGH DHANOA",
    "DR. KAMALDEEP KAUR",
    "DR. KAPIL SHARMA",
    "DR. MANPREET KAUR MAND",
    "DR. PRIYANKA ARORA",
    "DR. SITA RANI",
    "DR. VIVEK THAPAR",
    "ER. DIANA NAGPAL",
    "ER. GOLDENDEEP KAUR",
    "ER. JASDEEP KAUR JOIA",
    "ER. JASMINE KAUR",
    "ER. JASWANT SINGH",
    "ER. KAMALJEET KAUR",
    "ER. KULJIT KAUR",
    "ER. LAKHVIR KAUR GREWAL",
    "ER. MANJOT KAUR GILL",
    "ER. MEETALI",
    "ER. PALAK SOOD",
    "ER. PRITI AGGARWAL",
    "ER. SATINDERPAL SINGH",
    "ER. SHAILJA",
    "ER. SUPREET KAUR",
    "ER. TAMAN KUMAR",
    "ER. HARKOMAL PREET KAUR",
    "ER. PARAMVEER KAUR"
];

// Function to initialize mentors
async function initializeMentors() {
    try {
        const mentorsCount = await Mentor.countDocuments({});
        if (mentorsCount === 0) {
            const mentorData = teachers.map(name => ({ name })); // Convert names into objects
            await Mentor.insertMany(mentorData); // Insert all mentors into the database
            console.log("Initialized mentors collection with mentor names");
        } else {
            console.log("Mentors collection is already initialized");
        }
    } catch (error) {
        console.error("Error initializing mentors collection:", error);
    }
}

module.exports = { initializeMentors };
