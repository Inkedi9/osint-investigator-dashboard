import { useState } from "react";

export default function CaseComments({ comments = [], onAdd }) {
    const [text, setText] = useState("");

    const handleAdd = () => {
        if (!text.trim()) return;

        onAdd({
            id: Date.now().toString(),
            author: "You",
            content: text,
            createdAt: new Date().toLocaleString(),
        });

        setText("");
    };

    return (
        <div className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Comments</h3>

            <div className="mt-4 space-y-3">
                {comments.map((c) => (
                    <div key={c.id} className="rounded-xl bg-surfaceLight p-3">
                        <p className="text-sm text-text">{c.content}</p>
                        <p className="text-xs text-muted mt-1">
                            {c.author} • {c.createdAt}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add comment..."
                    className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-text"
                />

                <button
                    onClick={handleAdd}
                    className="rounded-xl bg-accent px-4 text-black"
                >
                    Add
                </button>
            </div>
        </div>
    );
}