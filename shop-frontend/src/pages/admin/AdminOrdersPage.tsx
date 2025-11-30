import { useEffect, useState, useCallback } from "react";
import http from "../../api/http";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
} from "@mui/material";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"];

const AdminOrdersPage = () => {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"createdAt" | "totalAmount">(
    "createdAt"
  );
  const [sortAsc, setSortAsc] = useState(false);

  const load = useCallback(async () => {
    const res = await http.get("/admin/orders");
    let next = Array.isArray(res.data) ? res.data : [];
    if (statusFilter)
      next = next.filter(
        (o) => String(o.status).toUpperCase() === statusFilter
      );
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      next = next.filter(
        (o) =>
          String(o.id).includes(q) ||
          String(o.user?.username || "")
            .toLowerCase()
            .includes(q)
      );
    }
    next = next.slice().sort((a, b) => {
      const av =
        sortBy === "createdAt"
          ? new Date(a.createdAt || 0).getTime()
          : Number(a.totalAmount || 0);
      const bv =
        sortBy === "createdAt"
          ? new Date(b.createdAt || 0).getTime()
          : Number(b.totalAmount || 0);
      const c = av - bv;
      return sortAsc ? c : -c;
    });
    setList(next);
  }, [search, statusFilter, sortBy, sortAsc]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, s: string) => {
    try {
      await http.put(`/admin/orders/${id}/status`, null, {
        params: { status: s },
      });
      await load();
      setToast({
        open: true,
        msg: "Cập nhật trạng thái thành công",
        type: "success",
      });
    } catch {
      setToast({
        open: true,
        msg: "Cập nhật trạng thái thất bại",
        type: "error",
      });
    }
  };

  const start = (page - 1) * pageSize;
  const pageData = list.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Quản lý đơn hàng
      </Typography>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 220px 220px 160px 160px" },
        }}
      >
        <TextField
          size="small"
          label="Tìm ID/username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => setStatusFilter(String(e.target.value))}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            label="Sắp xếp"
            value={sortBy}
            onChange={(e) => setSortBy(String(e.target.value) as any)}
          >
            <MenuItem value="createdAt">Ngày tạo</MenuItem>
            <MenuItem value="totalAmount">Tổng tiền</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? "↑" : "↓"}
        </Button>
        <FormControl size="small">
          <InputLabel>Trang</InputLabel>
          <Select
            label="Trang"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.user?.username || ""}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={String(o.status || "").toUpperCase()}
                    onChange={(e) => updateStatus(o.id, String(e.target.value))}
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{o.totalAmount}</TableCell>
                <TableCell>
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, p) => setPage(p)}
        />
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrdersPage;
