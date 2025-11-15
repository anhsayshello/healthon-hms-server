import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import type { SearchQueryParams } from "../types";
import labService from "../services/lab";
import type { Request, Response, NextFunction } from "express";

const labRouter = Router();

labRouter.use(...authMiddlewares);

labRouter.get(
  "/services",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await labService.getLabServices(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.get(
  "/tests",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await labService.getLabTests(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.get(
  "/tests/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await labService.getLabTestById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.post(
  "/services",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { service_name, description, price } = req.body;
      const result = await labService.createLabService(
        service_name,
        description,
        price
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.post(
  "/requests",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { service_id, medical_record_id } = req.body;
      const result = await labService.createLabRequest(
        service_id,
        medical_record_id
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.get(
  "/requests",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await labService.getLabTestRequests(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.patch(
  "/requests/:id/cancel",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const result = await labService.cancelLabRequest(Number(id), notes);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.patch(
  "/tests/:id/start",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const uid = req?.uid as string;
      const result = await labService.startLabTest(Number(id), uid);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

labRouter.patch(
  "/tests/:id/finish",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { result: labResult } = req.body;
      const uid = req?.uid as string;
      const result = await labService.finishLabTest(Number(id), uid, labResult);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default labRouter;
