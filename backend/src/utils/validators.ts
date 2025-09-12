import { z } from "zod";

const InstitutionSchema = z.object({
  ins_id: z.string(),
  name: z
    .string({ required_error: "Name is required", invalid_type_error: "Name must be a string", })
    .min(6)
    .max(50),
  address: z
    .string({ required_error: "Address is required" })
    .min(10)
    .max(100)
    .optional(),
  logo_url: z.string({ required_error: "logo is required" }).url().optional(),
  founded_year: z
    .number({ required_error: "founded year is required" })
    .positive()
    .gt(1500)
    .lt(2025)
    .optional(),
  phone_number: z
    .string({ required_error: "phone number is required" })
    .length(10),
  mail: z.string({ required_error: "mail is required" }).email(),
  website: z.string({ required_error: "website is required" }).url(),
  hashed_password: z.string({ required_error: "password is required" }),

  description: z.string().optional(),
  cover_url: z.string().optional(),
  is_archived: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
});

const StaffSchema = z.object({
    staff_id: z.string({required_error: "staff_id: is required"}),
    name: z.string({required_error: "name: is required"}).min(10).max(30),
    designation: z.string({required_error: "designation: is required"}).min(3).max(30).optional(),
    google_scholar_id: z.string({required_error: "google_scholar_id: is required"}).optional(),
    linked_in: z.string({required_error: "linked_in: is required"}).url().optional(),
    h_index: z.number({required_error: "h_index: is required"}).positive().optional(),
    email: z.string({required_error: "email: is required"}).email(),
    phone_number: z.string({required_error: "phone_number: is required"}).length(10),
    department: z.string({required_error: "department: is required"}).min(3).max(30).optional(),
    profile_picture: z.string({required_error: "profile_picture: is required"}).url().optional(),
    institution: z.string({required_error: "institution: is required"}).optional(),
    hashed_password: z.string({required_error: "password: is required"}),
    total_citation: z.string().optional(),
    linkedin: z.string().optional(),
    layout: z.string().optional(),
    description: z.string().optional(),
    profile_picture_url: z.string().optional(),
    i_index: z.string().optional(),
    research_gate: z.string().optional(),
    portfolio: z.string().optional(),
});


export { InstitutionSchema, StaffSchema };
