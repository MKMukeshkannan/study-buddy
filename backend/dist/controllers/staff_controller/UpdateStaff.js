import { z } from "zod";
import { pool } from "../../utils/config.js";
export default async function update_staff(req, res) {
    const UpdateValidator = z.object({
        staff_id: z.string().uuid(),
        attributes: z.string().array(),
        value: z.string().array(),
    });
    const { staff_id, attributes, value } = UpdateValidator.parse(req.body);
    const allowedAttributes = [
        'staff_id',
        'name',
        'description',
        'designation',
        'email',
        'phone_number',
        'department',
        'profile_picture_url',
        'hashed_password',
        'total_citation',
        'h_index',
        'i_index',
        'google_scholer_id',
        'research_gate',
        'portfolio',
        'linked_in',
        'layout',
        'institution',
        'tags'
    ];
    for (const attr of attributes) {
        if (!allowedAttributes.includes(attr)) {
            res.status(400).json({ msg: "attribute not found", sucess: false });
            return;
        }
    }
    if (attributes.length !== value.length) {
        res.status(400).json({ msg: "attribute and value length not same", sucess: false });
        return;
    }
    for (let i = 0; i < attributes.length; i++) {
        const params = [value[i], staff_id];
        await pool.query(`UPDATE staffs SET ${attributes[i]} = $1 WHERE staff_id = $2;`, params);
    }
    res.status(200).json({ msg: "update sucessfull", sucess: true });
}
//# sourceMappingURL=UpdateStaff.js.map