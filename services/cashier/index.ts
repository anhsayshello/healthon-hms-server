import getAppointmentsForPayment from "./getAppointmentsForPayment.service";
import getPaymentById from "./getPaymentById.service";
import getReceiptById from "./getReceiptById.service";
import getReceipts from "./getReceipts.service";
import initializePayment from "./initializePayment.service";
import processPayment from "./processPayment.service";

const cashierService = {
  getAppointmentsForPayment,
  initializePayment,
  processPayment,
  getPaymentById,
  getReceiptById,
  getReceipts,
};

export default cashierService;
