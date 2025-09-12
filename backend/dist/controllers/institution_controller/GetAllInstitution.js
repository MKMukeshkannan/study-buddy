import { pool } from "../../utils/config.js";
export default async function get_all_institutions(_, res) {
    const result = await pool.query("SELECT * FROM institutions;");
    const all_institutions = result.rows;
    res.status(200).json({ msg: "got all data", sucess: true, data: all_institutions });
}
//# sourceMappingURL=GetAllInstitution.js.map