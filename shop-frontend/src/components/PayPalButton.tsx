import { useEffect, useRef, useState } from "react";

type Props = {
  amountVND: number;
  clientId?: string;
  onSuccess: () => void;
};

const PayPalButton: React.FC<Props> = ({ amountVND, clientId, onSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const exist = document.querySelector<HTMLScriptElement>("script[data-paypal-sdk]");
    if (exist) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=CAPTURE`;
    script.async = true;
    script.setAttribute("data-paypal-sdk", "true");
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!loaded || !clientId) return;
    const anyWin: any = window as any;
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    const usd = Math.max(1, Math.round((Number(amountVND || 0) / rate) * 100) / 100);
    if (anyWin.paypal && containerRef.current) {
      containerRef.current.innerHTML = "";
      anyWin.paypal
        .Buttons({
          style: { layout: "horizontal", color: "blue", shape: "rect", label: "paypal" },
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { currency_code: "USD", value: usd.toFixed(2) },
                },
              ],
            });
          },
          onApprove: async (_: any, actions: any) => {
            try {
              await actions.order.capture();
              onSuccess();
            } catch (e) {
              console.error(e);
              alert("Thanh toán PayPal thất bại");
            }
          },
          onError: (err: any) => {
            console.error(err);
            alert("Có lỗi với PayPal");
          },
        })
        .render(containerRef.current);
    }
  }, [loaded, clientId, amountVND, onSuccess]);

  if (!clientId) return null;
  return <div ref={containerRef} />;
};

export default PayPalButton;
