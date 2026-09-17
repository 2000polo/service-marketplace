const providerOnly = async (req, res, next) => {
    if(req.user.role !== "provider"){
        return res.status(403).json({
            success: false,
            message: "The user is not authorised to create a service"
        })
    }

    next();
}

export default providerOnly;