import { GrantRecord, Grant } from "@/data/grantsData";
import logoSamagra from "@/assets/logo-samagra.png";
import logoPfms from "@/assets/logo-pfms.png";

interface GrantVoucherProps {
  record: GrantRecord;
  grant: Grant;
  serialNo?: number;
}

// Convert number to Indian English words (paise ignored)
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    return "";
  };
  let n = Math.floor(num);
  let result = "";
  const crore = Math.floor(n / 10000000);
  n = n % 10000000;
  const lakh = Math.floor(n / 100000);
  n = n % 100000;
  const thousand = Math.floor(n / 1000);
  n = n % 1000;
  if (crore) result += inWords(crore) + " Crore ";
  if (lakh) result += inWords(lakh) + " Lakh ";
  if (thousand) result += inWords(thousand) + " Thousand ";
  if (n) result += inWords(n);
  return result.trim();
};

export const GrantVoucher = ({ record, grant, serialNo = 1 }: GrantVoucherProps) => {
  const amountWords = numberToWords(grant.amount) + " Only";
  const editableCellClass =
    "p-1.5 border border-black outline-none focus:bg-accent/30 print:bg-transparent min-h-[28px] font-bold text-black";

  return (
    <div className="voucher-page max-w-[210mm] mx-auto bg-white p-[8mm] min-h-[297mm] print:p-[8mm] print:max-w-none print:min-h-[297mm] border-2 border-voucher-header flex flex-col text-[13px] leading-snug text-foreground" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div className="border-b border-border pb-2">
        <div className="flex items-center justify-between gap-4">
          <img src={logoSamagra} alt="Samagra Shiksha Logo" className="h-14 object-contain shrink-0" />
          <img src={logoPfms} alt="PFMS Logo" className="h-14 object-contain shrink-0" />
        </div>
        <div className="text-center mt-2">
          <h1 className="text-xl font-extrabold underline tracking-wider uppercase">UTILIZATION CERTIFICATE</h1>
          <p className="text-xs mt-0.5">Financial Year: {record.financialYear}</p>
        </div>
      </div>

      {/* Certification Paragraph */}
      <p className="mt-3 leading-relaxed text-justify">
        This is to certify that an amount of{" "}
        <span className="font-semibold">Rs. {grant.amount.toLocaleString("en-IN")}/-</span> in words{" "}
        <span className="font-semibold underline">(Rupees {amountWords})</span> has been released by SPD office /
        DEO SIDDIPET, towards <span className="font-semibold underline">{grant.name}</span> for{" "}
        <span className="font-semibold underline">{record.smcName}</span> with UDISE Code:{" "}
        <span className="font-semibold">{record.uDise}</span> during the Financial year {record.financialYear}.
      </p>
      <p className="mt-2">The details are mentioned hereunder.</p>

      {/* Grant Details Table */}
      <table className="w-full border border-black border-collapse mt-2 text-[12px]">
        <thead>
          <tr className="bg-voucher-header text-voucher-header-foreground font-extrabold uppercase tracking-wide text-[12.5px]">
            <th className="p-2 border border-black w-10 font-extrabold">S.No</th>
            <th className="p-2 border border-black text-left font-extrabold">Grant</th>
            <th className="p-2 border border-black w-24 font-extrabold">Credited Date</th>
            <th className="p-2 border border-black w-24 font-extrabold">Amount Released</th>
            <th className="p-2 border border-black w-28 font-extrabold">Expenditure Incurred</th>
            <th className="p-2 border border-black w-24 font-extrabold">Balance If any</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1.5 border border-black text-center">{serialNo}</td>
            <td className="p-1.5 border border-black">{grant.name}</td>
            <td className="p-1.5 border border-black text-center">{grant.date}</td>
            <td className="p-1.5 border border-black text-right">{grant.amount.toLocaleString("en-IN")}</td>
            <td className="p-1.5 border border-black text-right">{grant.amount.toLocaleString("en-IN")}</td>
            <td className="p-1.5 border border-black text-right">0</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-2 leading-relaxed text-justify">
        Out of which an amount of{" "}
        <span className="font-semibold">Rs. {grant.amount.toLocaleString("en-IN")}/-</span>{" "}
        <span className="font-semibold">(Rupees {amountWords})</span> has been utilized.
      </p>

      {/* Expenditure Statement */}
      <h2 className="text-center font-extrabold underline mt-4 text-base uppercase tracking-wider">EXPENDITURE STATEMENT</h2>
      <p className="mt-1 text-justify leading-relaxed">
        Statement showing the particulars of the amounts received from District Educational Officer, SIDDIPET and
        their details of expenditure.
      </p>

      <table className="w-full border border-black border-collapse mt-2 text-[12px]">
        <thead>
          <tr className="bg-voucher-header text-voucher-header-foreground font-extrabold uppercase tracking-wide text-[12.5px]">
            <th className="p-2 border border-black w-10 font-extrabold">S.No</th>
            <th className="p-2 border border-black text-left w-[28%] font-extrabold">Credit Particulars</th>
            <th className="p-2 border border-black text-left w-[22%] font-extrabold">PPA Description</th>
            <th className="p-2 border border-black text-left font-extrabold">Sub-Voucher No. &amp; Date with Details of Expenditure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1.5 border border-black text-center">1</td>
            <td className="p-1.5 border border-black">PPA No. &amp; Date</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1.5 border border-black text-center">2</td>
            <td className="p-1.5 border border-black">In whose favour the PPA received</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1.5 border border-black text-center">3</td>
            <td className="p-1.5 border border-black">Amount of the PPA (Rs.)</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1.5 border border-black text-center">4</td>
            <td className="p-1.5 border border-black">Date of remittance into the bank</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1.5 border border-black text-center">5</td>
            <td className="p-1.5 border border-black">Bank A/c No.</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr>
            <td className="p-1.5 border border-black text-center">6</td>
            <td className="p-1.5 border border-black">In whose favour the above A/c exists</td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
          <tr className="bg-voucher-total font-bold">
            <td colSpan={2} className="p-1.5 border border-black text-right">TOTAL</td>
            <td className={editableCellClass + " text-right"} contentEditable suppressContentEditableWarning></td>
            <td className={editableCellClass} contentEditable suppressContentEditableWarning></td>
          </tr>
        </tbody>
      </table>

      {/* Certifications */}
      <div className="mt-3 space-y-1.5 text-justify leading-relaxed">
        <p>
          Certified that the Grant of <span className="font-semibold">Rs. {grant.amount.toLocaleString("en-IN")}/-</span>{" "}
          (In words Rupees <span className="font-semibold">{amountWords}</span>) received from the State Project
          Director, T.G., Hyderabad and the District Project Office, T.G. Samagra Shiksha, Siddipet as per the
          sanction order Rc.No. ____________ Dated: ____________ &amp; Certified that the above amount has been
          deposited in the PFMS Bank Account: <span className="font-semibold">{record.smcAcNo || "____________"}</span>{" "}
          PFMS Agency Code: <span className="font-semibold">{record.pfmsCode}</span>.
        </p>
        <p>
          Certified that the above Expenditure Amount{" "}
          <span className="font-semibold">Rs. {grant.amount.toLocaleString("en-IN")}/-</span> has been fully utilized
          for the purpose for which they have been sanctioned as per the Samagra Shiksha Guidelines &amp; Resolution
          of Parent Committee also.
        </p>
        <p>Certified that the relevant Sub Vouchers are kept in the office and attached with this statement.</p>
      </div>

      {/* Signatures - pushed to bottom of page */}
      <div className="mt-auto pt-6 flex justify-between text-[11px]">
        <div className="text-center">
          <div className="border-b border-foreground w-52 mb-1"></div>
          <p className="font-bold">Signature of the SMC Chairman / Sr. Teacher</p>
        </div>
        <div className="text-center">
          <div className="border-b border-foreground w-52 mb-1"></div>
          <p className="font-bold">Signature of the HM</p>
          <p className="font-semibold">{record.hmName || ""}</p>
        </div>
      </div>
    </div>
  );
};
