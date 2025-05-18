"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiUsers, FiSettings, FiHelpCircle, FiCloud } from "react-icons/fi";
import Image from "next/image";

const menu = [
  { label: "Home", icon: <FiHome />, href: "/dashboard" },
  { label: "Users", icon: <FiUsers />, href: "/users" },
  { label: "Settings", icon: <FiSettings />, href: "/settings" },
  { label: "Help & Support", icon: <FiHelpCircle />, href: "/help" },
  { label: "Cloud Server (2 TB)", icon: <FiCloud />, href: "/cloud" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4 flex flex-col justify-between">
      <div>
        <div className="mb-10 flex items-center space-x-2">
        <img
          src="/towfig.png"
          alt="Towfiq Logistics"
          className="h-15 mb-5"
        />
        </div>

        <nav className="space-y-4">
          {menu.map(({ label, icon, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium hover:bg-violet-100 ${
                pathname === href ? "bg-violet-600 text-white" : "text-gray-700"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 flex items-center space-x-2">
        <Image src="/avatar.jpg" alt="User 1" width={28} height={28} className="rounded-full" />
        <Image src="/avatar.jpg" alt="User 2" width={28} height={28} className="rounded-full" />
        <Image src="/avatar.jpg" alt="User 3" width={28} height={28} className="rounded-full" />
        <span className="text-sm text-gray-500 font-medium ml-2">+8</span>
      </div>
    </aside>
  );
}