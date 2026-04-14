import { GrantRecord } from "@/data/grantsData";

interface GrantReportProps {
  record: GrantRecord;
}

export const GrantReport = ({ record }: GrantReportProps) => {
  const nonZeroGrants = record.grants.filter((g) => g.amount > 0);

  return (
    <div className="max-w-[210mm] mx-auto bg-card p-[12mm] min-h-[297mm] print:p-0 print:max-w-none">
      {/* Header */}
      <div className="bg-report-header text-report-header-foreground rounded-t-lg p-5 text-center print:rounded-none">
        <h1 className="text-xl font-bold tracking-wide">SCHOOL GRANTS STATEMENT</h1>
        <p className="text-sm mt-1 opacity-90">Mandal: AKKANNAPETA | Financial Year 2025-26</p>
      </div>

      {/* School Info */}
      <div className="border border-t-0 border-border p-4 grid grid-cols-2 gap-y-3 text-sm">
        <div>
          <span className="text-muted-foreground">School Name:</span>
          <p className="font-semibold text-foreground">{record.smcName}</p>
        </div>
        <div>
          <span className="text-muted-foreground">PFMS Code:</span>
          <p className="font-semibold text-foreground">{record.pfmsCode}</p>
        </div>
        <div>
          <span className="text-muted-foreground">U-DISE Code:</span>
          <p className="font-semibold text-foreground">{record.uDise}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Total Grants:</span>
          <p className="font-semibold text-primary">₹{record.grandTotal.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Grants Table */}
      <table className="w-full border-collapse text-sm mt-4">
        <thead>
          <tr className="bg-report-header text-report-header-foreground">
            <th className="p-2 text-left font-semibold border border-report-header w-10">S.No</th>
            <th className="p-2 text-left font-semibold border border-report-header">Grant Name</th>
            <th className="p-2 text-center font-semibold border border-report-header w-28">Credited Date</th>
            <th className="p-2 text-right font-semibold border border-report-header w-28">Amount (₹)</th>
            <th className="p-2 text-right font-semibold border border-report-header w-28">Utilized (₹)</th>
            <th className="p-2 text-right font-semibold border border-report-header w-28">Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {nonZeroGrants.length > 0 ? (
            nonZeroGrants.map((grant, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-card" : "bg-report-stripe"}
              >
                <td className="p-2 border border-border text-center">{idx + 1}</td>
                <td className="p-2 border border-border">{grant.name}</td>
                <td className="p-2 border border-border text-center">{grant.date}</td>
                <td className="p-2 border border-border text-right font-medium">
                  {grant.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-6 text-center text-muted-foreground border border-border">
                No grants credited for this school
              </td>
            </tr>
          )}
        </tbody>
        {nonZeroGrants.length > 0 && (
          <tfoot>
            <tr className="bg-report-total font-bold">
              <td colSpan={3} className="p-2 border border-border text-right">
                Grand Total
              </td>
              <td className="p-2 border border-border text-right text-primary">
                ₹{record.grandTotal.toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        )}
      </table>


      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground flex justify-between print:mt-auto">
        <span>Generated on: {new Date().toLocaleDateString("en-IN")}</span>
        <span>School Grants Management System</span>
      </div>
    </div>
  );
};
