
interface StatCardProps {
    title: string;
    value: string;
    change: string;
    positive?: boolean;
}

export default function StatCard({ title, value, change, positive }: StatCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-banan-beige shadow-sm flex flex-col justify-between">
            <h4 className="text-banan-olive/70 text-sm mb-2 font-bold">{title}</h4>
            <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-banan-olive">{value}</span>
                {change !== "0%" && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}