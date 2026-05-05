
//Inactive session timeout
const SESSION_TIMEOUT = 1000 * 60 * 10; // 10 minutes

exports.sessionTimeout = (req, res, next) => {
    console.log("Session handling here")

    if (req.session.user) {

        const now = Date.now();

        if (req.session.lastActivity &&
            now - req.session.lastActivity > SESSION_TIMEOUT) {

            req.session.destroy(() => {
                return res.redirect("/login");
            });
        }

        // update activity time
        req.session.lastActivity = now;
    }
    next();
}