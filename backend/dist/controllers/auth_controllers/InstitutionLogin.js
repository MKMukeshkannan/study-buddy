import bcrypt from "bcrypt";
import { z } from "zod";
import { generate_access_token, generate_refresh_token, pool } from "../../utils/config.js";
const Login = z.object({
    username: z.string({ required_error: "username: is required" }).min(6).max(30),
    password: z.string({ required_error: "password: is required" }),
});
export default async function institute_login(req, res) {
    const { username, password } = Login.parse(req.body);
    const result = await pool.query("SELECT * FROM institutions WHERE mail=$1", [username]);
    if (!result.rowCount)
        return res.status(400).json({ message: "Email do not exist" });
    const institution_data = result.rows[0];
    if (await bcrypt.compare(password, institution_data.hashed_password)) {
        const access_token = generate_access_token({
            id: institution_data.ins_id,
            name: institution_data.name,
            type: 'INS',
            email: institution_data.mail,
        });
        const refresh_token = generate_refresh_token({
            id: institution_data.ins_id,
            name: institution_data.name,
            email: institution_data.mail,
        });
        await pool.query("INSERT INTO sessions (id, refresh_token, type) VALUES ($1, $2, $3)", [institution_data.ins_id, refresh_token, "INS"]);
        res.cookie("access_token", access_token);
        res.cookie("jwt", refresh_token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
        res.status(200).json({ sucess: true, msg: "sucessfully autheticated", name: institution_data.name, email: institution_data.mail, access_token, type: 'INS' });
    }
    else {
        res.status(401).json({ sucess: false, msg: "password is wrong" });
    }
    ;
}
;
//# sourceMappingURL=InstitutionLogin.js.map