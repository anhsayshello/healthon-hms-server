import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import type { SearchQueryParams } from "../types";
import cashierService from "../services/cashier";
import {
  requireAdminOrCashier,
  requireCashier,
} from "../middlewares/requireRoles";
import type { Payment } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import printReceiptPdf from "../services/cashier/printReceiptPdf.service";
import prisma from "../config/db";

const cashierRouter = Router();

cashierRouter.use(...authMiddlewares);

cashierRouter.get(
  "/billings",
  requireCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await cashierService.getAppointmentsForBilling(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.post(
  "/billings",
  requireCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointment_id } = req.body;
      const uid = req?.uid as string;
      const result = await cashierService.createBilling(uid, appointment_id);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.get(
  "/billings/:id",
  requireCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await cashierService.getBillingById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.patch(
  "/billings/:id/payment",
  requireCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const props: Pick<
        Payment,
        "payment_method" | "amount_paid" | "discount" | "notes"
      > = req.body;
      const uid = req.uid as string;
      const result = await cashierService.processPayment(
        uid,
        Number(id),
        props
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.get(
  "/receipts",
  requireAdminOrCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: SearchQueryParams = req.query;
      const result = await cashierService.getReceipts(params);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.get(
  "/receipts/:id",
  requireAdminOrCashier,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await cashierService.getReceiptById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cashierRouter.get(
  "/receipts/:id/pdf",
  requireAdminOrCashier,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Receipt-${id}.pdf`
      );
      return printReceiptPdf(res, Number(id));
    } catch (error) {
      next(error);
    }
  }
);

export default cashierRouter;
