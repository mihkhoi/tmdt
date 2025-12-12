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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import http from "../api/http";
<<<<<<< HEAD
=======
import FacebookIcon from "@mui/icons-material/Facebook";
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [fpOpen, setFpOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  useEffect(() => {
<<<<<<< HEAD
    const tk =
      sp.get("token") ||
      sp.get("jwt") ||
      sp.get("access_token") ||
      sp.get("id_token");
    const errParam = sp.get("error");
    if (errParam) setError(errParam);
=======
    const tk = sp.get("token");
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
    if (tk) {
      dispatch(setToken(tk));
      const redirect = (location.state as any)?.redirect || "/";
      navigate(redirect, { replace: true });
    }
  }, [sp, dispatch, navigate, location.state]);

<<<<<<< HEAD
  const baseUrl = http.defaults.baseURL || "";
  let apiOrigin = baseUrl;
  try {
    const u = new URL(baseUrl);
    apiOrigin = u.origin;
  } catch {
    apiOrigin = baseUrl.replace(/\/api$/, "");
  }
  const startGoogleOAuth = () => {
    const redirect = `${window.location.origin}/login`;
    const url = `${apiOrigin}/api/auth/oauth/google?redirect=${encodeURIComponent(
      redirect
    )}`;
=======
  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const startOAuth = (provider: "google" | "facebook") => {
    const redirect = `${window.location.origin}/login`;
    const url = `${apiOrigin}/auth/oauth/${provider}?redirect=${encodeURIComponent(redirect)}`;
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
    window.location.href = url;
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const res = await authApi.login({ username, password });
      dispatch(setToken(res.data.token));
      const redirect = (location.state as any)?.redirect || "/";
      navigate(redirect, { replace: true });
    } catch (e) {
      setError("Đăng nhập thất bại. Kiểm tra lại tài khoản/mật khẩu.");
    }
  };

  const requestOtp = async () => {
    try {
      setError(null);
      await authApi.forgotRequestOtp({ identifier });
      setOtpSent(true);
    } catch (e) {
      setError("Không gửi được mã. Kiểm tra email/số điện thoại.");
    }
  };

  const verifyOtp = async () => {
    try {
      setError(null);
      await authApi.forgotVerifyOtp({
        identifier,
        code: otpCode,
        newPassword: newPw,
      });
      setFpOpen(false);
    } catch (e) {
      setError("Xác thực mã thất bại hoặc thông tin không hợp lệ.");
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
          Đăng nhập
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
            Đăng nhập
          </Button>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
<<<<<<< HEAD
            <Button fullWidth variant="outlined" onClick={startGoogleOAuth}>
              Đăng nhập với Google
            </Button>
=======
            <Button
              fullWidth
              variant="outlined"
              onClick={() => startOAuth("google")}
            >
              Đăng nhập với Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => startOAuth("facebook")}
            >
              Facebook
            </Button>
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button size="small" onClick={() => setFpOpen(true)}>
              Quên mật khẩu?
            </Button>
            <Button size="small" onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Dialog open={fpOpen} onClose={() => setFpOpen(false)}>
        <DialogTitle>Khôi phục mật khẩu</DialogTitle>
        <DialogContent>
          {!otpSent ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Email hoặc SĐT"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <Button variant="contained" onClick={requestOtp}>
                Gửi mã
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Mã OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <TextField
                label="Mật khẩu mới"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFpOpen(false)}>Đóng</Button>
          {otpSent ? (
            <Button variant="contained" onClick={verifyOtp}>
              Xác nhận
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
