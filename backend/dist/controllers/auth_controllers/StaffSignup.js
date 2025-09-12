import bcrypt from "bcrypt";
import { pool } from "../../utils/config.js";
import { StaffSchema } from "../../utils/validators.js";
import { z } from "zod";
const StaffCreation = StaffSchema.omit({ staff_id: true, hashed_password: true }).extend({ password: z.string({ required_error: "Password is required" }) });
export default async function staff_signup(req, res) {
    if (!req.body)
        return;
    const { name, phone_number, department, designation, email, institution, profile_picture, password, } = StaffCreation.parse(req.body);
    const hashed_password = await bcrypt.hash(password, 10);
    const params = [name, designation, email, phone_number,
        department, profile_picture, institution, hashed_password,];
    await pool.query(`INSERT INTO staffs ( name, designation, email, phone_number, department, profile_picture, institution, hashed_password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, params);
    res
        .status(200)
        .json({ msg: "created staff record sucessfully", sucess: true });
}
//# sourceMappingURL=StaffSignup.js.map