import Card from "../common/Card";

export default function RiskScoreCard({ score }) {
    let color = "text-success";
    let label = "Low";

    if (score >= 80) {
        color = "text-danger";
        label = "Critical";
    } else if (score >= 60) {
        color = "text-warning";
        label = "High";
    } else if (score >= 40) {
        color = "text-accent";
        label = "Medium";
    }

    return (
        <Card>
            <p className="text-sm text-muted">Risk Score</p>
            <div className="mt-3 flex items-end justify-between">
                <h2 className={`text-5xl font-bold ${color}`}>{score}</h2>
                <span className={`text-sm font-medium ${color}`}>{label}</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surfaceLight">
                <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${Math.min(score, 100)}%` }}
                />
            </div>
        </Card>
    );
}