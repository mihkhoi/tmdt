import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import http from "../api/http";
import { Chip, Button } from "@mui/material";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [timeline, setTimeline] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchTimeline = useCallback(async () => {
    if (!id) return;
    const res = await http.get(`/orders/${id}/timeline`);
    setTimeline(Array.isArray(res.data) ? res.data : []);
  }, [id]);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    const res = await http.get(`/orders/${id}`);
    setStatus(String(res.data?.status || ""));
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
        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={String(status).toUpperCase() !== "PENDING"}
          sx={{ ml: 1 }}
          onClick={async () => {
            const token = localStorage.getItem("token");
            await http.put(`/orders/${id}/cancel`, null, { headers: { Authorization: `Bearer ${token}` } });
            await fetchTimeline();
            await fetchOrder();
          }}
        >
          Hủy đơn
        </Button>
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