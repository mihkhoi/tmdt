import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import http from "../../api/http";

type Address = { id: number; line: string; type: string; isDefault: boolean };

export default function AccountAddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [form, setForm] = useState({ line: "", type: "SHIPPING" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await http.get("/addresses");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Không tải được địa chỉ");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!form.line.trim()) return;
    await http.post("/addresses", { line: form.line, type: form.type });
    setForm({ line: "", type: "SHIPPING" });
    await load();
  };
  const setDefault = async (id: number) => {
    await http.put(`/addresses/${id}/default`);
    await load();
  };
  const remove = async (id: number) => {
    await http.delete(`/addresses/${id}`);
    await load();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Địa chỉ của tôi</Typography>
        <Button variant="contained" onClick={add}>
          + Thêm địa chỉ mới
        </Button>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="Địa chỉ"
          fullWidth
          value={form.line}
          onChange={(e) => setForm({ ...form, line: e.target.value })}
        />
        <TextField
          label="Loại"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
      </Stack>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <List>
        {list.map((a) => (
          <ListItem
            key={a.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ListItemText primary={a.line} secondary={`Loại: ${a.type}`} />
            {a.isDefault && (
              <Typography color="primary" sx={{ mr: 1 }}>
                Mặc định
              </Typography>
            )}
            {!a.isDefault && (
              <Button variant="outlined" onClick={() => setDefault(a.id)}>
                Thiết lập mặc định
              </Button>
            )}
            <Button variant="text" color="error" onClick={() => remove(a.id)}>
              Xóa
            </Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
