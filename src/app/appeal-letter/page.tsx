import AppealsTable from "../components/appeals/AppealsTable";

export default function AppealLetterPage() {
  return (
    <div className="space-y-2 h-full">
      <h1 className="page-heading">Appeal Letter</h1>
      <div className="page-content">
        <AppealsTable />
      </div>
    </div>
  );
}
