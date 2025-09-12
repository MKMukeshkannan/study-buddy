import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../utils/config.js";
import { InstitutionSchema } from "../../utils/validators.js";
import { z } from "zod";

const InstitutionCreation = InstitutionSchema.omit({
  ins_id: true,
  hashed_password: true,
}).extend({ password: z.string({ required_error: "Password is required" }) });

export default async function institute_signup(req: Request, res: Response) {
  if (!req.body) return;
  const { password, phone_number, founded_year, address,
    logo_url, mail, name, website, } = InstitutionCreation.parse(req.body);

  const hashed_password = await bcrypt.hash(password, 10);

  const params = [ name, address, logo_url, founded_year,
    phone_number, mail, website, hashed_password, ];

  await pool.query(
    `INSERT INTO institutions ( name, address, logo_url, founded_year, phone_number, mail, website, hashed_password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
    params,
  );

  res.status(200).json({ msg: "created record sucessfully", sucess: true });
}

