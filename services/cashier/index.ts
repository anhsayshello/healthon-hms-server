import getReceiptById from "./getReceiptById.service";
import getReceipts from "./getReceipts.service";
import processPayment from "./processPayment.service";
import getAppointmentsForBilling from "./getAppointmentsForBilling.service";
import getBillingById from "./getBillingById.service";
import createBilling from "./createBilling.service";
import printReceiptPdf from "./printReceiptPdf.service";

const cashierService = {
  getAppointmentsForBilling,
  getBillingById,
  createBilling,
  processPayment,
  getReceiptById,
  getReceipts,
  printReceiptPdf,
};

export default cashierService;
