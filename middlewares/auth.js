module.exports = {

    isLogged() {
        return (req, res, next) => {
            return req.isAuthenticated() ? 
                next() : res.redirect('/login');
        }
    },
    
    isNotLogged() {
        return (req, res, next) => {
            return req.isAuthenticated() ? 
                res.redirect('/profile') : next();
        }
    }
}