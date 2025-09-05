import EventCalendar from "../components/summary/EventCalendar";

export default function SummaryPage() {
  return (
    <div className="space-y-2 h-full">
      <h1 className="page-heading">Summary</h1>
      <div className="page-content">
        <EventCalendar />
      </div>
    </div>
  );
}
