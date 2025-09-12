import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../utils/config.js";
import { z } from "zod";

const userSignUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(["STAFF", "STUDENT"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

export default async function institute_signup(req: Request, res: Response) {
  if (!req.body) return;
  const {  name, email, role, password } = userSignUpSchema.parse(req.body);
  const hashed_password = await bcrypt.hash(password, 10);
  const params = [name, email, hashed_password, role];
  await pool.query(
    `INSERT INTO users (name, email, hashed_password, role) VALUES ($1, $2, $3, $4);`,
    params,
  );

  res.status(200).json({ msg: "created record sucessfully", sucess: true });
}

