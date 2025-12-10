import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    const tawkUrl = process.env.REACT_APP_TAWK_URL;
    const tawkProp = process.env.REACT_APP_TAWK_PROPERTY_ID;
    const tawkWidget = process.env.REACT_APP_TAWK_WIDGET_ID;
    const chatwootUrl = process.env.REACT_APP_CHATWOOT_URL;
    const chatwootToken = process.env.REACT_APP_CHATWOOT_TOKEN;

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
  }, []);

  return null;
};

export default ChatWidget;
