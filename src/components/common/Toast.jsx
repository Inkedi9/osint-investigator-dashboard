export default function Toast({ message, isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fadeIn rounded-2xl border border-accent/30 bg-surface px-5 py-4 shadow-glow">
            <p className="text-sm font-medium text-text">{message}</p>
        </div>
    );
}