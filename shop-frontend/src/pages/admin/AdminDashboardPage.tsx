// src/pages/admin/AdminDashboardPage.tsx
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Select, MenuItem, Chip, Divider, Skeleton, Card, CardContent } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../../api/http";

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastDays, setLastDays] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(false);

  const fmtCurrency = (n: number | string | undefined) => {
    const v = Number(n || 0);
    if (isNaN(v)) return "0 ₫";
    return v.toLocaleString("vi-VN") + " ₫";
  };

  const fetchAll = async () => {
    try {
      setError(null);
      setLoading(true);

      const [statsRes, usersRes, ordersRes, productsRes] = await Promise.all([
        http.get("/admin/stats/summary"),
        http.get("/admin/users"),
        http.get("/admin/orders"),
        http.get("/products"),
      ]);

      setStats(statsRes.data);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

      // /products trả Page => lấy content
      const pData = productsRes.data;
      const pList = Array.isArray(pData)
        ? pData
        : Array.isArray(pData?.content)
        ? pData.content
        : [];
      setProducts(pList);
    } catch (e) {
      console.error(e);
      setError("Không tải được dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: "#ffebee" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Thống kê nhanh */}
      <Box
        mb={3}
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
        }}
      >
        {(loading || !stats) ? (
          [1, 2, 3, 4].map((i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="rectangular" height={38} />
            </Paper>
          ))
        ) : (
          <>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PeopleIcon color="primary" />
                <Box>
                  <Typography variant="body2">Tổng user</Typography>
                  <Typography variant="h5">{stats.totalUsers}</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Inventory2Icon color="primary" />
                <Box>
                  <Typography variant="body2">Tổng sản phẩm</Typography>
                  <Typography variant="h5">{stats.totalProducts}</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingCartIcon color="primary" />
                <Box>
                  <Typography variant="body2">Tổng đơn hàng</Typography>
                  <Typography variant="h5">{stats.totalOrders}</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoneyIcon color="primary" />
                <Box>
                  <Typography variant="body2">Doanh thu</Typography>
                  <Typography variant="h5">{fmtCurrency(stats.totalRevenue)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>

      {/* Bộ lọc thời gian cho phân tích */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="subtitle1">Khoảng thời gian</Typography>
        <Select size="small" value={lastDays} onChange={(e) => setLastDays(Number(e.target.value))}>
          <MenuItem value={7}>7 ngày</MenuItem>
          <MenuItem value={14}>14 ngày</MenuItem>
          <MenuItem value={30}>30 ngày</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button variant="contained" component={Link} to="/admin/users">Người dùng</Button>
        <Button variant="contained" component={Link} to="/admin/products">Sản phẩm</Button>
        <Button variant="contained" component={Link} to="/admin/orders">Đơn hàng</Button>
        <Button variant="contained" component={Link} to="/admin/vouchers">Voucher</Button>
      </Box>

      {/* Bảng tổng hợp */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {/* User */}
        <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="h6" mb={1}>
            Người dùng
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <List dense>
              {users.map((u) => (
                <ListItem key={u.id}>
                  <ListItemText primary={u.username} secondary={`Role: ${u.role}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Products */}
        <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="h6" mb={1}>
            Sản phẩm
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <List dense>
              {products.map((p) => (
                <ListItem key={p.id}>
                  <ListItemText primary={p.name} secondary={`Giá: ${fmtCurrency(p.price)}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Orders */}
        <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="h6" mb={1}>
            Đơn hàng
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <List dense>
              {orders.map((o) => (
                <ListItem key={o.id}>
                  <ListItemText primary={`Order #${o.id} - ${o.status}`} secondary={`Tổng: ${fmtCurrency(o.totalAmount)}`} />
                  <Chip size="small" label={o.status} color={o.status === "DELIVERED" ? "success" : o.status === "CANCELED" ? "error" : o.status === "PENDING" ? "warning" : "default"} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Thống kê nâng cao */}
      <Box sx={{ mt: 3, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" } }}>
        {/* Doanh thu theo ngày (mini chart) */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Doanh thu theo ngày (trong {lastDays} ngày)</Typography>
          {(() => {
            const now = new Date();
            const start = new Date(now.getTime() - lastDays * 24 * 60 * 60 * 1000);
            const buckets: Record<string, number> = {};
            for (let i = 0; i <= lastDays; i++) {
              const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
              const key = d.toISOString().slice(0, 10);
              buckets[key] = 0;
            }
            orders.forEach((o: any) => {
              const created = o.createdAt ? new Date(o.createdAt) : null;
              if (!created) return;
              if (created >= start && created <= now) {
                const k = created.toISOString().slice(0, 10);
                const val = Number(o.totalAmount || 0);
                buckets[k] = (buckets[k] || 0) + (isNaN(val) ? 0 : val);
              }
            });
            const keys = Object.keys(buckets).sort();
            const max = Math.max(...keys.map((k) => buckets[k]));
            return (
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 120 }}>
                {keys.map((k) => (
                  <Box key={k} sx={{ flex: 1 }}>
                    <Box sx={{
                      height: max > 0 ? Math.max(6, Math.round((buckets[k] / max) * 100)) : 6,
                      bgcolor: "#1976d2",
                      borderRadius: 1,
                    }} />
                    <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 0.5 }}>
                      {k.slice(5)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          })()}
        </Paper>

        {/* Phân bố trạng thái đơn */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Trạng thái đơn hàng</Typography>
          {(() => {
            const counts: Record<string, number> = {};
            orders.forEach((o: any) => {
              const s = String(o.status || "").toUpperCase();
              counts[s] = (counts[s] || 0) + 1;
            });
            const all = Object.entries(counts);
            if (all.length === 0) return <Typography variant="body2">Chưa có dữ liệu</Typography>;
            return (
              <Box sx={{ display: "grid", gap: 1 }}>
                {all.map(([st, c]) => (
                  <Box key={st} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip size="small" label={st} color={st === "PENDING" ? "warning" : st === "DELIVERED" ? "success" : st === "CANCELED" ? "error" : "default"} />
                    <Box sx={{ flex: 1, height: 8, bgcolor: "#e0e0e0", borderRadius: 4 }}>
                      <Box sx={{ width: `${Math.min(100, Math.round((c / orders.length) * 100))}%`, height: 8, bgcolor: "#1976d2", borderRadius: 4 }} />
                    </Box>
                    <Typography variant="caption">{c}</Typography>
                  </Box>
                ))}
              </Box>
            );
          })()}
        </Paper>
      </Box>

      {/* Top sản phẩm theo số lượng bán ra */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Top sản phẩm (theo số lượng)</Typography>
          {(() => {
            const map = new Map<number, { name: string; qty: number }>();
            orders.forEach((o: any) => {
              const items = Array.isArray(o.items) ? o.items : [];
              items.forEach((it: any) => {
                const id = Number(it.product?.id);
                const name = String(it.product?.name || "");
                const q = Number(it.quantity || 0);
                if (!id || !name) return;
                const cur = map.get(id);
                if (cur) cur.qty += q; else map.set(id, { name, qty: q });
              });
            });
            const arr = Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 10);
            if (arr.length === 0) return <Typography variant="body2">Chưa có dữ liệu</Typography>;
            return (
              <List dense>
                {arr.map((p, idx) => (
                  <ListItem key={p.name}>
                    <Chip sx={{ mr: 1 }} size="small" label={`#${idx + 1}`} />
                    <ListItemText primary={p.name} secondary={`Đã bán: ${p.qty}`} />
                  </ListItem>
                ))}
              </List>
            );
          })()}
        </Paper>
      </Box>

      {/* Đơn gần đây */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Đơn gần đây</Typography>
          <List dense>
            {orders
              .slice()
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 8)
              .map((o: any) => (
                <ListItem key={o.id}>
                  <ListItemText
                    primary={`#${o.id} — ${o.user?.username || ""} — ${o.status}`}
                    secondary={`${fmtCurrency(o.totalAmount)} • ${o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}`}
                  />
                  <Box>
                    <Button size="small" component={Link} to={`/admin/orders`} sx={{ mr: 1 }}>Chi tiết</Button>
                    <Button size="small" component={Link} to={`/admin/users`}>
                      User
                    </Button>
                  </Box>
                </ListItem>
              ))}
          </List>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button component={Link} to="/admin/orders">Xem tất cả đơn</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
