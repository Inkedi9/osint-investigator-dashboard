const variants = {
    open: "bg-accent/10 text-accent border-accent/30",
    review: "bg-warning/10 text-warning border-warning/30",
    closed: "bg-success/10 text-success border-success/30",
    high: "bg-danger/10 text-danger border-danger/30",
    medium: "bg-warning/10 text-warning border-warning/30",
    low: "bg-success/10 text-success border-success/30",
    default: "bg-surfaceLight text-text border-border",
};

export default function Badge({ children, type = "default" }) {
    const classes = variants[type] || variants.default;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
        >
            {children}
        </span>
    );
}