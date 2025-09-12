import { z } from "zod";
import { pool } from "../../utils/config.js";
const InstitutionId = z.string();
export default async function get_all_staffs(req, res) {
    const institution_id = InstitutionId.parse(req.params.institution_id);
    const result = await pool.query("SELECT * FROM staffs WHERE institution=$1;", [institution_id]);
    const data = result.rows;
    res.status(200).json({ msg: "got all the staffs belong to the given institution,", sucess: true, data });
}
//# sourceMappingURL=GetAllStaff.js.map