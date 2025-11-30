import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import http from "../api/http";
import { clearCart } from "../store/cartSlice";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);
  type Addr = { id: number; line: string; type: string; isDefault: boolean };
  const [shippingBook, setShippingBook] = useState<Addr[]>([]);
  const [billingBook, setBillingBook] = useState<Addr[]>([]);
  const loadAddresses = useCallback(async () => {
    try {
      const [shipRes, billRes] = await Promise.all([
        http.get("/addresses", { params: { type: "SHIPPING" } }),
        http.get("/addresses", { params: { type: "BILLING" } }),
      ]);
      const sList: Addr[] = Array.isArray(shipRes.data) ? shipRes.data : [];
      const bList: Addr[] = Array.isArray(billRes.data) ? billRes.data : [];
      setShippingBook(sList);
      setBillingBook(bList);
      const sDef = sList.find((a) => a.isDefault);
      const bDef = bList.find((a) => a.isDefault);
      if (sDef) setShippingAddress(sDef.line);
      if (bDef) setBillingAddress(bDef.line);
    } catch (e) {
      console.error(e);
    }
  }, []);
  useEffect(() => {
    const pm = localStorage.getItem("default_payment");
    if (pm) setPaymentMethod(pm);
    loadAddresses();
  }, [loadAddresses]);
  useEffect(() => {
    localStorage.setItem("default_payment", paymentMethod);
  }, [paymentMethod]);

  const addAddress = async (type: "SHIPPING" | "BILLING") => {
    const line = type === "SHIPPING" ? shippingAddress : billingAddress;
    if (!line.trim()) return;
    await http.post("/addresses", { line, type });
    await loadAddresses();
  };
  const deleteAddress = async (id: number) => {
    await http.delete(`/addresses/${id}`);
    await loadAddresses();
  };
  const editAddress = async (a: Addr) => {
    const next = window.prompt("Sửa địa chỉ", a.line);
    if (next && next.trim() && next !== a.line) {
      await http.put(`/addresses/${a.id}`, { line: next });
      await loadAddresses();
    }
  };
  const setDefault = async (a: Addr) => {
    await http.put(`/addresses/${a.id}/default`);
    await loadAddresses();
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!shippingAddress.trim()) {
        setError("Vui lòng nhập địa chỉ giao hàng");
        setLoading(false);
        return;
      }
      if (!billingAddress.trim()) {
        setBillingAddress(shippingAddress);
      }

      const token = localStorage.getItem("token");
      const body = {
        shippingAddress,
        billingAddress,
        paymentMethod,
        voucherCode: voucherCode || undefined,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await http.post("/orders", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLastOrderTotal(Number(res.data?.totalAmount ?? 0));
      setSuccessOrderId(Number(res.data?.id ?? 0) || null);
      dispatch(clearCart());
      setShippingAddress("");
      setBillingAddress("");
      setPaymentMethod("COD");
      setVoucherCode("");
    } catch (e) {
      console.error(e);
      setError("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Thanh toán
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {successOrderId !== null && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#e8f5e9",
            border: "1px solid #c8e6c9",
          }}
        >
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Đặt hàng thành công
            </Typography>
            <Typography variant="body2">
              Mã đơn #{successOrderId}
              {lastOrderTotal !== null ? ` • Tổng ${lastOrderTotal} ₫` : ""}
            </Typography>
          </Box>
          <Button component={Link} to="/orders" variant="outlined">
            Xem Đơn Mua
          </Button>
          <Button
            component={Link}
            to={`/orders/${successOrderId}`}
            variant="contained"
            color="success"
          >
            Xem chi tiết đơn
          </Button>
        </Paper>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 380px" },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>
            Thông tin giao hàng
          </Typography>
          <label style={{ display: "block", marginBottom: 8 }}>
            Địa chỉ giao hàng
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
            placeholder="Nhập địa chỉ cụ thể của bạn"
          />

          <Typography variant="h6" mb={1}>
            Thông tin thanh toán
          </Typography>
          <label style={{ display: "block", marginBottom: 8 }}>
            Địa chỉ thanh toán
          </label>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
            placeholder="Nhập địa chỉ xuất hóa đơn (nếu khác)"
          />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Phương thức thanh toán
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="COD"
              control={<Radio />}
              label="Thanh toán khi nhận hàng (COD)"
            />
            <FormControlLabel
              value="BANK"
              control={<Radio />}
              label="Chuyển khoản ngân hàng"
            />
            <FormControlLabel
              value="ONLINE"
              control={<Radio />}
              label="Thanh toán online"
            />
          </RadioGroup>

          <label style={{ display: "block", marginBottom: 8 }}>
            Mã voucher
          </label>
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
            placeholder="Nhập mã giảm giá nếu có"
          />

          <Button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            variant="contained"
            color="success"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>
            Tóm tắt đơn hàng
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" mb={1}>
            Địa chỉ giao hàng đã lưu
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {shippingBook.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="radio"
                    name="ship_addr"
                    checked={shippingAddress === a.line}
                    onChange={() => setShippingAddress(a.line)}
                  />
                  <span>
                    {a.line}
                    {a.isDefault ? " (Mặc định)" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="small" onClick={() => editAddress(a)}>
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteAddress(a.id)}
                  >
                    Xóa
                  </Button>
                  {!a.isDefault && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => setDefault(a)}
                    >
                      Mặc định
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              size="small"
              variant="outlined"
              onClick={() => addAddress("SHIPPING")}
            >
              Lưu địa chỉ giao hàng hiện tại
            </Button>
          </div>

          <Typography variant="subtitle2" mb={1}>
            Địa chỉ thanh toán đã lưu
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {billingBook.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="radio"
                    name="bill_addr"
                    checked={billingAddress === a.line}
                    onChange={() => setBillingAddress(a.line)}
                  />
                  <span>
                    {a.line}
                    {a.isDefault ? " (Mặc định)" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="small" onClick={() => editAddress(a)}>
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => deleteAddress(a.id)}
                  >
                    Xóa
                  </Button>
                  {!a.isDefault && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => setDefault(a)}
                    >
                      Mặc định
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              size="small"
              variant="outlined"
              onClick={() => addAddress("BILLING")}
            >
              Lưu địa chỉ thanh toán hiện tại
            </Button>
          </div>
          {items.map((i: any) => (
            <Box
              key={i.id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                {i.name} x {i.quantity}
              </Typography>
              <Typography variant="body2">{i.price * i.quantity} ₫</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Tổng: {total} ₫</Typography>
          {lastOrderTotal !== null && (
            <Typography variant="subtitle2" color="primary">
              Tổng sau giảm: {lastOrderTotal} ₫
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
