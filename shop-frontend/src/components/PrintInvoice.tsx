import React, { useRef } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useI18n } from "../i18n";

interface PrintInvoiceProps {
  orderId: number | string;
  orderData?: any;
  variant?: "button" | "icon";
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({
  orderId,
  orderData,
  variant = "icon",
}) => {
  const { t, lang } = useI18n();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = printRef.current.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${orderId}</title>
          <style>
            ${styles}
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const InvoiceContent = () => (
    <div ref={printRef} style={{ display: "none" }}>
      {orderData && (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "#1A94FF" }}>
              {lang === "en" ? "INVOICE" : "HÓA ĐƠN"}
            </h1>
            <p style={{ margin: "5px 0", color: "#666" }}>
              {lang === "en" ? "Order" : "Đơn hàng"} #{orderId}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>
              {lang === "en" ? "Order Information" : "Thông tin đơn hàng"}
            </h3>
            <p>
              <strong>{lang === "en" ? "Date" : "Ngày"}:</strong>{" "}
              {orderData.createdAt
                ? new Date(orderData.createdAt).toLocaleString(
                    lang === "en" ? "en-US" : "vi-VN"
                  )
                : "-"}
            </p>
            <p>
              <strong>{lang === "en" ? "Status" : "Trạng thái"}:</strong>{" "}
              {orderData.status || "-"}
            </p>
          </div>

          {orderData.items && orderData.items.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ marginBottom: "10px" }}>
                {lang === "en" ? "Items" : "Sản phẩm"}
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        border: "1px solid #ddd",
                      }}
                    >
                      {lang === "en" ? "Product" : "Sản phẩm"}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {lang === "en" ? "Quantity" : "Số lượng"}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        border: "1px solid #ddd",
                      }}
                    >
                      {lang === "en" ? "Price" : "Giá"}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        border: "1px solid #ddd",
                      }}
                    >
                      {lang === "en" ? "Total" : "Tổng"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {item.product?.name || "-"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                        }}
                      >
                        {item.quantity || 0}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          border: "1px solid #ddd",
                        }}
                      >
                        {item.price?.toLocaleString("vi-VN")} ₫
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          border: "1px solid #ddd",
                        }}
                      >
                        {item.subtotal?.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <p>
              <strong>
                {lang === "en" ? "Subtotal" : "Tạm tính"}:{" "}
                {orderData.subtotal?.toLocaleString("vi-VN")} ₫
              </strong>
            </p>
            {orderData.shippingFee && (
              <p>
                {lang === "en" ? "Shipping" : "Phí vận chuyển"}:{" "}
                {orderData.shippingFee.toLocaleString("vi-VN")} ₫
              </p>
            )}
            {orderData.discount && orderData.discount > 0 && (
              <p style={{ color: "#FF424E" }}>
                {lang === "en" ? "Discount" : "Giảm giá"}: -{" "}
                {orderData.discount.toLocaleString("vi-VN")} ₫
              </p>
            )}
            <h2 style={{ marginTop: "10px", color: "#FF424E" }}>
              {lang === "en" ? "Total" : "Tổng cộng"}:{" "}
              {orderData.total?.toLocaleString("vi-VN")} ₫
            </h2>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "button") {
    return (
      <>
        <InvoiceContent />
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ borderRadius: 2 }}
        >
          {lang === "en" ? "Print Invoice" : "In hóa đơn"}
        </Button>
      </>
    );
  }

  return (
    <>
      <InvoiceContent />
      <Tooltip title={lang === "en" ? "Print Invoice" : "In hóa đơn"}>
        <IconButton onClick={handlePrint} color="inherit">
          <PrintIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default PrintInvoice;
