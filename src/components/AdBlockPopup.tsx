import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";

const AdBlockPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ad-popup-dismissed");
    if (!dismissed) setShow(true);
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem("ad-popup-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={close} />
      <div className="relative glass-nav rounded-2xl p-6 sm:p-8 max-w-md w-full animate-scale-in">
        <button onClick={close} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-secondary">
            <Shield className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Heads Up!</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          It is recommended to use an <span className="text-foreground font-medium">AD Blocker</span> or{" "}
          <span className="text-foreground font-medium">Brave Browser</span>. You might see ads while streaming your favorite movie. 
          Those ads come from the API's server side and not from us. Enjoy your streaming!
        </p>
        <button onClick={close} className="btn-glow w-full justify-center">
          Got it, Close
        </button>
      </div>
    </div>
  );
};

export default AdBlockPopup;
