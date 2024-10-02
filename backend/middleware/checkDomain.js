// middleware/checkDomain.js

function checkDomain(req, res, next) {
    const allowedDomain = 'localhost';
    const origin = req.get('Origin') || req.get('Referer');
    const publicUrl = '/api/certificate/';
    
    if (req.url.startsWith(publicUrl)) {
        return next();
    }

    if (origin) {
        const url = new URL(origin);
        
        if (url.hostname === allowedDomain) {
            return next();
        }
    }

    res.status(403).json({ message: 'Forbidden' });
}

module.exports = checkDomain;