import { z } from "zod";
import { pool } from "../../utils/config.js";
const InstitutionId = z.string().uuid();
export default async function get_institution_id(req, res) {
    const institution_id = InstitutionId.parse(req.params.institution_id);
    const client = await pool.connect();
    try {
        const data = (await client.query("SELECT * FROM institutions WHERE ins_id=$1;", [institution_id])).rows[0];
        const tot_pub = (await client.query("SELECT COUNT(*) FROM publications WHERE staff_id IN (SELECT staff_id FROM staffs WHERE institution=$1);", [institution_id])).rows[0];
        const tot_staff = (await client.query("SELECT COUNT(*) FROM staffs WHERE institution=$1;", [institution_id])).rows[0];
        const index_cnt = (await client.query("SELECT index, COUNT(index) FROM publications WHERE staff_id IN (SELECT staff_id FROM staffs WHERE institution=$1) GROUP BY index", [institution_id])).rows;
        const type_cnt = (await client.query("SELECT type, COUNT(type) FROM publications WHERE staff_id IN (SELECT staff_id FROM staffs WHERE institution=$1) GROUP BY type", [institution_id])).rows;
        const filtered_data = {
            id: data.ins_id,
            name: data.name,
            address: data.address,
            founded_year: data.founded_year,
            url: data.logo_url,
            phone_number: data.phone_number,
            website: data.website,
            mail: data.mail,
            description: data.description,
            total_publications: tot_pub.count,
            total_staffs: tot_staff.count,
            index_count: index_cnt,
            type_count: type_cnt
        };
        res.status(200).json({ data: filtered_data, msg: "Retrived your profile sucessfully !!!", sucess: true });
    }
    catch (err) {
        return res.status(500).json({ msg: "Internal server error", sucess: false });
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=GetInstitutionId.js.map