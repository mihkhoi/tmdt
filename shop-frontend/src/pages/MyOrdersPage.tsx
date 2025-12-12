import { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  Box,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
/* removed unused auth selector */

type OrderItem = {
  product: { id: number; name: string };
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  status: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

const TABS = [
  { key: "", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "PROCESSING", label: "Chờ giao hàng" },
  { key: "SHIPPED", label: "Vận chuyển" },
  { key: "DELIVERED", label: "Hoàn thành" },
  { key: "CANCELED", label: "Đã hủy" },
];

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  /* removed loading and error states */
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  /* removed unused auth */

  const fetchOrders = useCallback(async () => {
    try {
      const df = dateFrom ? `${dateFrom}T00:00:00` : undefined;
      const dt = dateTo ? `${dateTo}T23:59:59` : undefined;
      const res = await http.get("/orders/my", {
        params: {
          status: statusFilter || undefined,
          keyword: keyword || undefined,
          dateFrom: df,
          dateTo: dt,
          page: page - 1,
          size: 10,
        },
      });
      const content = Array.isArray(res.data?.content) ? res.data.content : [];
      setOrders(content);
      setTotalPages(
        typeof res.data?.totalPages === "number" ? res.data.totalPages : 1
      );
    } catch (e) {
      console.error(e);
    }
  }, [statusFilter, page, dateFrom, dateTo, keyword]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await http.put(`/orders/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchOrders();
    } catch (e) {
      console.error(e);
      alert("Không thể hủy đơn. Chỉ hủy khi trạng thái PENDING.");
    }
  };

  const statusColor = (s: string) => {
    const v = (s || "").toUpperCase();
    if (v === "PENDING") return "warning";
    if (v === "PAID" || v === "CONFIRMED") return "info";
    if (v === "SHIPPED") return "primary";
    if (v === "DELIVERED") return "success";
    if (v === "CANCELED" || v === "CANCEL") return "error";
    return "default" as any;
  };

  const cannotCancel = (o: Order) => {
    const st = String(o.status).toUpperCase();
    const pm = String(o.paymentMethod || "").toUpperCase();
    if (pm === "MOMO") return true;
    return st !== "PENDING";
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={TABS.findIndex((t) => t.key === statusFilter)}
            onChange={(_, i) => {
              setStatusFilter(TABS[i].key);
              setPage(1);
            }}
            variant="scrollable"
          >
            {TABS.map((t) => (
              <Tab key={t.key} label={t.label} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, p: 2, flexWrap: "wrap" }}>
          <FormControl size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {[
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELED",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Mã đơn"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <TextField
            size="small"
            type="date"
            label="Từ ngày"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label="Đến ngày"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="Từ khóa sản phẩm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
          >
            Lọc
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              const fmt = (d: Date) => d.toISOString().slice(0, 10);
              const d = new Date();
              const today = fmt(d);
              setDateFrom(today);
              setDateTo(today);
              setPage(1);
              fetchOrders();
            }}
          >
            Hôm nay
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              const fmt = (d: Date) => d.toISOString().slice(0, 10);
              const d = new Date();
              const last7 = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
              setDateFrom(fmt(last7));
              setDateTo(fmt(d));
              setPage(1);
              fetchOrders();
            }}
          >
            7 ngày qua
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              const fmt = (d: Date) => d.toISOString().slice(0, 10);
              const d = new Date();
              const last30 = new Date(d.getTime() - 30 * 24 * 60 * 60 * 1000);
              setDateFrom(fmt(last30));
              setDateTo(fmt(d));
              setPage(1);
              fetchOrders();
            }}
          >
            30 ngày qua
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => {
              setStatusFilter("");
              setSearchId("");
              setDateFrom("");
              setDateTo("");
              setKeyword("");
              setPage(1);
              fetchOrders();
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Tổng</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .filter(
                (o) =>
                  !statusFilter ||
                  String(o.status).toUpperCase() === statusFilter.toUpperCase()
              )
              .filter((o) => !searchId || String(o.id) === searchId.trim())
              .map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>#{o.id}</TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={o.status}
                      color={statusColor(o.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const pm = String(o.paymentMethod || "").toUpperCase();
                      if (pm === "COD") return <Chip label="COD" size="small" color="default" />;
                      if (pm === "VNPAY") return <Chip icon={<QrCodeIcon />} label="VNPAY" size="small" color="primary" />;
                      if (pm === "MOMO") return <Chip icon={<AccountBalanceWalletIcon />} label="MoMo" size="small" color="secondary" />;
                      return <Chip label={pm || "-"} size="small" variant="outlined" />;
                    })()}
                  </TableCell>
                  <TableCell>{o.totalAmount} ₫</TableCell>
                  <TableCell>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {o.items?.map((it, idx) => (
                        <li key={idx}>
                          {it.product?.name} x {it.quantity}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/orders/${o.id}`}
                      sx={{ mr: 1 }}
                    >
                      Xem chi tiết
                    </Button>
                    <Tooltip
                      title={(() => {
                        const pm = String(o.paymentMethod || "").toUpperCase();
                        const st = String(o.status).toUpperCase();
                        if (pm === "MOMO") return "Không thể hủy với MoMo";
                        if (st !== "PENDING") return "Chỉ hủy khi trạng thái PENDING";
                        return "";
                      })()}
                    >
                      <span>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          disabled={cannotCancel(o)}
                          onClick={() => cancelOrder(o.id)}
                        >
                          Hủy đơn
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default MyOrdersPage;
