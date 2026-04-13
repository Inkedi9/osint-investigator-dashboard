export default function Card({ children, className = "" }) {
    return (
        <div
            className={`panel rounded-2xl p-5 transition duration-200 hover:border-accent/20 hover:shadow-glow ${className}`}
        >
            {children}
        </div>
    );
}