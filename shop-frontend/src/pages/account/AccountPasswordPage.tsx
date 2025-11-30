import { useState } from "react";
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import http from "../../api/http";

export default function AccountPasswordPage() {
  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [old1, setOld1] = useState("");
  const [old2, setOld2] = useState("");
  const [new1, setNew1] = useState("");
  const [new2, setNew2] = useState("");

  const [otpChannel, setOtpChannel] = useState<"PHONE" | "EMAIL">("PHONE");
  const [otpCode, setOtpCode] = useState("");
  const [otpNew1, setOtpNew1] = useState("");
  const [otpNew2, setOtpNew2] = useState("");

  const submitOld = async () => {
    setErr(null);
    setMsg(null);
    if (old1 !== old2) {
      setErr("Mật khẩu cũ không khớp");
      return;
    }
    if (new1 !== new2) {
      setErr("Mật khẩu mới không khớp");
      return;
    }
    try {
      await http.post("/me/password/change-old", {
        oldPassword: old1,
        newPassword: new1,
      });
      setMsg("Đổi mật khẩu thành công");
      setOld1("");
      setOld2("");
      setNew1("");
      setNew2("");
    } catch (e) {
      setErr("Mật khẩu cũ không đúng hoặc yêu cầu không hợp lệ");
    }
  };

  const requestOtp = async (channel: "PHONE" | "EMAIL") => {
    setErr(null);
    setMsg(null);
    try {
      await http.post("/me/password/request-otp", { channel });
      setOtpChannel(channel);
      setMsg(`Đã gửi mã tới ${channel === "PHONE" ? "SĐT" : "Email"}`);
    } catch (e) {
      setErr("Không thể gửi mã. Kiểm tra đã cập nhật SĐT/Email");
    }
  };

  const verifyOtp = async () => {
    setErr(null);
    setMsg(null);
    if (otpNew1 !== otpNew2) {
      setErr("Mật khẩu mới không khớp");
      return;
    }
    try {
      await http.post("/me/password/verify-otp", {
        channel: otpChannel,
        code: otpCode,
        newPassword: otpNew1,
      });
      setMsg("Đổi mật khẩu thành công");
      setOtpCode("");
      setOtpNew1("");
      setOtpNew2("");
    } catch (e) {
      setErr("Mã OTP không hợp lệ hoặc đã hết hạn");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Đổi Mật Khẩu
      </Typography>
      <Tabs value={tab} onChange={(_, i) => setTab(i)} sx={{ mb: 2 }}>
        <Tab label="Xác thực bằng mật khẩu cũ" />
        <Tab label="Gửi mã qua SĐT" />
        <Tab label="Gửi mã qua Email" />
      </Tabs>

      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {tab === 0 && (
        <Stack spacing={2} maxWidth={420}>
          <TextField
            label="Mật khẩu cũ"
            type="password"
            value={old1}
            onChange={(e) => setOld1(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu cũ"
            type="password"
            value={old2}
            onChange={(e) => setOld2(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={new1}
            onChange={(e) => setNew1(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            value={new2}
            onChange={(e) => setNew2(e.target.value)}
          />
          <Button variant="contained" onClick={submitOld}>
            Đổi mật khẩu
          </Button>
        </Stack>
      )}

      {tab === 1 && (
        <Stack spacing={2} maxWidth={420}>
          <Button variant="outlined" onClick={() => requestOtp("PHONE")}>
            Gửi mã tới SĐT
          </Button>
          <TextField
            label="Mã OTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={otpNew1}
            onChange={(e) => setOtpNew1(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            value={otpNew2}
            onChange={(e) => setOtpNew2(e.target.value)}
          />
          <Button variant="contained" onClick={verifyOtp}>
            Xác nhận
          </Button>
        </Stack>
      )}

      {tab === 2 && (
        <Stack spacing={2} maxWidth={420}>
          <Button variant="outlined" onClick={() => requestOtp("EMAIL")}>
            Gửi mã tới Email
          </Button>
          <TextField
            label="Mã OTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={otpNew1}
            onChange={(e) => setOtpNew1(e.target.value)}
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            value={otpNew2}
            onChange={(e) => setOtpNew2(e.target.value)}
          />
          <Button variant="contained" onClick={verifyOtp}>
            Xác nhận
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
