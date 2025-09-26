export const ownerOrAdminMiddleware = (getResourceOwnerId)=>{
    return async (req, res, next)=>{
        try{
            const ownerId = await getResourceOwnerId(req);

            if (req.user.role === "admin" || req.user.userId === ownerId.toString()){
                return next();
            }

            res.status(403).json({message: "acceso denegado: solo propietario o admin"});
        } catch (err) {
            res.status(500).json({message: "error en autorizacion", error: err.message});
        }
    };
};