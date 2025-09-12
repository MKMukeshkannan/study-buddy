import { z } from "zod";
import { pool } from "../../utils/config.js";
export default async function create_publication(req, res) {
    const PublicationValidator = z.object({
        title: z.string().optional(),
        year: z.string().optional(),
        journal: z.string().optional(),
        volume: z.string().optional(),
        issue: z.string().optional(),
        pages: z.string().optional(),
        publisher: z.string().optional(),
        description: z.string().optional(),
        citation: z.string().optional(),
        url: z.string().optional(),
        catagory: z.string().optional(),
        index: z.string().optional(),
        issn: z.string().optional(),
        staff_id: z.string().uuid().optional(),
    });
    const { staff_id, title, year, journal, publisher, description, citation, url, catagory, index, issn } = PublicationValidator.parse(req.body);
    const params = [staff_id, title, year, journal, publisher, description, citation, url, catagory, index, issn];
    await pool.query("INSERT INTO publications (staff_id, title, year, journal, publisher, description, citation, url, type, index, issn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);", params);
    res.status(200).json({ msg: "got all data", sucess: true });
}
;
//# sourceMappingURL=CreatePublication.js.map