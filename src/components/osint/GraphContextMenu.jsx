import { Eye, Plus, Expand, X } from "lucide-react";

export default function GraphContextMenu({
    x,
    y,
    node,
    onClose,
    onExpand,
    onAddToCase,
    onOpenEntity,
}) {
    if (!node) return null;

    return (
        <div
            className="fixed z-[9998] w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-md"
            style={{ top: y, left: x }}
        >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                        Entity Actions
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                        {node.data?.labelText || node.data?.label || node.id}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="text-slate-400 transition hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="p-2">
                <button
                    onClick={() => {
                        onOpenEntity(node);
                        onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900"
                >
                    <Eye className="h-4 w-4 text-amber-300" />
                    <span>Open entity</span>
                </button>

                <button
                    onClick={() => {
                        onAddToCase(node);
                        onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900"
                >
                    <Plus className="h-4 w-4 text-purple-300" />
                    <span>Add to investigation</span>
                </button>

                <button
                    onClick={() => {
                        onExpand(node);
                        onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900"
                >
                    <Expand className="h-4 w-4 text-cyan-300" />
                    <span>Expand node</span>
                </button>
            </div>
        </div>
    );
}