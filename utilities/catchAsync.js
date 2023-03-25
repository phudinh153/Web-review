module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(e => {
            if(e.name === 'CastError' && e.kind === 'ObjectId'){
                req.flash('error', 'Invalid ID');
                return res.redirect('/attraction');
            }

            next(e)});
    };
};