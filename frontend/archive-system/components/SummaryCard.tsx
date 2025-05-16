"use client";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  icon: string;
}

export default function SummaryCard({ title, subtitle, icon }: SummaryCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-full">
      <div className="text-4xl mb-2">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}