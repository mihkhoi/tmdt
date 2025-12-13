import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { productApi } from "../api/productApi";
import http from "../api/http";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ChatWidget = () => {
  const tawkUrl = process.env.REACT_APP_TAWK_URL;
  const tawkProp = process.env.REACT_APP_TAWK_PROPERTY_ID;
  const tawkWidget = process.env.REACT_APP_TAWK_WIDGET_ID;
  const chatwootUrl = process.env.REACT_APP_CHATWOOT_URL;
  const chatwootToken = process.env.REACT_APP_CHATWOOT_TOKEN;

  const enableProvider = useMemo(() => {
    return Boolean(
      tawkUrl || (tawkProp && tawkWidget) || (chatwootUrl && chatwootToken)
    );
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
          anyWin.chatwootSDK.run({
            websiteToken: chatwootToken,
            baseUrl: chatwootUrl,
          });
        }
      };
      document.body.appendChild(s);
      return () => {
        document.body.removeChild(s);
      };
    }
  }, [
    enableProvider,
    tawkUrl,
    tawkProp,
    tawkWidget,
    chatwootUrl,
    chatwootToken,
  ]);

  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const auth = useSelector((s: RootState) => s.auth);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  type Message = {
    id: number;
    from: "user" | "bot";
    text: string;
    quickReplies?: string[];
    products?: any[];
    timestamp?: Date;
  };

  const initialMessage: Message = {
    id: 1,
    from: "bot",
    text:
      lang === "en"
        ? "👋 Hello! I'm your shopping assistant. I can help you with:\n\n• 🔍 Search products\n• 📦 Track orders\n• 💳 Payment info\n• 🚚 Shipping details\n• 🎁 Promotions & vouchers\n\nWhat would you like to know?"
        : "👋 Xin chào! Mình là trợ lý mua sắm của bạn. Mình có thể giúp:\n\n• 🔍 Tìm sản phẩm\n• 📦 Theo dõi đơn hàng\n• 💳 Thông tin thanh toán\n• 🚚 Vận chuyển\n• 🎁 Khuyến mãi & voucher\n\nBạn muốn biết gì?",
    quickReplies:
      lang === "en"
        ? ["Search Products", "My Orders", "Shipping Info", "Payment Methods"]
        : ["Tìm sản phẩm", "Đơn của tôi", "Vận chuyển", "Thanh toán"],
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Reset conversation when opening chat
  useEffect(() => {
    if (open && messages.length === 1) {
      // Already has initial message
    }
  }, [open]);

  // Detect if message is in Vietnamese
  const detectLanguage = (text: string): "vi" | "en" => {
    const vietnameseChars =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    const vietnameseWords = [
      "tìm",
      "mua",
      "sản phẩm",
      "đơn hàng",
      "vận chuyển",
      "thanh toán",
      "khuyến mãi",
      "voucher",
      "giúp",
      "hỗ trợ",
      "xin chào",
      "chào",
      "cảm ơn",
      "bạn",
      "mình",
      "tôi",
      "của",
      "cho",
      "với",
      "về",
    ];
    const lower = text.toLowerCase();

    if (vietnameseChars.test(text)) return "vi";
    if (vietnameseWords.some((word) => lower.includes(word))) return "vi";
    return "en";
  };

  const getBotReply = async (
    text: string
  ): Promise<{ text: string; products?: any[]; quickReplies?: string[] }> => {
    const lower = text.toLowerCase();
    const context = [...conversationContext, text].slice(-5); // Keep last 5 messages for context
    setConversationContext(context);

    // Auto-detect language from user message, but prefer app language setting
    const detectedLang = detectLanguage(text);
    const useLang = lang || detectedLang;

    // Product Search - Enhanced Vietnamese detection
    if (
      lower.includes("tìm") ||
      lower.includes("search") ||
      lower.includes("mua") ||
      lower.includes("buy") ||
      lower.includes("sản phẩm") ||
      lower.includes("product") ||
      lower.includes("hàng") ||
      lower.includes("đồ") ||
      lower.includes("quần áo") ||
      lower.includes("giày") ||
      lower.includes("túi") ||
      lower.includes("phụ kiện") ||
      lower.includes("bán") ||
      lower.includes("có") ||
      (/^[a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]+$/i.test(
        text
      ) &&
        text.length > 2)
    ) {
      try {
        // Extract product name from query - Enhanced Vietnamese
        const searchQuery = text
          .replace(
            /tìm|search|mua|buy|sản phẩm|product|cho tôi|show me|hiển thị|bán|bạn có|có|giúp tôi tìm|tôi muốn|muốn|mình muốn|mình cần|cần/gi,
            ""
          )
          .trim();

        if (searchQuery.length > 0) {
          const res = await productApi.getProductsPage({
            q: searchQuery,
            page: 0,
            size: 5,
          });
          const products = Array.isArray(res?.content) ? res.content : [];

          if (products.length > 0) {
            return {
              text:
                useLang === "en"
                  ? `🔍 Found ${products.length} product(s) for "${searchQuery}":`
                  : `🔍 Tìm thấy ${products.length} sản phẩm cho "${searchQuery}":\n\nBạn có thể click vào sản phẩm để xem chi tiết nhé!`,
              products: products,
              quickReplies: [
                useLang === "en" ? "Show More" : "Xem thêm",
                useLang === "en" ? "Search Again" : "Tìm lại",
                useLang === "en" ? "Browse All" : "Xem tất cả",
              ],
            };
          } else {
            return {
              text:
                useLang === "en"
                  ? `😔 Sorry, I couldn't find products matching "${searchQuery}". Try different keywords or browse our homepage!`
                  : `😔 Xin lỗi, mình không tìm thấy sản phẩm nào cho "${searchQuery}".\n\nBạn có thể:\n• Thử từ khóa khác\n• Xem trang chủ để tìm sản phẩm\n• Cho mình biết bạn đang tìm gì nhé!`,
              quickReplies: [
                useLang === "en" ? "Browse Products" : "Xem sản phẩm",
                useLang === "en" ? "Search Again" : "Tìm lại",
                useLang === "en" ? "Help" : "Trợ giúp",
              ],
            };
          }
        }
      } catch (e) {
        console.error("Product search error:", e);
      }
    }

    // Orders - Check if user is logged in - Enhanced Vietnamese
    if (
      lower.includes("order") ||
      lower.includes("đơn hàng") ||
      lower.includes("đơn của tôi") ||
      lower.includes("my order") ||
      lower.includes("track") ||
      lower.includes("đơn mua") ||
      lower.includes("lịch sử mua") ||
      lower.includes("mua hàng") ||
      lower.includes("theo dõi đơn") ||
      lower.includes("kiểm tra đơn")
    ) {
      if (!auth.token) {
        return {
          text:
            useLang === "en"
              ? "🔐 Please log in to view your orders. You can log in from the top menu!"
              : "🔐 Vui lòng đăng nhập để xem đơn hàng của bạn.\n\nBạn có thể đăng nhập từ menu trên cùng bên phải nhé!",
          quickReplies: [
            useLang === "en" ? "Login" : "Đăng nhập",
            useLang === "en" ? "Browse Products" : "Xem sản phẩm",
          ],
        };
      }

      try {
        const res = await http.get("/orders/my", {
          params: { page: 0, size: 5 },
        });
        const orders = Array.isArray(res.data?.content) ? res.data.content : [];

        if (orders.length > 0) {
          const orderList = orders
            .slice(0, 3)
            .map((o: any) => {
              const status = o.status || "PENDING";
              const statusText =
                useLang === "en"
                  ? status === "PENDING"
                    ? "Pending"
                    : status === "PROCESSING"
                    ? "Processing"
                    : status === "SHIPPED"
                    ? "Shipped"
                    : status === "DELIVERED"
                    ? "Delivered"
                    : status === "CANCELED"
                    ? "Canceled"
                    : status
                  : status === "PENDING"
                  ? "Chờ xác nhận"
                  : status === "PROCESSING"
                  ? "Chờ giao hàng"
                  : status === "SHIPPED"
                  ? "Đang vận chuyển"
                  : status === "DELIVERED"
                  ? "Hoàn thành"
                  : status === "CANCELED"
                  ? "Đã hủy"
                  : status;
              return `• Đơn #${o.id} - ${statusText} - ${new Intl.NumberFormat(
                "vi-VN"
              ).format(o.totalAmount || 0)}₫`;
            })
            .join("\n");

          return {
            text:
              useLang === "en"
                ? `📦 Your recent orders:\n\n${orderList}\n\nView all orders in your account!`
                : `📦 Đơn hàng gần đây của bạn:\n\n${orderList}\n\nBạn có thể xem chi tiết và theo dõi đơn hàng trong tài khoản nhé!`,
            quickReplies: [
              useLang === "en" ? "View All Orders" : "Xem tất cả đơn",
              useLang === "en" ? "Track Order" : "Theo dõi đơn",
            ],
          };
        } else {
          return {
            text:
              useLang === "en"
                ? "📦 You don't have any orders yet. Start shopping now!"
                : "📦 Bạn chưa có đơn hàng nào.\n\nHãy bắt đầu mua sắm ngay để nhận được nhiều ưu đãi hấp dẫn nhé! 🛍️",
            quickReplies: [
              useLang === "en" ? "Browse Products" : "Xem sản phẩm",
              useLang === "en" ? "Flash Sale" : "Flash Sale",
            ],
          };
        }
      } catch (e) {
        console.error("Orders fetch error:", e);
        return {
          text:
            lang === "en"
              ? "❌ Couldn't load your orders. Please try again later or check your account page."
              : "❌ Không thể tải đơn hàng. Vui lòng thử lại sau hoặc kiểm tra trang tài khoản.",
          quickReplies: [
            lang === "en" ? "My Account" : "Tài khoản",
            lang === "en" ? "Browse Products" : "Xem sản phẩm",
          ],
        };
      }
    }

    // Shipping - Enhanced Vietnamese
    if (
      lower.includes("ship") ||
      lower.includes("vận chuyển") ||
      lower.includes("giao hàng") ||
      lower.includes("phí ship") ||
      lower.includes("delivery") ||
      lower.includes("phí vận chuyển") ||
      lower.includes("giao đến") ||
      lower.includes("thời gian giao") ||
      lower.includes("freeship") ||
      lower.includes("miễn phí ship")
    ) {
      return {
        text:
          useLang === "en"
            ? "🚚 Shipping Information:\n\n• Standard Shipping: 18,500₫ - 25,000₫\n• Fast Shipping: 25,000₫\n• FREE shipping for orders ≥ 100,000₫\n• Delivery time: 2-3 days\n• We ship nationwide!"
            : "🚚 Thông tin vận chuyển:\n\n💰 Phí vận chuyển:\n• Tiết kiệm: 18,500₫ - 25,000₫\n• Nhanh: 25,000₫\n\n🎁 Ưu đãi:\n• MIỄN PHÍ khi đơn ≥ 100,000₫\n• Giao hàng toàn quốc\n• Thời gian giao: 2-3 ngày\n\nBạn có thể chọn phương thức vận chuyển khi thanh toán nhé!",
        quickReplies: [
          useLang === "en" ? "Checkout" : "Thanh toán",
          useLang === "en" ? "More Info" : "Xem thêm",
        ],
      };
    }

    // Payment - Enhanced Vietnamese
    if (
      lower.includes("payment") ||
      lower.includes("thanh toán") ||
      lower.includes("momo") ||
      lower.includes("vnpay") ||
      lower.includes("cod") ||
      lower.includes("pay") ||
      lower.includes("trả tiền") ||
      lower.includes("phương thức thanh toán") ||
      lower.includes("cách thanh toán")
    ) {
      return {
        text:
          useLang === "en"
            ? "💳 Payment Methods:\n\n✅ COD (Cash on Delivery)\n✅ VNPay (All banks)\n✅ MoMo Wallet\n\nAll payment methods are secure and verified. Choose your preferred method at checkout!"
            : "💳 Phương thức thanh toán:\n\n✅ COD (Thanh toán khi nhận hàng)\n   → Thanh toán bằng tiền mặt khi nhận hàng\n\n✅ VNPay (Tất cả ngân hàng)\n   → Thanh toán qua thẻ ngân hàng hoặc ví điện tử\n\n✅ Ví MoMo\n   → Thanh toán nhanh qua ứng dụng MoMo\n\n🔒 Tất cả phương thức đều an toàn và được xác minh. Bạn có thể chọn phương thức yêu thích khi thanh toán!",
        quickReplies: [
          useLang === "en" ? "Checkout" : "Thanh toán",
          useLang === "en" ? "My Cart" : "Giỏ hàng",
        ],
      };
    }

    // Voucher/Promotions
    if (
      lower.includes("voucher") ||
      lower.includes("mã") ||
      lower.includes("khuyến mãi") ||
      lower.includes("promo") ||
      lower.includes("discount") ||
      lower.includes("giảm giá")
    ) {
      return {
        text:
          lang === "en"
            ? "🎁 Current Promotions:\n\n• SAVE30: Save 30k on orders ≥ 300k\n• FREESHIP: Free shipping on orders ≥ 100k\n• Flash Sale: Up to 50% off selected items\n\nEnter voucher code at checkout!"
            : "🎁 Khuyến mãi hiện tại:\n\n• SAVE30: Giảm 30k cho đơn ≥ 300k\n• FREESHIP: Freeship cho đơn ≥ 100k\n• Flash Sale: Giảm đến 50% cho sản phẩm chọn lọc\n\nNhập mã ở trang thanh toán nhé!",
        quickReplies: [
          lang === "en" ? "Checkout" : "Thanh toán",
          lang === "en" ? "Flash Sale" : "Flash Sale",
        ],
      };
    }

    // Help
    if (
      lower.includes("help") ||
      lower.includes("giúp") ||
      lower.includes("hỗ trợ") ||
      lower.includes("support")
    ) {
      return {
        text:
          lang === "en"
            ? "💬 I can help you with:\n\n• 🔍 Search and find products\n• 📦 Track your orders\n• 💳 Payment information\n• 🚚 Shipping details\n• 🎁 Promotions & vouchers\n• 📱 Account assistance\n\nJust ask me anything!"
            : "💬 Mình có thể giúp bạn về:\n\n• 🔍 Tìm kiếm sản phẩm\n• 📦 Theo dõi đơn hàng\n• 💳 Thông tin thanh toán\n• 🚚 Chi tiết vận chuyển\n• 🎁 Khuyến mãi & voucher\n• 📱 Hỗ trợ tài khoản\n\nCứ hỏi mình bất cứ gì!",
        quickReplies: [
          lang === "en" ? "Search Products" : "Tìm sản phẩm",
          lang === "en" ? "My Orders" : "Đơn của tôi",
          lang === "en" ? "Shipping" : "Vận chuyển",
        ],
      };
    }

    // Greetings - Enhanced Vietnamese
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("xin chào") ||
      lower.includes("chào") ||
      lower.includes("hey") ||
      lower.includes("chào bạn") ||
      lower.includes("chào mình") ||
      lower.includes("xin chào bạn") ||
      lower === "chào" ||
      lower === "hi" ||
      lower === "hello"
    ) {
      return {
        text:
          useLang === "en"
            ? "👋 Hello! Nice to meet you! How can I help you today? You can ask me about products, orders, shipping, or anything else!"
            : "👋 Xin chào bạn! Rất vui được gặp bạn!\n\nMình là trợ lý mua sắm của ShopEase. Mình có thể giúp bạn:\n\n• 🔍 Tìm kiếm sản phẩm\n• 📦 Theo dõi đơn hàng\n• 💳 Thông tin thanh toán\n• 🚚 Vận chuyển\n• 🎁 Khuyến mãi & voucher\n\nBạn muốn biết gì hôm nay? 😊",
        quickReplies: [
          useLang === "en" ? "Search Products" : "Tìm sản phẩm",
          useLang === "en" ? "My Orders" : "Đơn của tôi",
          useLang === "en" ? "Help" : "Trợ giúp",
        ],
      };
    }

    // Default - More helpful response with better Vietnamese
    const isVietnamese = useLang === "vi" || detectLanguage(text) === "vi";
    return {
      text: isVietnamese
        ? "🤔 Mình chưa hiểu rõ lắm. Để mình giúp bạn tốt hơn, bạn có thể:\n\n• Tìm sản phẩm: 'Tìm áo thun', 'Mua quần jean'\n• Xem đơn hàng: 'Đơn của tôi', 'Kiểm tra đơn'\n• Vận chuyển: 'Phí ship', 'Thời gian giao hàng'\n• Thanh toán: 'Cách thanh toán', 'Phương thức thanh toán'\n• Khuyến mãi: 'Voucher', 'Khuyến mãi'\n\nHoặc bạn có thể hỏi mình bất cứ gì về mua sắm nhé! 😊"
        : "🤔 I'm not sure I understand. I can help you with:\n\n• Searching for products\n• Checking your orders\n• Payment & shipping info\n• Promotions\n\nTry asking: 'Search [product name]' or 'My orders'",
      quickReplies: [
        isVietnamese ? "Tìm sản phẩm" : "Search Products",
        isVietnamese ? "Trợ giúp" : "Help",
        isVietnamese ? "Xem trang chủ" : "Browse Homepage",
      ],
    };
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    console.log("User sent message:", text);
    const nextId = (messages[messages.length - 1]?.id || 1) + 1;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        id: nextId,
        from: "user",
        text,
        timestamp: new Date(),
      },
    ]);

    setInput("");
    setIsTyping(true);

    try {
      // Simulate typing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Getting bot reply for:", text);
      // Get bot reply
      const reply = await getBotReply(text);
      console.log("Bot reply received:", reply);

      setIsTyping(false);

      // Always add bot reply, even if empty
      if (reply && reply.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId + 1,
            from: "bot",
            text: reply.text,
            quickReplies: reply.quickReplies || [],
            products: reply.products,
            timestamp: new Date(),
          },
        ]);
        console.log("Bot message added to chat");
      } else {
        // Fallback if reply is empty
        console.warn("Empty bot reply, using fallback");
        setMessages((prev) => [
          ...prev,
          {
            id: nextId + 1,
            from: "bot",
            text:
              lang === "en"
                ? "I'm here to help! What would you like to know?"
                : "Mình ở đây để giúp bạn! Bạn muốn biết gì?",
            quickReplies: [
              lang === "en" ? "Help" : "Trợ giúp",
              lang === "en" ? "Search Products" : "Tìm sản phẩm",
            ],
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting bot reply:", error);
      setIsTyping(false);

      // Fallback reply if error occurs
      setMessages((prev) => [
        ...prev,
        {
          id: nextId + 1,
          from: "bot",
          text:
            lang === "en"
              ? "Sorry, I encountered an error. Please try again or contact support at 1900-6035."
              : "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ: 1900-6035.",
          quickReplies: [
            lang === "en" ? "Try Again" : "Thử lại",
            lang === "en" ? "Help" : "Trợ giúp",
          ],
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleQuickReply = (reply: string) => {
    console.log("Quick reply clicked:", reply);
    const quickReplyMap: Record<string, () => void> = {
      "View Products": () => {
        navigate("/");
        setOpen(false);
      },
      "Xem sản phẩm": () => {
        navigate("/");
        setOpen(false);
      },
      "Browse Products": () => {
        navigate("/");
        setOpen(false);
      },
      "My Orders": () => {
        navigate("/orders");
        setOpen(false);
      },
      "Đơn của tôi": () => {
        navigate("/orders");
        setOpen(false);
      },
      "View All Orders": () => {
        navigate("/orders");
        setOpen(false);
      },
      "Xem tất cả đơn": () => {
        navigate("/orders");
        setOpen(false);
      },
      Checkout: () => {
        navigate("/checkout");
        setOpen(false);
      },
      "Thanh toán": () => {
        navigate("/checkout");
        setOpen(false);
      },
      "My Cart": () => {
        navigate("/cart");
        setOpen(false);
      },
      "Giỏ hàng": () => {
        navigate("/cart");
        setOpen(false);
      },
      Login: () => {
        navigate("/login");
        setOpen(false);
      },
      "Đăng nhập": () => {
        navigate("/login");
        setOpen(false);
      },
      "My Account": () => {
        navigate("/profile");
        setOpen(false);
      },
      "Tài khoản": () => {
        navigate("/profile");
        setOpen(false);
      },
      "Flash Sale": () => {
        navigate("/?category=flash-sale");
        setOpen(false);
      },
      "Browse Homepage": () => {
        navigate("/");
        setOpen(false);
      },
      "Xem trang chủ": () => {
        navigate("/");
        setOpen(false);
      },
    };

    if (quickReplyMap[reply]) {
      // Navigation action
      quickReplyMap[reply]();
    } else {
      // Send as message to trigger bot response
      console.log("Sending quick reply as message:", reply);
      setInput(reply);
      // Use setTimeout to ensure state is updated
      setTimeout(() => {
        send();
      }, 100);
    }
  };

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;

  if (enableProvider) return null;

  return (
    <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}>
      {open ? (
        <Paper
          sx={{
            width: 380,
            height: 600,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          {/* Header with Gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(26,148,255,0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 24, color: "white" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, fontSize: "1rem" }}
                >
                  {lang === "en" ? "Shopping Assistant" : "Trợ lý mua sắm"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                >
                  {lang === "en" ? "Online now" : "Đang trực tuyến"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                transition: "all 0.2s",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2.5,
              background:
                "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#E0E0E0",
                borderRadius: "10px",
                "&:hover": {
                  background: "#BDBDBD",
                },
              },
            }}
          >
            {messages.map((m: Message) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  mb: 2.5,
                  gap: 1.5,
                  animation: "fadeIn 0.3s ease-in",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {m.from === "bot" && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background:
                        "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                      boxShadow: "0 2px 8px rgba(26,148,255,0.3)",
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Box sx={{ maxWidth: "78%" }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius:
                        m.from === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      background:
                        m.from === "user"
                          ? "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)"
                          : "white",
                      color: m.from === "user" ? "white" : "text.primary",
                      boxShadow:
                        m.from === "user"
                          ? "0 4px 12px rgba(26,148,255,0.3)"
                          : "0 2px 8px rgba(0,0,0,0.08)",
                      border:
                        m.from === "user"
                          ? "none"
                          : "1px solid rgba(0,0,0,0.05)",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow:
                          m.from === "user"
                            ? "0 6px 16px rgba(26,148,255,0.4)"
                            : "0 4px 12px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                        fontSize: "0.875rem",
                      }}
                    >
                      {m.text}
                    </Typography>
                  </Box>

                  {/* Product Cards */}
                  {m.products && m.products.length > 0 && (
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {m.products.map((product: any) => (
                        <Card
                          key={product.id}
                          sx={{
                            cursor: "pointer",
                            border: "1px solid rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            overflow: "hidden",
                            background: "white",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              transform: "translateY(-2px)",
                              borderColor: "#1A94FF",
                            },
                          }}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setOpen(false);
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 1.5, p: 1.5 }}>
                            {product.imageUrl && (
                              <Box
                                sx={{
                                  width: 70,
                                  height: 70,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  border: "1px solid rgba(0,0,0,0.05)",
                                  background: "#f5f5f5",
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  image={toAbs(product.imageUrl)}
                                  alt={product.name}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            )}
                            <CardContent
                              sx={{
                                flex: 1,
                                p: "0 !important",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 0.5,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  fontSize: "0.875rem",
                                  color: "#333",
                                  lineHeight: 1.4,
                                }}
                              >
                                {lang === "en" && product.nameEn
                                  ? product.nameEn
                                  : product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#FF424E",
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                }}
                              >
                                {new Intl.NumberFormat("vi-VN").format(
                                  product.price || 0
                                )}
                                ₫
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {/* Quick Replies */}
                  {m.quickReplies && m.quickReplies.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                        mt: 1.5,
                      }}
                    >
                      {m.quickReplies.map((reply: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={reply}
                          size="small"
                          onClick={() => handleQuickReply(reply)}
                          sx={{
                            cursor: "pointer",
                            background:
                              "linear-gradient(135deg, rgba(26,148,255,0.1) 0%, rgba(13,122,230,0.1) 100%)",
                            color: "#1A94FF",
                            border: "1px solid rgba(26,148,255,0.2)",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: "28px",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                              color: "white",
                              borderColor: "#1A94FF",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(26,148,255,0.3)",
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                {m.from === "user" && (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background:
                        "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)",
                      boxShadow: "0 2px 8px rgba(255,107,107,0.3)",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 2.5,
                  gap: 1.5,
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background:
                      "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                    boxShadow: "0 2px 8px rgba(26,148,255,0.3)",
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: "18px 18px 18px 4px",
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={14} sx={{ color: "#1A94FF" }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {lang === "en" ? "Typing..." : "Đang nhập..."}
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={
                lang === "en" ? "Type a message..." : "Nhập tin nhắn..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(26,148,255,0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A94FF",
                    borderWidth: "2px",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={send}
              disabled={!input.trim()}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: "50%",
                background: input.trim()
                  ? "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)"
                  : "#E0E0E0",
                boxShadow: input.trim()
                  ? "0 4px 12px rgba(26,148,255,0.3)"
                  : "none",
                "&:hover": {
                  background: input.trim()
                    ? "linear-gradient(135deg, #0D7AE6 0%, #1A94FF 100%)"
                    : "#E0E0E0",
                  boxShadow: input.trim()
                    ? "0 6px 16px rgba(26,148,255,0.4)"
                    : "none",
                  transform: input.trim() ? "scale(1.05)" : "none",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:disabled": {
                  background: "#E0E0E0",
                  color: "#9E9E9E",
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      ) : (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "50%",
            width: 64,
            height: 64,
            minWidth: 64,
            background: "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
            boxShadow: "0 8px 24px rgba(26,148,255,0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #0D7AE6 0%, #1A94FF 100%)",
              boxShadow: "0 12px 32px rgba(26,148,255,0.5)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 8px 24px rgba(26,148,255,0.4)",
              },
              "50%": {
                boxShadow: "0 8px 24px rgba(26,148,255,0.6)",
              },
              "100%": {
                boxShadow: "0 8px 24px rgba(26,148,255,0.4)",
              },
            },
          }}
        >
          <SmartToyIcon sx={{ fontSize: 28 }} />
        </Button>
      )}
    </Box>
  );
};

export default ChatWidget;
