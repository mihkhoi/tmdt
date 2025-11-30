import { useEffect, useState } from "react";
import http from "../../api/http";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) => (u && u.startsWith("/uploads/")) ? apiOrigin + u : u;

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    images: [] as File[],
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({
    name: "",
    price: "",
    brand: "",
    stock: "",
    categoryId: "",
  });

  const load = async () => {
    const res = await http.get("/products", { params: { page: 0, size: 50 } });
    const list = Array.isArray(res.data?.content) ? res.data.content : [];
    setProducts(list);
    const cRes = await http.get("/categories");
    setCategories(Array.isArray(cRes.data) ? cRes.data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMessage(null);
    const pRes = await http.post("/products", {
      name: form.name,
      price: Number(form.price),
      category: form.category ? { id: Number(form.category) } : undefined,
      brand: form.brand,
      stock: Number(form.stock),
      status: "ACTIVE",
    });
    const product = pRes.data;
    if (form.images && form.images.length > 0) {
      const [first, ...rest] = form.images;
      if (first) {
        const fd = new FormData();
        fd.append("file", first);
        await http.post(`/products/${product.id}/image`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      for (const file of rest) {
        const fd = new FormData();
        fd.append("file", file);
        await http.post(`/products/${product.id}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }
    setMessage("Tạo sản phẩm thành công");
    setForm({
      name: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      images: [],
    });
    await load();
  };

  const remove = async (id: number) => {
    await http.delete(`/products/${id}`);
    await load();
  };

  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [confirmId, setConfirmId] = useState<number | null>(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Quản lý sản phẩm
      </Typography>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { md: "1fr 140px 200px 160px 1fr 140px" },
        }}
      >
        <TextField
          size="small"
          label="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          size="small"
          label="Giá"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <Select
          size="small"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: String(e.target.value) })
          }
          displayEmpty
        >
          <MenuItem value="">Chọn danh mục</MenuItem>
          {categories.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          size="small"
          label="Thương hiệu"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <TextField
          size="small"
          label="Tồn kho"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <Button variant="contained" onClick={onSubmit}>
          Tạo
        </Button>
        <Box sx={{ gridColumn: "1 / -1" }}>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setForm({
                ...form,
                images: Array.from((e.target as any).files || []),
              })
            }
          />
          {form.images?.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {form.images.map((f: File, idx: number) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(f)}
                  alt={`preview-${idx}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Tồn</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>
                  {editId === p.id ? (
                    <TextField
                      size="small"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </TableCell>
                <TableCell>
                  {editId === p.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  ) : (
                    p.price
                  )}
                </TableCell>
                <TableCell>
                  {editId === p.id ? (
                    <Select
                      size="small"
                      value={editForm.categoryId}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          categoryId: String(e.target.value),
                        })
                      }
                      displayEmpty
                    >
                      <MenuItem value="">Chọn</MenuItem>
                      {categories.map((c: any) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    p.category?.name || p.category || ""
                  )}
                </TableCell>
                <TableCell>
                  {editId === p.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editForm.stock}
                      onChange={(e) =>
                        setEditForm({ ...editForm, stock: e.target.value })
                      }
                    />
                  ) : (
                    p.stock
                  )}
                </TableCell>
                <TableCell>
                  {p.imageUrl ? (
                    <img src={toAbs(p.imageUrl)} alt={p.name} style={{ width: 60 }} />
                  ) : (
                    ""
                  )}
                  {editId === p.id ? (
                    <Box sx={{ mt: 1 }}>
                      <input
                        type="file"
                        onChange={async (e) => {
                          const file = (e.target as any).files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          await http.post(`/products/${p.id}/image`, fd, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          await load();
                        }}
                      />
                    </Box>
                  ) : null}
                  <Box>
                    <Gallery productId={p.id} />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => setConfirmId(p.id)}>
                    Xóa
                  </Button>
                  {editId === p.id ? (
                    <>
                      <Button
                        sx={{ ml: 1 }}
                        onClick={async () => {
                          try {
                            await http.put(`/products/${p.id}`, {
                              name: editForm.name,
                              price: Number(editForm.price),
                              brand: editForm.brand ?? p.brand,
                              stock: Number(editForm.stock),
                              status: p.status,
                              category: editForm.categoryId
                                ? { id: Number(editForm.categoryId) }
                                : p.category || undefined,
                            });
                            setEditId(null);
                            await load();
                            setToast({
                              open: true,
                              msg: "Cập nhật sản phẩm thành công",
                              type: "success",
                            });
                          } catch {
                            setToast({
                              open: true,
                              msg: "Cập nhật thất bại",
                              type: "error",
                            });
                          }
                        }}
                      >
                        Lưu
                      </Button>
                      <Button sx={{ ml: 1 }} onClick={() => setEditId(null)}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setEditId(p.id);
                        setEditForm({
                          name: p.name,
                          price: p.price,
                          brand: p.brand,
                          stock: p.stock,
                          categoryId: p.category?.id || "",
                        });
                      }}
                    >
                      Sửa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Xóa sản phẩm?</DialogTitle>
        <DialogContent>Hành động này không thể hoàn tác.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Hủy</Button>
          <Button
            color="error"
            onClick={async () => {
              if (confirmId !== null) {
                await remove(confirmId);
                setConfirmId(null);
              }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <GalleryScript />
    </Box>
  );
};

export default AdminProductsPage;

const Gallery = ({ productId }: { productId: number }) => {
  const [imgs, setImgs] = useState<any[]>([]);
  useEffect(() => {
    const run = async () => {
      const res = await http.get(`/products/${productId}/images`);
      setImgs(Array.isArray(res.data) ? res.data : []);
    };
    run();
  }, [productId]);
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
      {imgs.map((im, idx) => (
        <div key={im.id} style={{ position: "relative" }}>
          <img
            src={toAbs(im.url)}
            alt="gallery"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <button
            onClick={async () => {
              await http.delete(`/products/${productId}/images/${im.id}`);
              const res = await http.get(`/products/${productId}/images`);
              setImgs(Array.isArray(res.data) ? res.data : []);
            }}
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              background: "red",
              color: "white",
              borderRadius: 8,
            }}
          >
            x
          </button>
          <button
            onClick={() => {
              const el = document.getElementById(`editfile-${productId}-${im.id}`) as HTMLInputElement | null;
              el?.click();
            }}
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              background: "#1976d2",
              color: "white",
              borderRadius: 8,
            }}
          >
            ✎
          </button>
          <input
            id={`editfile-${productId}-${im.id}`}
            type="file"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = (e.target as any).files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.append("file", file);
              await http.put(`/products/${productId}/images/${im.id}`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              const res = await http.get(`/products/${productId}/images`);
              setImgs(Array.isArray(res.data) ? res.data : []);
            }}
          />
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <button
              disabled={idx === 0}
              onClick={async () => {
                if (idx === 0) return;
                const next = imgs.slice();
                const tmp = next[idx - 1];
                next[idx - 1] = next[idx];
                next[idx] = tmp;
                setImgs(next);
                await http.put(
                  `/products/${productId}/images/order`,
                  next.map((x) => x.id)
                );
              }}
            >
              ↑
            </button>
            <button
              disabled={idx === imgs.length - 1}
              onClick={async () => {
                if (idx === imgs.length - 1) return;
                const next = imgs.slice();
                const tmp = next[idx + 1];
                next[idx + 1] = next[idx];
                next[idx] = tmp;
                setImgs(next);
                await http.put(
                  `/products/${productId}/images/order`,
                  next.map((x) => x.id)
                );
              }}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const GalleryScript = () => null;
