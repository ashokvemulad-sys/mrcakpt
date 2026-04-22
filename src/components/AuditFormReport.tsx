import { GrantRecord } from "@/data/grantsData";
import logoSamagra from "@/assets/logo-samagra.png";
import logoPfms from "@/assets/logo-pfms.png";

interface AuditFormReportProps {
  record: GrantRecord;
}

const toCurrency = (amount: number) => amount.toLocaleString("en-IN");

export const AuditFormReport = ({ record }: AuditFormReportProps) => {
  const nonZeroGrants = record.grants.filter((g) => g.amount > 0);
  const openingCashInHand = 0;
  const openingCashAtBank = 0;
  const totalReceipts = openingCashInHand + openingCashAtBank + record.grandTotal;
  const totalPayments = record.grandTotal;
  const closingBalance = totalReceipts - totalPayments;

  const editableCellClass =
    "p-1 border border-black outline-none focus:bg-accent/30 print:bg-transparent min-h-[26px] font-semibold text-black";
  const valueCellClass = "p-1 border border-black text-right font-semibold";

  return (
    <div
      className="a4-sheet max-w-[210mm] mx-auto bg-white p-[8mm] h-[297mm] print:p-[8mm] print:max-w-none print:h-[297mm] border-2 border-[hsl(25,50%,35%)] flex flex-col overflow-hidden text-[12px] leading-snug"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="border-b border-border pb-2">
        <div className="flex items-center justify-between gap-4">
          <img src={logoSamagra} alt="Samagra Shiksha Logo" className="h-12 object-contain shrink-0" />
          <img src={logoPfms} alt="PFMS Logo" className="h-12 object-contain shrink-0" />
        </div>
        <div className="text-center mt-2 space-y-0.5">
          <p className="font-bold text-sm">TELANGANA SAMAGRA SHIKSHA :: SMC AUDIT</p>
          <p className="font-bold text-[11px]">Receipts and Payments Statement for the period from 01.04.2025 to 31.03.2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-x border-b border-black p-2 text-[11px]">
        <p>
          <span className="text-muted-foreground">SMC:</span> <span className="font-semibold">{record.smcName}</span>
        </p>
        <p>
          <span className="text-muted-foreground">District:</span> <span className="font-semibold">SIDDIPET</span>
        </p>
        <p>
          <span className="text-muted-foreground">Mandal:</span> <span className="font-semibold">AKKANNAPET</span>
        </p>
        <p>
          <span className="text-muted-foreground">U DISE Code:</span> <span className="font-semibold">{record.uDise}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Bank A/No:</span> <span className="font-semibold">{record.smcAcNo || "—"}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Principal / Headmaster Contact No:</span>{" "}
          <span className="font-semibold">{record.mobile || "—"}</span>
        </p>
      </div>

      <table className="w-full border-x border-b border-black border-collapse text-[11px] mt-2">
        <thead>
          <tr className="bg-report-header text-report-header-foreground">
            <th className="p-1 border border-black text-left w-1/2">Receipts</th>
            <th className="p-1 border border-black text-right w-24">Amount (Rs)</th>
            <th className="p-1 border border-black text-left w-1/2">Payments</th>
            <th className="p-1 border border-black text-right w-24">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1 border border-black">Opening Balance - Cash in Hand</td>
            <td className={valueCellClass}>{toCurrency(openingCashInHand)}</td>
            <td className="p-1 border border-black">Payments through PPAs</td>
            <td className={valueCellClass}>{toCurrency(totalPayments)}</td>
          </tr>
          <tr>
            <td className="p-1 border border-black">Opening Balance - Cash at Bank</td>
            <td className={valueCellClass}>{toCurrency(openingCashAtBank)}</td>
            <td className="p-1 border border-black">Bank Charges</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-black">Funds Allocation from DPO</td>
            <td className={valueCellClass}>{toCurrency(record.grandTotal)}</td>
            <td className="p-1 border border-black">Others - Payments (if any)</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-black">Rejected PPAs re-generated</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
            <td className="p-1 border border-black">Hand Loan Repayment to HM / Principal</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-black">Bank Interest</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
            <td className="p-1 border border-black" contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1 border border-black">Other Receipts (if any)</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning>
              0
            </td>
            <td className="p-1 border border-black" contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr className="font-bold bg-report-total">
            <td className="p-1 border border-black text-right">TOTAL</td>
            <td className={valueCellClass}>{toCurrency(totalReceipts)}</td>
            <td className="p-1 border border-black text-right">TOTAL</td>
            <td className={valueCellClass}>{toCurrency(totalPayments)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-2 border border-black p-2">
        <p className="font-bold mb-1">Rejected PPAs re-generated</p>
        <table className="w-full border border-black border-collapse text-[10px]">
          <thead>
            <tr className="bg-report-header text-report-header-foreground">
              <th className="p-1 border border-black w-20">Date</th>
              <th className="p-1 border border-black w-24">PPA No.</th>
              <th className="p-1 border border-black">Intervention</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx}>
                <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 border border-black p-2 text-[11px] space-y-1">
        <p>
          <span className="font-semibold">Closing Balance:</span>{" "}
          <span className="font-bold">{toCurrency(closingBalance)}</span>
        </p>
        <p>
          <span className="font-semibold">Cash in Hand:</span>{" "}
          <span className="font-semibold">{toCurrency(closingBalance)}</span>
        </p>
        <p>
          <span className="font-semibold">Cash at Bank:</span>{" "}
          <span className={editableCellClass} contentEditable suppressContentEditableWarning>
            {toCurrency(closingBalance)}
          </span>
        </p>
      </div>

      <div className="mt-2 border border-black p-2 flex-1 min-h-0">
        <p className="font-bold mb-1">Payments through PPAs (prefilled from credited grants)</p>
        <div className="overflow-hidden">
          <table className="w-full border border-black border-collapse text-[10px]">
            <thead>
              <tr className="bg-report-header text-report-header-foreground">
                <th className="p-1 border border-black w-8">#</th>
                <th className="p-1 border border-black text-left">Grant / Intervention</th>
                <th className="p-1 border border-black w-24">Date</th>
                <th className="p-1 border border-black w-24 text-right">Amount (Rs)</th>
                <th className="p-1 border border-black">Remarks (Editable)</th>
              </tr>
            </thead>
            <tbody>
              {nonZeroGrants.slice(0, 8).map((grant, idx) => (
                <tr key={`${grant.name}-${idx}`}>
                  <td className="p-1 border border-black text-center">{idx + 1}</td>
                  <td className="p-1 border border-black">{grant.name}</td>
                  <td className="p-1 border border-black text-center">{grant.date}</td>
                  <td className="p-1 border border-black text-right">{toCurrency(grant.amount)}</td>
                  <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 8 - nonZeroGrants.length) }).map((_, idx) => (
                <tr key={`blank-${idx}`}>
                  <td className="p-1 border border-black text-center">{nonZeroGrants.length + idx + 1}</td>
                  <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                  <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                  <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                  <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 text-center text-[11px] gap-6">
        <div>
          <div className="border-b border-black h-10"></div>
          <p className="mt-1 font-semibold">For SMC</p>
        </div>
        <div>
          <div className="border-b border-black h-10"></div>
          <p className="mt-1 font-semibold">Principal / Head Master</p>
          <p className="font-semibold">{record.hmName || ""}</p>
        </div>
        <div>
          <div className="border-b border-black h-10"></div>
          <p className="mt-1 font-semibold">Auditor</p>
        </div>
      </div>
    </div>
  );
};
