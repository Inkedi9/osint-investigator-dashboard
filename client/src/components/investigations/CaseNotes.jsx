import { useState } from "react";

export default function CaseNotes({ notes, onAddNote }) {
    const [noteText, setNoteText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!noteText.trim()) return;

        onAddNote(noteText);
        setNoteText("");
    };

    return (
        <div className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Case Notes</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write an analyst note..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent transition hover:bg-accent/20"
                    >
                        Add Note
                    </button>
                </div>
            </form>

            <div className="mt-6 space-y-4">
                {notes.length > 0 ? (
                    [...notes].reverse().map((note) => (
                        <div
                            key={note.id}
                            className="rounded-xl border border-border bg-surfaceLight p-4"
                        >
                            <p className="text-sm text-slate-200">{note.content}</p>
                            <p className="mt-2 text-xs text-muted">{note.createdAt}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted">No analyst notes added yet.</p>
                )}
            </div>
        </div>
    );
}