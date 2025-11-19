import PDFDocument from "pdfkit";
import type { Response } from "express";
import prisma from "../../config/db";
import { format } from "date-fns";
import getReceiptById from "./getReceiptById.service";
import { formatNumber } from "../../utils/utils";

export default async function printReceiptPdf(res: Response, id: number) {
  const receipt = await getReceiptById(id);

  const doc = new PDFDocument({
    margins: { top: 32, bottom: 32, left: 30, right: 30 },
  });

  doc.pipe(res);

  doc.fontSize(18).font("Helvetica-Bold").text("Receipt").moveDown(0.7);

  // Logo placeholder
  const pageWidth = doc.page.width;
  const margins = { top: 32, right: 30 };
  const logoSize = { width: 66, height: 66 };
  doc.image(
    "./public/logo.png",
    pageWidth - logoSize.width - margins.right,
    margins.top, // Y position
    {
      fit: [logoSize.width, logoSize.height],
      align: "center",
      valign: "center",
    }
  );
  // Invoice info
  const paymentDate = format(
    new Date(receipt?.payment_date as Date),
    "MMMM d, yyyy"
  );
  let invoiceStartY = doc.y;
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("Invoice number", 30, invoiceStartY);
  doc
    .font("Helvetica")
    .text(String(receipt?.receipt_number.toUpperCase()), 102, invoiceStartY);

  invoiceStartY += 15;
  doc.font("Helvetica-Bold").text("Date paid", 30, invoiceStartY);
  doc.font("Helvetica").text(`${paymentDate}`, 102, invoiceStartY);

  doc.moveDown(2);

  // Company info section
  const companyStartY = doc.y;
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("Healthon Corporation", 30, companyStartY);
  doc
    .fontSize(9)
    .font("Helvetica")
    .text("548 Market St", 30, doc.y + 3)
    .text("PMB 68956", 30, doc.y + 3)
    .text("San Francisco, California 94104", 30, doc.y + 3)
    .text("United States", 30, doc.y + 3)
    .text("billing@healthon.com", 30, doc.y + 3);

  // Cột phải - Bill to
  doc.fontSize(9).font("Helvetica-Bold").text("Bill to", 250, companyStartY);
  doc
    .fontSize(9)
    .font("Helvetica")
    .text(
      `${receipt?.patient.first_name} ${receipt?.patient.last_name}`,
      250,
      doc.y + 3
    )
    .text(receipt?.patient.email as string, 250, doc.y + 3);

  doc.moveDown(2);

  // Payment amount
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`${receipt?.total_amount} paid on ${paymentDate}`, 30, doc.y + 40);
  doc.moveDown(1.5);
  // Table header

  doc.fontSize(9).font("Helvetica");
  const tableData = [
    ["Description", "Qty", "Unit price", "Amount"], // Header
  ];

  // Thêm lab bills
  receipt.lab_bills.forEach((lab) => {
    tableData.push([
      lab.service.service_name,
      "1", // Lab thường là 1 lần
      lab.unit_cost.toLocaleString(),
      lab.total_cost.toLocaleString(),
    ]);
  });

  // Thêm prescription bills
  receipt.prescription_bills.forEach((prescription) => {
    tableData.push([
      prescription.prescription.medication.medication_name,
      prescription.quantity.toString(),
      prescription.unit_cost.toLocaleString(),
      prescription.total_cost.toLocaleString(),
    ]);
  });

  // Tạo bảng
  const tableTop = doc.y;
  doc.table({
    columnStyles: ["*", 60, 70, 70],
    rowStyles: (i) => {
      return i < 1
        ? { border: [0, 0, 1, 0], padding: [0, 0, 4, 0] }
        : { border: false, padding: [8, 0, 0, 0] };
    },
    data: tableData,
  });

  // Totals section
  const totalsTop = doc.y + 30;
  doc.fontSize(9).font("Helvetica");

  doc
    .text("Subtotal", 410, totalsTop)
    .text(String(formatNumber(receipt.subtotal)), 470, totalsTop, {
      width: 90,
      align: "right",
    });
  doc
    .text("Discount", 410, totalsTop + 16)
    .text(String(formatNumber(receipt.discount)), 470, totalsTop + 16, {
      width: 90,
      align: "right",
    });
  doc
    .text("Total", 410, totalsTop + 32)
    .text(String(formatNumber(receipt.total_amount)), 470, totalsTop + 32, {
      width: 90,
      align: "right",
    });

  // Finalize PDF
  doc.end();
}
