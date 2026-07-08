import { useEffect } from "react";
import { useToastStore } from "../../stores/toastStore";
import "./Toast.css";

function Toast() {
  const isOpen = useToastStore((state) => state.isOpen);
  const message = useToastStore((state) => state.message);
  const hideToast = useToastStore((state) => state.hideToast);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      hideToast();
    }, 7000);

    return () => clearTimeout(timer);
  }, [isOpen, message, hideToast]);

  if (!isOpen) {
    return null;
  }

  return <div className="toast">{message}</div>;
}

export default Toast;
