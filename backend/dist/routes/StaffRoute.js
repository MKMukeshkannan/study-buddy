import express from "express";
import { create_publication, get_staff_id, update_staff, populate_staff_citation } from "../controllers/staff_controller/index.js";
import async_middleware from "../middlewares/AsyncMiddleware.js";
const route = express.Router();
route.get("/get-staff-id/:staff_id", async_middleware(get_staff_id));
route.post("/create-publication", async_middleware(create_publication));
route.post("/update-staff", async_middleware(update_staff));
route.post("/populate-staff-citation", async_middleware(populate_staff_citation));
export default route;
//# sourceMappingURL=StaffRoute.js.map