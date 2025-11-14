import { Router } from "express";
import { authMiddlewares } from "../middlewares";
import type { SearchQueryParams } from "../types";
import cashierService from "../services/cashier";
import { requireCashier } from "../middlewares/requireRoles";
import type { Payment } from "@prisma/client";

const cashierRouter = Router();

cashierRouter.use(...authMiddlewares, requireCashier);

cashierRouter.get("/payments", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await cashierService.getAppointmentsForPayment(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

cashierRouter.post("/payments", async (req, res, next) => {
  try {
    const { appointment_id } = req.body;
    const uid = req?.uid as string;
    const result = await cashierService.initializePayment(uid, appointment_id);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

cashierRouter.get("/payments/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await cashierService.getPaymentById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

cashierRouter.patch("/payments/:id/process", async (req, res, next) => {
  try {
    const { id } = req.params;
    const props: Pick<
      Payment,
      "payment_method" | "amount_paid" | "discount" | "notes"
    > = req.body;
    const uid = req.uid as string;
    const result = await cashierService.processPayment(uid, Number(id), props);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

cashierRouter.get("/receipts", async (req, res, next) => {
  try {
    const params: SearchQueryParams = req.query;
    const result = await cashierService.getReceipts(params);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

cashierRouter.get("/receipts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await cashierService.getReceiptById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default cashierRouter;
