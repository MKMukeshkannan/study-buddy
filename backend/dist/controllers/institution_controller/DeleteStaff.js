import { z } from "zod";
import { pool } from "../../utils/config.js";
export default async function delete_staff(req, res) {
    const IdValidator = z.object({ id: z.string().uuid() });
    const { id } = IdValidator.parse(req.body.user);
    console.log(id);
    await pool.query(`DELETE FROM staffs WHERE staff_id=$1`, [id]);
    res.status(200).json({ msg: "deleted", sucess: true });
}
//# sourceMappingURL=DeleteStaff.js.map