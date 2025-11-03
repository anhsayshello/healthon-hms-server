import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import staffService from "../services/staff/index";

const staffRouter = Router();

staffRouter.use(...authMiddlewares);

staffRouter.get("/", async (req, res, next) => {
  try {
    const { query, page, limit } = req.query;
    const result = await staffService.getStaffs(
      query as string,
      Number(page),
      Number(limit)
    );
    return res.status(201).json(result);
  } catch (error) {}
});

staffRouter.get("/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await staffService.getStaffById(uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default staffRouter;
