import type { SidebarItem } from "@/types";
import { AccountsIcon, AppealsIcon, AssessmentIcon, BatchesIcon, DashboardIcon, ResolutionIcon, SummaryIcon } from "./svgs";


export const sidebarItems: SidebarItem[] = [
	{ label: "Dashboard", href: "/", Icon: DashboardIcon },
	{ label: "Accounts", href: "/accounts", Icon: AccountsIcon },
	{ label: "Batches", href: "/batches", Icon: BatchesIcon },
	{ label: "Resolution", href: "/resolution", Icon: ResolutionIcon },
	{ label: "Assessments", href: "/assessments", Icon: AssessmentIcon },
	{ label: "Appeal Letter", href: "/appeal-letter", Icon: AppealsIcon },
	{ label: "Summary", href: "/summary", Icon: SummaryIcon },
];


