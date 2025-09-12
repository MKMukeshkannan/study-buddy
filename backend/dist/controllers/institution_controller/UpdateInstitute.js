import { z } from "zod";
import { pool } from "../../utils/config.js";
export default async function update_institute(req, res) {
    const UpdateValidator = z.object({
        institution_id: z.string().uuid(),
        attribute: z.string().array(),
        value: z.string().array(),
    });
    const { institution_id, attribute, value } = UpdateValidator.parse(req.body);
    const allowedAttributes = [
        "ins_id",
        "name",
        "address",
        "description",
        "logo_url",
        "cover_url",
        "founded_year",
        "phone_number",
        "mail",
        "hashed_password",
        "is_archived",
        "website",
        "linkedin",
        "instagram"
    ];
    for (const attr of attribute) {
        if (!allowedAttributes.includes(attr)) {
            res.status(400).json({ msg: "attribute not found", sucess: false });
            return;
        }
    }
    if (attribute.length !== value.length) {
        res.status(400).json({ msg: "attribute and value length not same", sucess: false });
        return;
    }
    for (let i = 0; i < attribute.length; i++) {
        const params = [value[i], institution_id];
        await pool.query(`UPDATE institutions SET ${attribute[i]} = $1 WHERE ins_id = $2;`, params);
    }
    res.status(200).json({ msg: "update sucessfull", sucess: true });
}
//# sourceMappingURL=UpdateInstitute.js.map