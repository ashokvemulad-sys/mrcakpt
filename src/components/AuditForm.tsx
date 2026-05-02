import { GrantRecord } from "@/data/grantsData";

interface AuditFormProps {
  record: GrantRecord;
}

export const AuditForm = ({ record }: AuditFormProps) => {
  const nonZeroGrants = record.grants.filter((g) => g.amount > 0);
  const totalReceipts = record.grandTotal;

  // Build receipts rows: opening (cash in hand, cash at bank), then each grant, then bank interest, others
  const RECEIPTS_ROWS = 28; // total rows in receipts column (matches form)
  const PAYMENTS_ROWS = 28;

  type Row = { label: string; amount?: string; bold?: boolean; indent?: boolean; prefix?: string };

  // Receipts: fixed leading rows
  const receiptsFixed: Row[] = [
    { label: "Opening Balance :", bold: true },
    { label: "Cash in Hand", indent: true },
    { label: "Cash at Bank", indent: true },
    { label: "Funds Allocation from DPO (Budget/Funds Allocation amount should be Taken as a Receipts)", bold: true },
  ];

  // Each grant becomes a receipt row
  const receiptsGrants = nonZeroGrants.map((g) => ({
    label: `${g.name} (${g.date})`,
    amount: g.amount.toLocaleString("en-IN"),
  }));

  // Trailing receipts
  const receiptsTrailing: Row[] = [
    { label: "Bank Interest", bold: true },
    { label: "Other Receipts (if any) :", bold: true },
    { label: "Hand Loan from HM / Principal", indent: true },
    { label: "Other Miscellaneous Receipts", bold: true },
  ];

  const receiptsAll: Row[] = [
    ...receiptsFixed,
    ...receiptsGrants.map((r) => ({ label: r.label, amount: r.amount }) as Row),
    ...receiptsTrailing,
  ];
  while (receiptsAll.length < RECEIPTS_ROWS) receiptsAll.push({ label: "" });

  // Payments rows
  const paymentsFixed: Row[] = [
    { label: "Payments through PPAs", bold: true },
  ];
  const paymentsGrants: Row[] = nonZeroGrants.map((g) => ({
    label: `${g.name} (${g.date})`,
    amount: g.amount.toLocaleString("en-IN"),
    prefix: "By",
  }));
  const paymentsTrailing: Row[] = [
    { label: "Bank Charges", bold: true, prefix: "By" },
    { label: "Others - Payments (if any) :", bold: true, prefix: "By" },
    { label: "Hand Loan Repayment to HM / Principal", indent: true },
    { label: "Un-Utilized of SS Funds allocation amount Retrieval to DPO/SPO", bold: true, prefix: "By" },
  ];
  const paymentsAll: Row[] = [...paymentsFixed, ...paymentsGrants, ...paymentsTrailing];
  while (paymentsAll.length < PAYMENTS_ROWS) paymentsAll.push({ label: "" });

  const rows = Math.max(receiptsAll.length, paymentsAll.length);

  return (
    <div
      className="a4-sheet max-w-[210mm] mx-auto bg-white p-[8mm] min-h-[297mm] print:p-[6mm] print:max-w-none border-2 border-black flex flex-col text-[12px] leading-snug text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Title */}
      <h1 className="text-center font-bold text-[15px] underline mb-2">
        TELANGANA SAMAGRA SHIKSHA :: SMC AUDIT
      </h1>

      {/* Header info */}
      <table className="w-full border border-black border-collapse mb-1">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-bold w-[12%]">SMC :</td>
            <td className="border border-black px-2 py-1 w-[38%]">{record.smcName}</td>
            <td className="border border-black px-2 py-1 font-bold w-[12%]">District:</td>
            <td className="border border-black px-2 py-1 font-bold" colSpan={3}>SIDDIPET</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">U DISE Code:</td>
            <td className="border border-black px-2 py-1">{record.uDise}</td>
            <td className="border border-black px-2 py-1 font-bold">Bank A/No:</td>
            <td className="border border-black px-2 py-1 w-[18%]">{record.smcAcNo || ""}</td>
            <td className="border border-black px-2 py-1 font-bold w-[10%]">Branch:</td>
            <td className="border border-black px-2 py-1 w-[10%]">{record.bankName || ""}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">Mandal:</td>
            <td className="border border-black px-2 py-1">AKKANNAPETA</td>
            <td className="border border-black px-2 py-1 font-bold" colSpan={2}>
              Principal / Headmaster Contact No:
            </td>
            <td className="border border-black px-2 py-1" colSpan={2}>{record.mobile || ""}</td>
          </tr>
        </tbody>
      </table>

      {/* Period title */}
      <div className="border border-t-0 border-black text-center font-bold py-1 text-[13px]">
        Receipts and Payments Statement for the period from 01.04.2025 to 31.03.2026
      </div>

      {/* Main R&P table */}
      <table className="w-full border border-black border-collapse">
        <thead>
          <tr className="font-bold text-center">
            <th className="border border-black px-1 py-1 w-[4%]"></th>
            <th className="border border-black px-1 py-1 w-[42%]">Receipts</th>
            <th className="border border-black px-1 py-1 w-[12%]">Amount (Rs)</th>
            <th className="border border-black px-1 py-1 w-[4%]"></th>
            <th className="border border-black px-1 py-1 w-[26%]">Payments</th>
            <th className="border border-black px-1 py-1 w-[12%]">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => {
            const r = receiptsAll[i] || { label: "" };
            const p = paymentsAll[i] || { label: "" };
            const rPrefix = r.label && !r.indent ? "To" : "";
            const pPrefix = (p as any).prefix ?? (p.label && !(p as any).indent ? "By" : "");
            return (
              <tr key={i}>
                <td className="border border-black px-1 py-[3px] text-center align-top">{rPrefix}</td>
                <td className={`border border-black px-1 py-[3px] align-top ${r.bold ? "font-bold" : ""} ${r.indent ? "pl-4" : ""}`}>
                  {r.label}
                </td>
                <td className="border border-black px-1 py-[3px] text-right align-top">
                  {(r as any).amount || ""}
                </td>
                <td className="border border-black px-1 py-[3px] text-center align-top">{pPrefix}</td>
                <td className={`border border-black px-1 py-[3px] align-top ${p.bold ? "font-bold" : ""} ${(p as any).indent ? "pl-4" : ""}`}>
                  {p.label}
                </td>
                <td className="border border-black px-1 py-[3px] text-right align-top">
                  {(p as any).amount || ""}
                </td>
              </tr>
            );
          })}

          {/* Closing balance section */}
          <tr>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px] text-center font-bold">By</td>
            <td className="border border-black px-1 py-[3px] font-bold underline">Closing Balance :</td>
            <td className="border border-black px-1 py-[3px]"></td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px] pl-4">Cash in Hand</td>
            <td className="border border-black px-1 py-[3px]"></td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px]"></td>
            <td className="border border-black px-1 py-[3px] pl-4">Cash at Bank</td>
            <td className="border border-black px-1 py-[3px]"></td>
          </tr>

          {/* Total row */}
          <tr className="font-bold">
            <td className="border border-black px-1 py-1"></td>
            <td className="border border-black px-1 py-1 text-center">TOTAL</td>
            <td className="border border-black px-1 py-1 text-right">
              ₹{totalReceipts.toLocaleString("en-IN")}
            </td>
            <td className="border border-black px-1 py-1"></td>
            <td className="border border-black px-1 py-1 text-center">TOTAL</td>
            <td className="border border-black px-1 py-1 text-right">
              ₹{totalReceipts.toLocaleString("en-IN")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <div className="mt-auto pt-8 flex justify-between text-[12px]">
        <div className="text-left">
          <p className="font-bold">Auditor</p>
        </div>
        <div className="text-right">
          <p>For SMC,</p>
          <div className="h-10" />
          <p className="font-bold">Principal/Head Master</p>
          <p className="font-semibold">{record.hmName || ""}</p>
        </div>
      </div>
    </div>
  );
};
