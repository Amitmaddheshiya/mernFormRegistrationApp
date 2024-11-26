
const getLogout = async (req, res) => {
    try {
        //logout for single device 
        //req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
       
       //logout for all device 
        req.user.tokens = [];

        res.clearCookie('jwt');
        await req.user.save();
        res.status(200).render('login');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLogout };