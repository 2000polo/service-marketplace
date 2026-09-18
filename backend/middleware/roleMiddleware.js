export const providerOnly = async (req, res, next) => {
    if(req.user.role !== "provider"){
        return res.status(403).json({
            success: false,
            message: "You are not authorized to perform this action"
        })
    }

    next();
}

export const customerOnly = async (req, res, next) => {
    if(req.user.role !== "customer"){
        return res.status(403).json({
            success: false,
            message: "You are not authorized to perform this action"
        })
    }

    next();
}