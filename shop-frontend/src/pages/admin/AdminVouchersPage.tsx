import { useEffect, useState, useCallback } from "react";
import http from "../../api/http";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";

const AdminVouchersPage = () => {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    code: "",
    percent: "",
    minOrder: "",
    validFrom: "",
    validTo: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [search, setSearch] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({
    code: "",
    percent: "",
    minOrder: "",
    validFrom: "",
    validTo: "",
  });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const load = useCallback(async () => {
    const res = await http.get("/admin/vouchers", {
      params: { q: search || undefined, page: page - 1, size: 10 },
    });
    const content = Array.isArray(res.data?.content) ? res.data.content : [];
    setList(content);
    setTotalPages(
      typeof res.data?.totalPages === "number" ? res.data.totalPages : 1
    );
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: any) => {
    e.preventDefault();
    const exists = list.some(
      (v) => String(v.code).toLowerCase() === String(form.code).toLowerCase()
    );
    const percentNum = Number(form.percent);
    const minOrderNum = form.minOrder ? Number(form.minOrder) : null;
    const err: any = {};
    if (!form.code.trim()) err.code = "Code không được trống";
    if (exists) err.code = "Code đã tồn tại";
    if (!(percentNum >= 0 && percentNum <= 100))
      err.percent = "Percent phải 0-100";
    if (minOrderNum !== null && minOrderNum < 0)
      err.minOrder = "MinOrder phải >= 0";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    await http.post("/admin/vouchers", {
      code: form.code,
      percent: percentNum,
      minOrder: minOrderNum,
      validFrom: form.validFrom || null,
      validTo: form.validTo || null,
    });
    setForm({
      code: "",
      percent: "",
      minOrder: "",
      validFrom: "",
      validTo: "",
    });
    await load();
  };

  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [confirmId, setConfirmId] = useState<number | null>(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Quản lý Voucher
      </Typography>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2 }}>
        <TextField
          size="small"
          label="Tìm theo code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outlined" onClick={load}>
          Tìm
        </Button>
      </Paper>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 1fr 1fr 1fr 160px" },
        }}
      >
        <TextField
          size="small"
          label="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          error={Boolean(errors.code)}
          helperText={errors.code || ""}
        />
        <TextField
          size="small"
          label="Percent"
          type="number"
          value={form.percent}
          onChange={(e) => setForm({ ...form, percent: e.target.value })}
          error={Boolean(errors.percent)}
          helperText={errors.percent || ""}
        />
        <TextField
          size="small"
          label="Min Order"
          type="number"
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
          error={Boolean(errors.minOrder)}
          helperText={errors.minOrder || ""}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            type="datetime-local"
            value={form.validFrom}
            onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
          />
          <TextField
            size="small"
            type="datetime-local"
            value={form.validTo}
            onChange={(e) => setForm({ ...form, validTo: e.target.value })}
          />
        </Box>
        <Button
          variant="contained"
          onClick={submit}
          disabled={
            Boolean(errors.code) ||
            Boolean(errors.percent) ||
            Boolean(errors.minOrder)
          }
        >
          Tạo
        </Button>
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Percent</TableCell>
              <TableCell>MinOrder</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>
                  {editId === v.id ? (
                    <TextField
                      size="small"
                      value={editForm.code}
                      onChange={(e) =>
                        setEditForm({ ...editForm, code: e.target.value })
                      }
                    />
                  ) : (
                    v.code
                  )}
                </TableCell>
                <TableCell>
                  {editId === v.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editForm.percent}
                      onChange={(e) =>
                        setEditForm({ ...editForm, percent: e.target.value })
                      }
                    />
                  ) : (
                    v.percent
                  )}
                </TableCell>
                <TableCell>
                  {editId === v.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editForm.minOrder}
                      onChange={(e) =>
                        setEditForm({ ...editForm, minOrder: e.target.value })
                      }
                    />
                  ) : (
                    v.minOrder
                  )}
                </TableCell>
                <TableCell>
                  {editId === v.id ? (
                    <TextField
                      size="small"
                      type="datetime-local"
                      value={editForm.validFrom}
                      onChange={(e) =>
                        setEditForm({ ...editForm, validFrom: e.target.value })
                      }
                    />
                  ) : (
                    v.validFrom
                  )}
                </TableCell>
                <TableCell>
                  {editId === v.id ? (
                    <TextField
                      size="small"
                      type="datetime-local"
                      value={editForm.validTo}
                      onChange={(e) =>
                        setEditForm({ ...editForm, validTo: e.target.value })
                      }
                    />
                  ) : (
                    v.validTo
                  )}
                </TableCell>
                <TableCell align="right">
                  {editId === v.id ? (
                    <>
                      <Button
                        onClick={async () => {
                          try {
                            await http.put(`/admin/vouchers/${v.id}`, {
                              code: editForm.code,
                              percent: Number(editForm.percent),
                              minOrder: editForm.minOrder
                                ? Number(editForm.minOrder)
                                : null,
                              validFrom: editForm.validFrom || null,
                              validTo: editForm.validTo || null,
                            });
                            setEditId(null);
                            await load();
                            setToast({
                              open: true,
                              msg: "Cập nhật thành công",
                              type: "success",
                            });
                          } catch (err: any) {
                            setToast({
                              open: true,
                              msg:
                                err?.response?.status === 409
                                  ? "Code đã tồn tại"
                                  : "Cập nhật thất bại",
                              type: "error",
                            });
                          }
                        }}
                      >
                        Lưu
                      </Button>
                      <Button onClick={() => setEditId(null)} sx={{ ml: 1 }}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setEditId(v.id);
                          setEditForm({
                            code: v.code,
                            percent: v.percent,
                            minOrder: v.minOrder,
                            validFrom: v.validFrom,
                            validTo: v.validTo,
                          });
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() => setConfirmId(v.id)}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
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

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Xóa voucher?</DialogTitle>
        <DialogContent>Hành động này không thể hoàn tác.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Hủy</Button>
          <Button
            color="error"
            onClick={async () => {
              if (confirmId !== null) {
                await http.delete(`/admin/vouchers/${confirmId}`);
                await load();
                setConfirmId(null);
                setToast({
                  open: true,
                  msg: "Xóa thành công",
                  type: "success",
                });
              }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminVouchersPage;
