import { z } from "zod";
import { pool } from "../../utils/config.js";
export default async function get_staff_id(req, res) {
    const IdValidator = z.string().uuid();
    const profile_id = IdValidator.parse(req.params.staff_id);
    const client = await pool.connect();
    try {
        const data = (await client.query("SELECT * FROM staffs WHERE staff_id = $1;", [profile_id,])).rows[0];
        const publications = await client.query("SELECT * FROM publications WHERE staff_id = $1 ORDER BY year;", [profile_id]);
        const index = await client.query("SELECT index,COUNT(index) FROM publications WHERE staff_id = $1 GROUP BY index;", [profile_id]);
        const types = await client.query("SELECT type as category,COUNT(type) as value FROM publications WHERE staff_id = $1 GROUP BY type;", [profile_id]);
        const types_year = await client.query("SELECT type as category,year,COUNT(year) as value FROM publications WHERE staff_id = $1 GROUP BY type,year;", [profile_id]);
        const year_cite = await client.query("SELECT year, SUM(number_of_citation) AS citations FROM staff_year_citation WHERE staff_id = $1 GROUP BY year;", [profile_id]);
        const idx_year = await client.query("SELECT index, year, COUNT(year) FROM publications WHERE staff_id= $1 GROUP BY index, year;", [profile_id]);
        console.log(data);
        const filtered_data = {
            staff: {
                name: data.name,
                department: data.department,
                description: data.description,
                institution: data.institution,
                gs_link: data.google_scholar_id,
                linkedin: data.linked_in,
                research_gate: "https://www.researchgate.net/profile/",
            },
            chart: {
                citations: year_cite.rows,
                publications: index.rows,
                indexdata: idx_year.rows,
                area: types_year.rows,
            },
            h_index: data.h_index,
            i_index: data.i_index,
            publication_count: types.rows,
            publications: publications.rows,
        };
        res.status(200).json({ msg: "got all data", sucess: true, data: filtered_data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", sucess: false });
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=GetStaffID.js.map