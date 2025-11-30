import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneIphone from "@mui/icons-material/PhoneIphone";
import Email from "@mui/icons-material/Email";
import { useState } from "react";
import { authApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setError(null);
      if (!username.trim() || !password.trim()) {
        setError("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      const phoneSanitized = phone.trim() || undefined;
      const emailSanitized = email.trim() || undefined;
      const res = await authApi.register({
        username,
        password,
        phone: phoneSanitized,
        email: emailSanitized,
      });
      dispatch(setToken(res.data.token));
      navigate("/");
    } catch (e) {
      setError("Đăng ký thất bại. Username có thể đã tồn tại.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 420, borderRadius: 3 }}>
        <Typography variant="h5" mb={2}>
          Đăng ký
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Số điện thoại (tuỳ chọn)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphone />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email (Gmail, tuỳ chọn)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPw((v) => !v)}>
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Đăng ký
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
