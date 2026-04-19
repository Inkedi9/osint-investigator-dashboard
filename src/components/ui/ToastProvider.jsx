import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

function ToastIcon({ type }) {
    if (type === "success") {
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    }

    if (type === "error") {
        return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
    }

    return <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const pushToast = useCallback(
        ({ title, message, type = "info", duration = 3000 }) => {
            const id =
                typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`;

            setToasts((prev) => [
                ...prev,
                {
                    id,
                    title,
                    message,
                    type,
                },
            ]);

            window.setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast]
    );

    const value = useMemo(() => ({ pushToast }), [pushToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto min-w-[300px] max-w-[380px] rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-black/40"
                    >
                        <div className="flex items-start gap-3">
                            <ToastIcon type={toast.type} />

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white">
                                    {toast.title}
                                </p>

                                {toast.message ? (
                                    <p className="mt-1 text-xs text-slate-300">
                                        {toast.message}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}