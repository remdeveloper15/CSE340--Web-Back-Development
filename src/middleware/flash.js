// Middleware to handle flash messages
const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {
        if (!req.session.flash) {
            req.session.flash = { success: [], error: [], warning: [], info: [] };
        }

        // Save: If there is type and message, add the message to the corresponding type array
        if (type && message) {
            if (!req.session.flash[type]) req.session.flash[type] = [];
            req.session.flash[type].push(message);
            return;
        }

        // Get a type: If there is only a type, return those messages and clear them
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // Get all messages: If there are no arguments, return all messages and clear the session
        const allMessages = req.session.flash || { success: [], error: [], warning: [], info: [] };

        req.session.flash = { success: [], error: [], warning: [], info: [] };
        return allMessages;
    };
    next();
}

// Middleware to make flash messages available to all templates
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
}

// Combine the two middlewares into one for easier use in server.js
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

// Exports
export default flash;