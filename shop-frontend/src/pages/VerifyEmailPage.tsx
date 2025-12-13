import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import http from "../api/http";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const VerifyEmailPage = () => {
  const [sp] = useSearchParams();
  const code = sp.get("code") || "";
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!code) {
        setStatus("fail");
        setMsg("Thiếu mã xác minh");
        return;
      }
      try {
        let res;
        try {
          res = await http.get("/auth/verify-email", { params: { code } });
        } catch {
          res = await http.post("/auth/verify-email", { code });
        }
        const ok = Boolean(res?.data?.success ?? true);
        setStatus(ok ? "ok" : "fail");
        setMsg(ok ? "Xác minh email thành công" : "Xác minh thất bại");
      } catch (e) {
        setStatus("fail");
        setMsg("Có lỗi khi xác minh email");
      }
    };
    run();
  }, [code]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: "auto" }}>
      <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <CheckCircleOutlineIcon color={status === "ok" ? "success" : "error"} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Xác minh email</Typography>
          <Typography variant="body2">{msg || "Đang xử lý..."}</Typography>
        </Box>
        <Button component={Link} to="/login" variant="contained">Đăng nhập</Button>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
