import { z } from 'zod';
import { generate_access_token, pool, REFRESH_SECRET } from '../../utils/config.js';
import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;
const SessionSchema = z.object({
    id: z.string(),
    refresh_token: z.string(),
    type: z.string()
});
/* FUNCTION STARTS HERE
 * */
export default async function get_refresh_token(req, res) {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.jwt))
        return res.status(401).json({ sucess: false, error: "No JWT Token is given" });
    const refresh_token = cookie.jwt;
    const result = (await pool.query("SELECT * FROM sessions WHERE refresh_token = $1", [refresh_token])).rows[0];
    if (!result)
        return res.status(404).json({ sucess: false, error: "refresh_token token is not found in database" });
    if (!REFRESH_SECRET)
        throw new Error("invalid token");
    if (result.type == "INS") {
        const data = (await pool.query("SELECT * FROM institutions WHERE ins_id=$1", [result.id])).rows[0];
        verify(refresh_token, REFRESH_SECRET, (err, decoded) => {
            if (err || data.ins_id !== decoded.id) {
                res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true, });
                res.clearCookie("access_token");
                return res.status(403).json({ sucess: false, error: "maybe expired or Decoded token is not yours" });
            }
            const access_token = generate_access_token({
                id: data.ins_id,
                name: data.name,
                type: "INS",
                email: data.mail,
            });
            res.cookie("access_token", access_token);
            return res.status(200).json({ name: data.name, email: data.mail, access_token, type: "INS" });
        });
    }
    else if (result.type === "STF") {
        const data = (await pool.query("SELECT * FROM staffs WHERE staff_id=$1", [result.id])).rows[0];
        verify(refresh_token, REFRESH_SECRET, (err, decoded) => {
            if (err || data.staff_id !== decoded.id)
                return res.status(403).json({ sucess: false, error: "maybe expired or Decoded token is not yours" });
            const access_token = generate_access_token({
                id: data.staff_id,
                name: data.name,
                type: "STF",
                email: data.email,
            });
            res.cookie("access_token", access_token);
            return res.status(200).json({ name: data.name, email: data.email, access_token, type: "STF" });
        });
    }
    res.status(400).json({ msg: "invalid type", sucess: false });
}
//# sourceMappingURL=RefreshToken.js.map