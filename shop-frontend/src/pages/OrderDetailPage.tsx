import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import http from "../api/http";
import { Chip, Button, Tooltip } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [timeline, setTimeline] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const fetchTimeline = useCallback(async () => {
    if (!id) return;
    const res = await http.get(`/orders/${id}/timeline`);
    setTimeline(Array.isArray(res.data) ? res.data : []);
  }, [id]);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    const res = await http.get(`/orders/${id}`);
    setStatus(String(res.data?.status || ""));
    setPaymentMethod(String(res.data?.paymentMethod || ""));
  }, [id]);

  useEffect(() => {
    fetchTimeline();
    fetchOrder();
  }, [fetchTimeline, fetchOrder]);

  return (
    <div style={{ padding: 30 }}>
      <h2>Chi tiết đơn #{id}</h2>
      <div style={{ marginBottom: 12 }}>
        <Chip label={status} color={String(status).toUpperCase()==="PENDING"?"warning":"default" as any} size="small" />
        {(() => {
          const pm = String(paymentMethod).toUpperCase();
          if (pm === "VNPAY") return <Chip icon={<QrCodeIcon />} label="VNPAY" size="small" color="primary" style={{ marginLeft: 8 }} />;
          if (pm === "MOMO") return <Chip icon={<AccountBalanceWalletIcon />} label="MoMo" size="small" color="secondary" style={{ marginLeft: 8 }} />;
          if (pm === "COD") return <Chip label="COD" size="small" color="default" style={{ marginLeft: 8 }} />;
          return null;
        })()}
        <Tooltip
          title={(() => {
            const pm = String(paymentMethod).toUpperCase();
            const st = String(status).toUpperCase();
            if (pm === "MOMO") return "Không thể hủy với MoMo";
            if (st !== "PENDING") return "Chỉ hủy khi trạng thái PENDING";
            return "";
          })()}
        >
          <span>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={String(status).toUpperCase() !== "PENDING" || String(paymentMethod).toUpperCase() === "MOMO"}
              style={{ marginLeft: 8 }}
              onClick={async () => {
                const token = localStorage.getItem("token");
                await http.put(`/orders/${id}/cancel`, null, { headers: { Authorization: `Bearer ${token}` } });
                await fetchTimeline();
                await fetchOrder();
              }}
            >
              Hủy đơn
            </Button>
          </span>
        </Tooltip>
      </div>
      <ul>
        {timeline.map((it) => (
          <li key={it.id}>{new Date(it.createdAt).toLocaleString()} — {it.status} — {it.note}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailPage;
