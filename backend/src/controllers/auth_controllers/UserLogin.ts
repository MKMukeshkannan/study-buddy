import {Response, Request} from 'express'
import bcrypt from "bcrypt";
import { z } from "zod";
import { generate_access_token, generate_refresh_token, pool } from "../../utils/config.js";

export const userLoginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(["STAFF", "STUDENT"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

export default async function student_login(req: Request, res: Response) {
  const {email, password, role} = userLoginSchema.parse(req.body);
  const result = await pool.query("SELECT * FROM users WHERE email=$1 AND role=$2", [email, role]);

  if (!result.rowCount) return res.status(400).json({ message:"Email do not exist" }); 
  const user_data  = result.rows[0];

  if (await bcrypt.compare(password, user_data.hashed_password)) {
    res.status(200).json({ sucess: true, msg: "sucessfully autheticated", name: user_data.name, email: user_data.mail });
  } else {
    res.status(401).json({sucess: false, msg: "password is wrong"});
  };
};


