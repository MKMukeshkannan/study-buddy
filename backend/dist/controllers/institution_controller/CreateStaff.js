import { z } from "zod";
import bcrypt from 'bcrypt';
import { pool } from "../../utils/config.js";
import { StaffSchema } from "../../utils/validators.js";
import axios from "axios";
const StaffCreation = StaffSchema.pick({ name: true, department: true, email: true, phone_number: true, google_scholar_id: true }).extend({ password: z.string() });
export default async function create_staff(req, res) {
    const { name, department, email, phone_number, password, google_scholar_id } = StaffCreation.parse(req.body);
    const IdValidator = z.object({ id: z.string().uuid() });
    const { id } = IdValidator.parse(req.body.user);
    const hashed_password = await bcrypt.hash(password, 10);
    const params = [name, email, phone_number, department, id, hashed_password, google_scholar_id];
    await pool.query(`INSERT INTO staffs (name, email, phone_number, department, institution, hashed_password, google_scholer_id) VALUES ($1, $2, $3, $4, $5, $6, $7);`, params);
    const { staff_id } = (await pool.query(`select * from staffs where phone_number=$1`, [phone_number])).rows[0];
    const data = await axios.post('http://127.0.0.1:5000/scrape-author', {
        id: staff_id,
        gs_id: google_scholar_id
    });
    console.log(data);
    res.status(200).json({ msg: "staff created ", sucess: true });
}
//# sourceMappingURL=CreateStaff.js.map