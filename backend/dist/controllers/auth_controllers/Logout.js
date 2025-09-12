import { pool } from '../../utils/config.js';
export default async function log_out(req, res) {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.jwt))
        return res.sendStatus(204);
    const refresh_token = cookie.jwt;
    const result = await pool.query("SELECT * FROM sessions WHERE refresh_token = $1", [refresh_token]);
    const data = result.rows[0];
    if (!data) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.clearCookie("access_token");
        return res.sendStatus(203);
    }
    await pool.query("DELETE FROM sessions WHERE refresh_token=$1", [refresh_token]);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true, });
    res.clearCookie("access_token");
    res.sendStatus(204);
}
//# sourceMappingURL=Logout.js.map