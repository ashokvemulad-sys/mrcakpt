import { useState } from "react";
import { GrantRecord } from "@/data/grantsData";
import logoSamagra from "@/assets/logo-samagra.png";
import logoPfms from "@/assets/logo-pfms.png";

interface GrantReportProps {
  record: GrantRecord;
}

export const GrantReport = ({ record }: GrantReportProps) => {
  const nonZeroGrants = record.grants.filter((g) => g.amount > 0);
  // Pre-fill utilized with credited amounts
  const [utilized, setUtilized] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    nonZeroGrants.forEach((g, idx) => {
      initial[idx] = g.amount;
    });
    return initial;
  });
  const [extraRow, setExtraRow] = useState({
    name: "",
    date: "",
    credited: 0,
    utilized: 0,
  });

  const handleUtilizedChange = (idx: number, value: string) => {
    const num = parseFloat(value) || 0;
    setUtilized((prev) => ({ ...prev, [idx]: num }));
  };

  const getBalance = (idx: number, amount: number) => {
    return amount - (utilized[idx] || 0);
  };

  const totalUtilized = nonZeroGrants.reduce((sum, _, idx) => sum + (utilized[idx] || 0), 0);
  const totalCredited = record.grandTotal + extraRow.credited;
  const totalUtilizedWithExtra = totalUtilized + extraRow.utilized;
  const totalBalance = totalCredited - totalUtilizedWithExtra;

  return (
    <div className="a4-sheet max-w-[210mm] mx-auto bg-white p-[8mm] h-[297mm] print:p-[8mm] print:max-w-none print:h-[297mm] border-2 border-[hsl(25,50%,35%)] flex flex-col overflow-hidden text-[13px] leading-snug" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <img src={logoSamagra} alt="Samagra Shiksha Logo" className="h-14 object-contain shrink-0" />
          <img src={logoPfms} alt="PFMS Logo" className="h-14 object-contain shrink-0" />
        </div>
        <div className="text-center mt-1">
          <h1 className="text-lg font-bold tracking-wide text-foreground underline">UTILIZATION CERTIFICATE 2025-26</h1>
        </div>
      </div>

      {/* School Info */}
      <div className="border border-t-0 border-border p-2 grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs">
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
          <p className="font-semibold text-foreground">{record.bankName || "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">SMC A/C No:</span>
          <p className="font-semibold text-foreground">{record.smcAcNo || "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Bank IFSC:</span>
          <p className="font-semibold text-foreground">{record.bankIfsc || "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Financial Year:</span>
          <p className="font-semibold text-foreground">{record.financialYear}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Total Grants:</span>
          <p className="font-semibold text-primary">₹{record.grandTotal.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Grants Table */}
      <table className="w-full border border-black border-collapse text-xs mt-1.5 table-fixed">
        <thead>
          <tr className="bg-report-header text-report-header-foreground">
            <th className="p-1 text-left font-bold text-black border border-black w-[8%]">S.No</th>
            <th className="p-1 text-left font-bold text-black border border-black w-[37%]">Grant Name</th>
            <th className="p-1 text-center font-bold text-black border border-black w-[15%]">Credited Date</th>
            <th className="p-1 text-right font-bold text-black border border-black w-[14%]">Credited (₹)</th>
            <th className="p-1 text-right font-bold text-black border border-black w-[13%]">Utilized (₹)</th>
            <th className="p-1 text-right font-bold text-black border border-black w-[13%]">Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {nonZeroGrants.length > 0 ? (
            nonZeroGrants.map((grant, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-card" : "bg-report-stripe"}>
                <td className="p-1 border border-black text-center">{idx + 1}</td>
                <td className="p-1 border border-black">{grant.name}</td>
                <td className="p-1 border border-black text-center">{grant.date}</td>
                <td className="p-1 border border-black text-right font-medium">
                  {grant.amount.toLocaleString("en-IN")}
                </td>
                <td className="p-1 border border-black text-right">
                  <input
                    type="number"
                    min={0}
                    max={grant.amount}
                    value={utilized[idx] ?? ""}
                    onChange={(e) => handleUtilizedChange(idx, e.target.value)}
                    className="w-full text-right bg-transparent border border-black rounded px-1 py-0.5 text-xs font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
                  />
                </td>
                <td className="p-1 border border-black text-right font-medium">
                  {getBalance(idx, grant.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-muted-foreground border border-black">
                No grants credited for this school
              </td>
            </tr>
          )}
          <tr className={nonZeroGrants.length % 2 === 0 ? "bg-card" : "bg-report-stripe"}>
            <td className="p-1 border border-black text-center">{nonZeroGrants.length + 1}</td>
            <td className="p-1 border border-black">
              <input
                type="text"
                placeholder="Additional entry"
                value={extraRow.name}
                onChange={(e) => setExtraRow((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border border-black rounded px-1 py-0.5 text-[11px] font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
              />
            </td>
            <td className="p-1 border border-black text-center">
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={extraRow.date}
                onChange={(e) => setExtraRow((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full text-center bg-transparent border border-black rounded px-1 py-0.5 text-[11px] font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
              />
            </td>
            <td className="p-1 border border-black text-right">
              <input
                type="number"
                min={0}
                value={extraRow.credited || ""}
                onChange={(e) =>
                  setExtraRow((prev) => ({ ...prev, credited: parseFloat(e.target.value) || 0 }))
                }
                className="w-full text-right bg-transparent border border-black rounded px-1 py-0.5 text-[11px] font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
              />
            </td>
            <td className="p-1 border border-black text-right">
              <input
                type="number"
                min={0}
                max={extraRow.credited}
                value={extraRow.utilized || ""}
                onChange={(e) =>
                  setExtraRow((prev) => ({ ...prev, utilized: parseFloat(e.target.value) || 0 }))
                }
                className="w-full text-right bg-transparent border border-black rounded px-1 py-0.5 text-[11px] font-bold text-black focus:outline-none focus:ring-1 focus:ring-primary print:border-none print:ring-0"
              />
            </td>
            <td className="p-1 border border-black text-right font-medium">
              {(extraRow.credited - extraRow.utilized).toLocaleString("en-IN")}
            </td>
          </tr>
        </tbody>
        {nonZeroGrants.length > 0 && (
          <tfoot>
            <tr className="bg-report-total font-bold">
              <td colSpan={3} className="p-1.5 border border-black text-right">Grand Total</td>
              <td className="p-1.5 border border-black text-right text-primary">
                ₹{totalCredited.toLocaleString("en-IN")}
              </td>
              <td className="p-1.5 border border-black text-right">
                ₹{totalUtilizedWithExtra.toLocaleString("en-IN")}
              </td>
              <td className="p-1.5 border border-black text-right">
                ₹{totalBalance.toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Certification Text */}
      <div className="mt-3 p-2 border border-border rounded text-sm text-foreground leading-relaxed text-justify">
        This is to Certify that, the above-mentioned funds (budget) are received and utilized as per the guidelines issued by the Director of School Education and Ex-Officio State Project Director, T-Samagra Shiksha, Hyderabad and the original bills are kept at SDU i.e., MRC / CRC / School / TSMS / KGBV / GH level and will be submit (facilitate) the same as required in future audit purpose i.e., Internal Audit, Statutory Audit and A.G. Team etc during the Audit.
      </div>

      {/* Enclosures & Signature */}
      <div className="mt-3 flex justify-between items-start">
        <div className="text-[12px] text-foreground">
          <p className="font-bold mb-1">Enclosures:</p>
          <p>1. Bank Statement (01.04.2025 to 31.03.2026)</p>
          <p>2. SMC Resolution Register Xerox Copies</p>
          <p>3. Print Payment Advice (PPA) Xerox Copies</p>
          <p>4. Bills &amp; Vouchers Xerox Copies</p>
        </div>
        <div className="text-[12px] text-foreground text-right">
          <div className="border-b border-foreground w-44 mb-1 mt-6"></div>
          <p className="font-bold">Signature of Headmaster</p>
          <p className="font-semibold mt-0.5">{record.hmName || ""}</p>
          <p className="mt-0.5">{record.smcName}</p>
          <p>U-DISE: {record.uDise}</p>
          <p className="mt-0.5">
            <span className="text-muted-foreground">Mobile: </span>
            <span className="font-semibold">{record.mobile || "—"}</span>
          </p>
        </div>
      </div>

      {/* Counter Signature */}
      <div className="mt-auto pt-4 text-center text-[12px] text-foreground">
        <div className="border-b border-foreground w-48 mx-auto mb-1"></div>
        <p className="font-bold">Counter Signed by Mandal Educational Officer</p>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground flex justify-between">
        <span>Generated on: {new Date().toLocaleDateString("en-IN")}</span>
        <span>School Grants Management System</span>
      </div>
    </div>
  );
};
