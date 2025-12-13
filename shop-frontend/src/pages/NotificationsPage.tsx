import { useEffect, useState, useCallback } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, Button, Chip } from "@mui/material";
import { useI18n } from "../i18n";

type Noti = { id: string; title: string; time: string; unread: boolean };

export default function NotificationsPage() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [list, setList] = useState<Noti[]>([]);

  const load = useCallback(() => {
    const storeRaw = localStorage.getItem("noti_read") || "{}";
    const readMap = JSON.parse(storeRaw || "{}");
    const initial: Noti[] = [
      {
        id: "promo-1212",
        title:
          lang === "en"
            ? "12.12 mega sale is coming"
            : "Khuyến mãi 12.12 sắp diễn ra",
        time: lang === "en" ? "Today" : "Hôm nay",
        unread: !readMap["promo-1212"],
      },
      {
        id: "order-1234-delivered",
        title:
          lang === "en"
            ? "Order #1234 delivered successfully"
            : "Đơn #1234 đã giao thành công",
        time: lang === "en" ? "Yesterday" : "Hôm qua",
        unread: !readMap["order-1234-delivered"],
      },
    ];
    setList(initial);
  }, [lang]);

  useEffect(() => {
    load();
  }, [load]);

  const markAllRead = () => {
    const map: Record<string, boolean> = {};
    list.forEach((n) => (map[n.id] = true));
    localStorage.setItem("noti_read", JSON.stringify(map));
    setList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const visible = list.filter((n) => (filter === "UNREAD" ? n.unread : true));

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {t("notifications.title")}
      </Typography>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 1 }}>
        <Button
          variant={filter === "ALL" ? "contained" : "outlined"}
          onClick={() => setFilter("ALL")}
        >
          {t("notifications.all")}
        </Button>
        <Button
          variant={filter === "UNREAD" ? "contained" : "outlined"}
          onClick={() => setFilter("UNREAD")}
        >
          {t("notifications.unread")}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button variant="text" onClick={markAllRead}>
          {t("notifications.markAllRead")}
        </Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <List>
          {visible.map((n) => (
            <ListItem key={n.id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText primary={n.title} secondary={n.time} />
              {n.unread && <Chip label={lang === "en" ? "NEW" : "MỚI"} color="warning" size="small" />}
            </ListItem>
          ))}
          {!visible.length && (
            <Typography variant="body2" color="text.secondary">
              {lang === "en" ? "No notifications" : "Không có thông báo"}
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
