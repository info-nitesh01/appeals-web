"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button, Input } from "@heroui/react";
import { FiMenu } from "react-icons/fi";
import { sidebarItems } from "@/data/sidebar/sidebarData";
import { FaChevronLeft } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa6";
import { NotificationBell } from "@/data/sidebar/svgs";
import { LuSearch } from "react-icons/lu";
import UserProfileDD from "./UserProfileDD";
import { AiFillSetting } from "react-icons/ai";
import { GrPower } from "react-icons/gr";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex bg-background text-foreground">
      <div className="main-header flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3 w-full">
          <Button aria-label="Toggle sidebar" isIconOnly variant="flat" size="sm" className="lg:hidden" onPress={() => setIsSidebarOpen((v) => !v)}>
            <FiMenu size={18} />
          </Button>
          <div className="flex items-center justify-between gap-2 w-100">
            <Image src="/logo.png" alt="Logo" width={150} height={30} priority />
          </div>
        </div>
        <div className="flex items-center justify-end w-full hidden md:flex">
          <Input variant="bordered" className="input shadow-none me-5" placeholder="Search" startContent={<LuSearch className="text-default-400 pointer-events-none shrink-0" />} type="text" />
          <UserProfileDD />
          <div className="h-6 border-l border-gray-300 mx-3" />
          <NotificationBell />
          <div className="h-6 border-l border-gray-300 mx-3" />
          <TbGridDots size={35} />
        </div>
      </div>

      {isSidebarOpen && <button className="fixed inset-0 z-20 bg-black/40 lg:hidden" aria-label="Close sidebar overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? "" : "closed"} ${isCollapsed ? "collapsed" : "expanded"}`}>
        <nav className="space-y-1 flex flex-col">
          <Button className="sidebar-collapse-btn hidden lg:block" aria-label="Collapse sidebar" isIconOnly variant="flat" size="sm" onPress={() => setIsCollapsed((v) => !v)}>
            {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
          </Button>
          {sidebarItems.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={"sidebar-link" + (pathname === href ? " active" : "")} onClick={() => setIsSidebarOpen(false)}>
              <Icon size={18} />
              <span className={isCollapsed ? "hidden lg:hidden" : ""}>{label}</span>
            </Link>
          ))}
          <div className="mt-auto">
            <Link href="/settings" className={"sidebar-link" + (pathname === "/settings" ? " active" : "")}>
              <AiFillSetting size={20} />
              Setting
              </Link>
            <Button className="w-full py-6 mt-4" color="primary">
              <GrPower size={20} />
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      <div className={"flex-1 flex flex-col main-content"} suppressHydrationWarning={true}>
        <main>{children}</main>
      </div>
    </div>
  );
}
