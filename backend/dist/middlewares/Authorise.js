import pkg from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";
const { verify } = pkg;
function authrizeToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token || token === 'undefined')
        return res.status(401).json({ sucess: false, error: "Token is not provided, 'Bearer <access_token>" });
    if (!JWT_SECRET)
        throw new Error("invalid token");
    verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ sucess: false, error: "cannot decode token", err });
        req.body.user = user;
        next();
    });
}
export { authrizeToken };
//# sourceMappingURL=Authorise.js.map