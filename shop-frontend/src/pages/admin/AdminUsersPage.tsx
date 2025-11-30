import { useEffect, useState, useCallback } from "react";
import http from "../../api/http";
import { authApi } from "../../api/authApi";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  InputLabel,
} from "@mui/material";

const AdminUsersPage = () => {
  const [list, setList] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortAsc, setSortAsc] = useState(true);
  const [pwId, setPwId] = useState<number | null>(null);
  const [pwValue, setPwValue] = useState("");
  const [nameId, setNameId] = useState<number | null>(null);
  const [nameValue, setNameValue] = useState("");

  const load = useCallback(async () => {
    const res = await http.get("/admin/users");
    let arr = Array.isArray(res.data) ? res.data : [];
    arr = arr.slice().sort((a, b) => {
      const c = String(a.username).localeCompare(String(b.username));
      return sortAsc ? c : -c;
    });
    setList(arr);
  }, [sortAsc]);

  useEffect(() => {
    load();
  }, [load]);

  const createUser = async (e: any) => {
    e.preventDefault();
    try {
      await authApi.register({ username, password });
      await load();
      const created = list.find((u) => String(u.username) === String(username));
      if (created && role && role !== created.role) {
        await http.put(`/admin/users/${created.id}/role`, null, {
          params: { role },
        });
        await load();
      }
      setUsername("");
      setPassword("");
      setRole("USER");
      setToast({
        open: true,
        msg: "Tạo người dùng thành công",
        type: "success",
      });
    } catch {
      setToast({ open: true, msg: "Tạo người dùng thất bại", type: "error" });
    }
  };

  const updateRole = async (id: number, newRole: string) => {
    try {
      await http.put(`/admin/users/${id}/role`, null, {
        params: { role: newRole },
      });
      await load();
      setToast({
        open: true,
        msg: "Cập nhật role thành công",
        type: "success",
      });
    } catch {
      setToast({ open: true, msg: "Cập nhật role thất bại", type: "error" });
    }
  };

  const remove = async (id: number) => {
    try {
      await http.delete(`/admin/users/${id}`);
      await load();
      setToast({
        open: true,
        msg: "Xóa người dùng thành công",
        type: "success",
      });
    } catch {
      setToast({
        open: true,
        msg: "Không thể xóa user do ràng buộc dữ liệu",
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
        Quản lý người dùng
      </Typography>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 1fr 200px 160px" },
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
        />
        <FormControl size="small">
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(String(e.target.value))}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={createUser}>
          Tạo user
        </Button>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
        <Button variant="outlined" onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? "Sort tên ↑" : "Sort tên ↓"}
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
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 320,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {u.password || "(ẩn)"}
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    onChange={(e) => updateRole(u.id, String(e.target.value))}
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <Button
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setPwId(u.id);
                      setPwValue("");
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setNameId(u.id);
                      setNameValue(u.username || "");
                    }}
                  >
                    Sửa username
                  </Button>
                  <Button color="error" onClick={() => setConfirmId(u.id)}>
                    Xóa
                  </Button>
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

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Xóa người dùng?</DialogTitle>
        <DialogContent>Hành động này không thể hoàn tác.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Hủy</Button>
          <Button
            color="error"
            onClick={() => {
              if (confirmId !== null) {
                remove(confirmId);
                setConfirmId(null);
              }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pwId !== null} onClose={() => setPwId(null)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            type="password"
            label="Mật khẩu mới"
            value={pwValue}
            onChange={(e) => setPwValue(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwId(null)}>Hủy</Button>
          <Button
            onClick={async () => {
              if (pwId !== null && pwValue.trim()) {
                try {
                  await http.put(`/admin/users/${pwId}/password`, null, {
                    params: { password: pwValue },
                  });
                  await load();
                  setToast({
                    open: true,
                    msg: "Đổi mật khẩu thành công",
                    type: "success",
                  });
                } catch {
                  setToast({
                    open: true,
                    msg: "Đổi mật khẩu thất bại",
                    type: "error",
                  });
                }
                setPwId(null);
              }
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={nameId !== null} onClose={() => setNameId(null)}>
        <DialogTitle>Sửa username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Username mới"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNameId(null)}>Hủy</Button>
          <Button
            onClick={async () => {
              if (nameId !== null && nameValue.trim()) {
                try {
                  await http.put(`/admin/users/${nameId}/username`, null, {
                    params: { username: nameValue },
                  });
                  await load();
                  setToast({
                    open: true,
                    msg: "Cập nhật username thành công",
                    type: "success",
                  });
                } catch (err: any) {
                  const msg =
                    err?.response?.status === 409
                      ? "Username đã tồn tại"
                      : "Cập nhật thất bại";
                  setToast({ open: true, msg, type: "error" });
                }
                setNameId(null);
              }
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
