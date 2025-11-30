import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import http from "../api/http";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const auth = useSelector((s: RootState) => s.auth);
  const [form, setForm] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await http.get("/me");
        const u = res.data || {};
        setForm({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
          gender: u.gender || "",
          birthDate: u.birthDate || "",
          avatarUrl: u.avatarUrl || "",
        });
      } catch (e) {
        setError("Không tải được hồ sơ");
      }
    };
    load();
  }, []);

  const maskEmail = (v: string) => {
    if (!v) return "";
    const [name, domain] = v.split("@");
    if (!domain) return v;
    const prefix = name.slice(0, 2);
    return `${prefix}${"*".repeat(Math.max(6, name.length - 2))}@${domain}`;
  };
  const maskPhone = (v: string) => {
    if (!v) return "";
    const end = v.slice(-2);
    return `${"*".repeat(Math.max(6, v.length - 2))}${end}`;
  };

  const onFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Ảnh tối đa 1MB");
      return;
    }
    const ok = ["image/jpeg", "image/png"].includes(file.type);
    if (!ok) {
      setError("Chỉ nhận JPEG/PNG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f: any) => ({ ...f, avatarUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    try {
      setLoading(true);
      setError(null);
      const body = { ...form };
      await http.put("/me", body);
    } catch (e: any) {
      setError("Cập nhật thất bại. Email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Hồ Sơ Của Tôi
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 320px" },
            gap: 3,
          }}
        >
          <Box>
            <Stack spacing={2} maxWidth={520}>
              <TextField
                label="Tên đăng nhập"
                value={auth.username || ""}
                disabled
              />
              <TextField
                label="Tên"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              {editingEmail ? (
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              ) : (
                <TextField
                  label="Email"
                  value={maskEmail(form.email)}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setEditingEmail(true)}
                        >
                          Thay Đổi
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              {editingPhone ? (
                <TextField
                  label="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              ) : (
                <TextField
                  label="Số điện thoại"
                  value={maskPhone(form.phone)}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setEditingPhone(true)}
                        >
                          Thay Đổi
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <RadioGroup
                row
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <FormControlLabel
                  value="MALE"
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="OTHER"
                  control={<Radio />}
                  label="Khác"
                />
              </RadioGroup>
              <TextField
                label="Ngày sinh"
                type="date"
                value={form.birthDate || ""}
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button variant="contained" onClick={save} disabled={loading}>
                Lưu
              </Button>
            </Stack>
          </Box>
          <Box>
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={form.avatarUrl || undefined}
              >
                {String(auth.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>
              <Button variant="outlined" component="label">
                Chọn Ảnh
                <input type="file" hidden accept="image/*" onChange={onFile} />
              </Button>
              <Typography variant="body2" color="text.secondary">
                Dung lượng tối đa 1 MB • Định dạng: JPEG, PNG
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
