import { IconType } from "react-icons";

export type SidebarItem = {
	label: string;
	href: string;
	Icon: IconType;
};

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "event" | "reminder";
  allDay?: boolean;
}