import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChatWidget = () => {
  const tawkUrl = process.env.REACT_APP_TAWK_URL;
  const tawkProp = process.env.REACT_APP_TAWK_PROPERTY_ID;
  const tawkWidget = process.env.REACT_APP_TAWK_WIDGET_ID;
  const chatwootUrl = process.env.REACT_APP_CHATWOOT_URL;
  const chatwootToken = process.env.REACT_APP_CHATWOOT_TOKEN;

  const enableProvider = useMemo(() => {
    return Boolean(tawkUrl || (tawkProp && tawkWidget) || (chatwootUrl && chatwootToken));
  }, [tawkUrl, tawkProp, tawkWidget, chatwootUrl, chatwootToken]);

  useEffect(() => {
    if (!enableProvider) return;
    if (tawkUrl || (tawkProp && tawkWidget)) {
      const s = document.createElement("script");
      s.async = true;
      s.src = tawkUrl || `https://embed.tawk.to/${tawkProp}/${tawkWidget}`;
      document.body.appendChild(s);
      return () => {
        document.body.removeChild(s);
      };
    }
    if (chatwootUrl && chatwootToken) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `${chatwootUrl}/packs/js/sdk.js`;
      s.onload = () => {
        const anyWin: any = window as any;
        if (anyWin && anyWin.chatwootSDK) {
          anyWin.chatwootSDK.run({ websiteToken: chatwootToken, baseUrl: chatwootUrl });
        }
      };
      document.body.appendChild(s);
      return () => {
        document.body.removeChild(s);
      };
    }
  }, [enableProvider, tawkUrl, tawkProp, tawkWidget, chatwootUrl, chatwootToken]);

  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: number; from: "user" | "bot"; text: string }[]>([
    { id: 1, from: "bot", text: "Xin chào! Mình có thể giúp gì cho bạn?" },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const nextId = (messages[messages.length - 1]?.id || 1) + 1;
    const lower = text.toLowerCase();
    let reply = "Cảm ơn bạn! Nhân viên sẽ phản hồi sớm.";
    if (lower.includes("giúp") || lower.includes("help")) reply = "Mình luôn sẵn sàng. Bạn cần hỗ trợ gì?";
    else if (lower.includes("vận chuyển") || lower.includes("ship") || lower.includes("giao hàng")) reply = "Phí vận chuyển từ 18.5k–25k, miễn phí khi đơn ≥ 100k.";
    else if (lower.includes("khuyến mãi") || lower.includes("voucher") || lower.includes("mã")) reply = "Bạn có thể nhập mã ở trang Thanh toán. Hiện có SAVE30 và FREESHIP.";
    else if (lower.includes("thanh toán") || lower.includes("payment") || lower.includes("momo") || lower.includes("vnpay") || lower.includes("cod")) reply = "Hỗ trợ COD, VNPAY và MoMo.";
    else if (lower.includes("đơn hàng") || lower.includes("order")) reply = "Bạn xem đơn tại mục Đơn Mua trong tài khoản.";
    setMessages((prev) => [...prev, { id: nextId, from: "user", text }, { id: nextId + 1, from: "bot", text: reply }]);
    setInput("");
  };

  if (enableProvider) return null;

  return (
    <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}>
      {open ? (
        <Paper sx={{ width: 320, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2">Hỗ trợ</Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "inherit" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ maxHeight: 280, overflow: "auto", p: 1 }}>
            {messages.map((m) => (
              <Box key={m.id} sx={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: m.from === "user" ? "grey.200" : "grey.100" }}>
                  <Typography variant="body2">{m.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "1fr auto", gap: 1 }}>
            <TextField size="small" placeholder="Nhập tin nhắn..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
            <Button variant="contained" onClick={send}>Gửi</Button>
          </Box>
        </Paper>
      ) : (
        <Button variant="contained" onClick={() => setOpen(true)}>Chat</Button>
      )}
    </Box>
  );
};

export default ChatWidget;
