import { useEffect } from "react";

type Props = {
  publicKey: string;
  priceId: string;
};

const StripeButton: React.FC<Props> = ({ publicKey, priceId }) => {
  useEffect(() => {
    const exist = document.querySelector<HTMLScriptElement>("script[data-stripe-sdk]");
    if (exist) return;
    const s = document.createElement("script");
    s.src = "https://js.stripe.com/v3";
    s.async = true;
    s.setAttribute("data-stripe-sdk", "true");
    document.body.appendChild(s);
  }, []);

  const handleClick = async () => {
    const anyWin: any = window as any;
    if (!anyWin.Stripe) {
      alert("Stripe chưa sẵn sàng");
      return;
    }
    const stripe = anyWin.Stripe(publicKey);
    await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      successUrl: `${window.location.origin}/checkout?stripe=success`,
      cancelUrl: `${window.location.origin}/checkout`,
    });
  };

  return (
    <button onClick={handleClick} style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}>
      Thanh toán bằng Stripe (Sandbox)
    </button>
  );
};

export default StripeButton;
