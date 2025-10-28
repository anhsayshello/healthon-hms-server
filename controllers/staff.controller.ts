import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import staffService from "../services/staff.service";

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

export default staffRouter;
