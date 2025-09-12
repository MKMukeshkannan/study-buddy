import pkg from 'xlsx';
const { readFile } = pkg;
export default async function create_multiple_staffs(req, res) {
    //  const file = req.file?.path;
    //  const IdValidator = z.object({id: z.string().uuid()});
    //  const { id } = IdValidator.parse(req.body.user);
    //
    //  if (!file) return res.status(400).json({msg: "didn't receive the file"});
    //
    //  const workbook = readFile(file);
    //  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //
    //  let all_params = [];
    //  for (let i = 2; i < 5; ++i) {
    //    let param = [];
    //    param.push(worksheet[`A${i}`]?.v);
    //    param.push(worksheet[`B${i}`]?.v);
    //    param.push(worksheet[`C${i}`]?.v);
    //    const hashed_password = await bcrypt.hash(worksheet[`D${i}`]?.v, 10);
    //    param.push(hashed_password);
    //    param.push(worksheet[`E${i}`]?.v);
    //    param.push(worksheet[`F${i}`]?.v);
    //    param.push(id);
    //
    //    all_params.push(param)
    //  }
    //
    //  console.log(all_params);
    //
    //  const client = await pool.connect()
    //  try {
    //    await client.query('BEGIN')
    //
    //    /// for (let x of all_params) {
    //      await client.query("INSERT INTO staffs (name, email, phone_number, hashed_password, department, google_scholer_id, institution) VALUES ( $1 ,$2 ,$3 ,$4 ,$5 ,$6);", all_params);
    //    /// };
    //
    //    await client.query('COMMIT')
    //  } catch (e) {
    //    await client.query('ROLLBACK')
    //    throw e
    //  } finally {
    //    client.release()
    //  }
    //
    //  res.status(200).json({ msg: "multiple staff", sucess: true });
}
//# sourceMappingURL=CreateMultipleStaffs.js.map