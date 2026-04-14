import { useState } from "react";
import { GrantRecord } from "@/data/grantsData";

interface GrantReportProps {
  record: GrantRecord;
}

export const GrantReport = ({ record }: GrantReportProps) => {
  const nonZeroGrants = record.grants.filter((g) => g.amount > 0);
  const [utilized, setUtilized] = useState<Record<number, number>>({});

  const handleUtilizedChange = (idx: number, value: string) => {
    const num = parseFloat(value) || 0;
    setUtilized((prev) => ({ ...prev, [idx]: num }));
  };

  const getBalance = (idx: number, amount: number) => {
    return amount - (utilized[idx] || 0);
  };

  const totalUtilized = nonZeroGrants.reduce((sum, _, idx) => sum + (utilized[idx] || 0), 0);
  const totalBalance = record.grandTotal - totalUtilized;

  return (
    <div className="max-w-[210mm] mx-auto bg-[hsl(40,40%,97%)] p-[12mm] min-h-[297mm] print:p-0 print:max-w-none border-2 border-[hsl(25,50%,35%)]">
      {/* Header */}
      <div className="rounded-t-lg p-5 flex items-center justify-center gap-4 print:rounded-none border-b border-border">
        <img src="https://www.samagrashiksha.telangana.gov.in/SamagraShiksha/images/logo.png" alt="Samagra Shiksha Logo" className="h-14 w-14 object-contain" />
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-wide text-foreground underline">UTILIZATION CERTIFICATE 2025-26</h1>
        </div>
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
          <span className="text-muted-foreground">Name of the Bank:</span>
          <p className="font-semibold text-foreground">—</p>
        </div>
        <div>
          <span className="text-muted-foreground">SMC A/C No:</span>
          <p className="font-semibold text-foreground">—</p>
        </div>
        <div>
          <span className="text-muted-foreground">Bank IFSC:</span>
          <p className="font-semibold text-foreground">—</p>
        </div>
        <div>
          <span className="text-muted-foreground">Financial Year:</span>
          <p className="font-semibold text-foreground">2025-26</p>
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
            <th className="p-2 text-right font-semibold border border-report-header w-28">Credited (₹)</th>
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
                <td className="p-1 border border-border text-right">
                  <input
                    type="number"
                    min={0}
                    max={grant.amount}
                    value={utilized[idx] || ""}
                    onChange={(e) => handleUtilizedChange(idx, e.target.value)}
                    className="w-full text-right bg-transparent border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
                    placeholder="0"
                  />
                </td>
                <td className="p-2 border border-border text-right font-medium">
                  {getBalance(idx, grant.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-6 text-center text-muted-foreground border border-border">
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
              <td className="p-2 border border-border text-right">
                ₹{totalUtilized.toLocaleString("en-IN")}
              </td>
              <td className="p-2 border border-border text-right">
                ₹{totalBalance.toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Certification Text */}
      <div className="mt-6 p-4 border border-border rounded text-sm text-foreground leading-relaxed text-justify">
        This is to Certify that, the above-mentioned funds (budget) are received and utilized as per the guidelines issued by the Director of School Education and Ex-Officio State Project Director, T-Samagra Shiksha, Hyderabad and the original bills are kept at SDU i.e., MRC / CRC / School / TSMS / KGBV / GH level and will be submit (facilitate) the same as required in future audit purpose i.e., Internal Audit, Statutory Audit and A.G. Team etc during the Audit.
      </div>

      {/* Enclosures & Signature */}
      <div className="mt-6 flex justify-between items-start">
        <div className="text-xs text-foreground">
          <p className="font-bold mb-1">Enclosures:</p>
          <p>1. Bank Statement (01.04.2025 to 31.03.2026)</p>
          <p>2. SMC Resolution Register Xerox Copies</p>
          <p>3. Print Payment Advice (PPA) Xerox Copies</p>
          <p>4. Bills &amp; Vouchers Xerox Copies</p>
        </div>
        <div className="text-xs text-foreground text-right">
          <div className="border-b border-foreground w-48 mb-1 mt-8"></div>
          <p className="font-bold">Signature of Headmaster</p>
          <p className="mt-1">{record.smcName}</p>
          <p>U-DISE: {record.uDise}</p>
        </div>
      </div>

      {/* Counter Signature */}
      <div className="mt-12 text-center text-xs text-foreground">
        <div className="border-b border-foreground w-56 mx-auto mb-1"></div>
        <p className="font-bold">Counter Signed by Mandal Educational Officer</p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground flex justify-between print:mt-auto">
        <span>Generated on: {new Date().toLocaleDateString("en-IN")}</span>
        <span>School Grants Management System</span>
      </div>
    </div>
  );
};
