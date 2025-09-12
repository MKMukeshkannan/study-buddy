import { generate_access_token, generate_refresh_token, pool } from "../../utils/config.js";
import bcrypt from "bcrypt";
import { z } from 'zod';
const Login = z.object({
    username: z.string({ required_error: "username: is required" }).min(6).max(30),
    password: z.string({ required_error: "password: is required" }),
});
export default async function staff_login(req, res) {
    const { username, password } = Login.parse(req.body);
    const result = await pool.query("SELECT * FROM staffs WHERE email=$1", [username]);
    if (!result.rowCount)
        return res.status(400).json({ sucess: false, msg: "Email do not exist" });
    const staff_data = result.rows[0];
    if (await bcrypt.compare(password, staff_data.hashed_password)) {
        const access_token = generate_access_token({
            id: staff_data.staff_id,
            name: staff_data.name,
            type: "STF",
            email: staff_data.email,
        });
        const refresh_token = generate_refresh_token({
            id: staff_data.staff_id,
            name: staff_data.name,
            email: staff_data.email,
        });
        await pool.query("INSERT INTO sessions (id, refresh_token, type) VALUES ($1, $2, $3)", [staff_data.staff_id, refresh_token, "STF"]);
        res.cookie("access_token", access_token);
        res.cookie("jwt", refresh_token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
        res.status(200).json({ sucess: true, msg: "sucessfully autheticated", name: staff_data.name, email: staff_data.email, access_token, });
    }
    else {
        res.status(401).json({ sucess: false, msg: "password is wrong" });
    }
    ;
}
//# sourceMappingURL=StaffLogin.js.map