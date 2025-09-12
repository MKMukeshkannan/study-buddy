import express from "express";
import async_middleware from "../middlewares/AsyncMiddleware.js";
import { get_admin, get_all_staff, get_institution_id, get_all_institution, create_staff, update_institution } from "../controllers/institution_controller/index.js";
import { authrizeToken } from "../middlewares/Authorise.js";
import delete_staff from "../controllers/institution_controller/DeleteStaff.js";
const route = express.Router();
/* REG. INSTITUTION ROUTES */
// route.get("/search-institutions/", async_middleware(search_institution)); 
route.get("/get-institution/:institution_id", async_middleware(get_institution_id));
route.get("/get-all", async_middleware(get_all_institution));
route.get("/get-all-staffs/:institution_id", async_middleware(get_all_staff));
route.get("/admin", [authrizeToken], async_middleware(get_admin));
route.put("/update-institution", [authrizeToken], async_middleware(update_institution));
route.post("/delete-staff-id", [authrizeToken], async_middleware(delete_staff));
route.post("/create-staff", [authrizeToken], async_middleware(create_staff));
// route.post("/create-multiple-staffs", [ upload.single('file'), authrizeToken], async_middleware(create_multiple_staffs));
/* REG. INST CUM STAFF ROUTES */
// route.put("/update-staff/:id", async_middleware(update_staff));
// route.delete("/delete-staff/:id", async_middleware(delete_staff));
export default route;
//# sourceMappingURL=InstitutionRoute.js.map