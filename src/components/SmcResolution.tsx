import { GrantRecord, Grant } from "@/data/grantsData";
import logoSamagra from "@/assets/logo-samagra.png";
import logoPfms from "@/assets/logo-pfms.png";

interface SmcResolutionProps {
  record: GrantRecord;
  grant: Grant;
  serialNo?: number;
}

export const SmcResolution = ({ record, grant, serialNo = 1 }: SmcResolutionProps) => {
  const editableInline =
    "inline-block min-w-[120px] border-b border-black px-1 outline-none focus:bg-accent/30 print:bg-transparent font-bold text-black";
  const editableCell =
    "p-1.5 border border-black outline-none focus:bg-accent/30 print:bg-transparent min-h-[28px] font-bold text-black";
  const editableLine =
    "block w-full border-b border-black px-1 py-0.5 outline-none focus:bg-accent/30 print:bg-transparent min-h-[20px] font-bold text-black";

  return (
    <div
      className="max-w-[210mm] mx-auto bg-white p-[10mm] h-[297mm] print:p-[10mm] print:max-w-none print:h-[297mm] border-2 border-voucher-header flex flex-col overflow-hidden text-[14px] leading-relaxed text-foreground"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <div className="border-b border-border pb-2">
        <div className="flex items-center justify-between gap-4">
          <img src={logoSamagra} alt="Samagra Shiksha Logo" className="h-14 object-contain shrink-0" />
          <img src={logoPfms} alt="PFMS Logo" className="h-14 object-contain shrink-0" />
        </div>
        <div className="text-center mt-2">
          <h1 className="text-lg font-bold underline tracking-wide">SMC / AAPC RESOLUTION</h1>
          <p className="text-xs mt-0.5">Financial Year: {record.financialYear}</p>
        </div>
      </div>

      {/* School identifier line */}
      <p className="mt-3 text-center font-semibold">
        {record.smcName}, U-DISE: {record.uDise}, Mdl: AKKANNAPETA, Dist: SIDDIPET
      </p>

      {/* Lr.No / Date */}
      <div className="mt-2 flex justify-between text-[11px]">
        <span>
          Lr.No: <span className={editableInline} contentEditable suppressContentEditableWarning></span>
        </span>
        <span>
          Date: <span className={editableInline} contentEditable suppressContentEditableWarning></span>
        </span>
      </div>

      {/* Body paragraph */}
      <p className="mt-3 leading-relaxed text-justify">
        Today i.e. date{" "}
        <span className={editableInline} contentEditable suppressContentEditableWarning></span> day at 10:00 AM a
        meeting was arranged at the school <span className="font-semibold">{record.smcName}</span>, with U-DISE:{" "}
        <span className="font-semibold">{record.uDise}</span> of Akkannapeta Mandal, Siddipet District by the
        SMC/AAPC members with the teachers under the Chairmanship of the School Headmaster{" "}
        <span className="font-semibold">{record.hmName || "____________"}</span>, SMC/AAPC Chairman Sri/Smt:{" "}
        <span className={editableInline} contentEditable suppressContentEditableWarning></span>.
      </p>

      <p className="mt-2 leading-relaxed text-justify">
        At this meeting the prominent grants released to the school were explained to the SMC/AAPC members — how
        much grant has been credited and how it has been spent. All SMC/AAPC members of the committee unanimously
        agreed and passed the resolution for the utilization of the grant mentioned below:
      </p>

      {/* Grant table */}
      <table className="w-full border border-black border-collapse mt-3 text-[11px]">
        <thead>
          <tr className="bg-voucher-header text-voucher-header-foreground">
            <th className="p-1.5 border border-black w-10">S.No</th>
            <th className="p-1.5 border border-black text-left">Details of the Grant</th>
            <th className="p-1.5 border border-black w-28">Credited Amount</th>
            <th className="p-1.5 border border-black w-24">Credited Date</th>
            <th className="p-1.5 border border-black text-left w-[42%]">Purpose of Expenditure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1.5 border border-black text-center">{serialNo}</td>
            <td className="p-1.5 border border-black">{grant.name}</td>
            <td className="p-1.5 border border-black text-right">
              {grant.amount.toLocaleString("en-IN")}
            </td>
            <td className="p-1.5 border border-black text-center">{grant.date}</td>
            <td className={editableCell} contentEditable suppressContentEditableWarning></td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 leading-relaxed text-justify">
        This Committee agreed that the amounts released by Samagra Shiksha, Siddipet were utilized with regard to
        School Expenses properly as per the guidelines issued by Samagra Shiksha, Telangana from time to time. In
        our observation it is found that the grant has been properly utilized.
      </p>

      {/* Members sign */}
      <p className="mt-4 font-bold">SMC / AAPC Members Sign</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-7 mt-4 text-[12px]">
        <div className="pb-1">1. SMC Chairman: <span className={editableInline} contentEditable suppressContentEditableWarning></span></div>
        <div className="pb-1">2. SMC Vice Chairman: <span className={editableInline} contentEditable suppressContentEditableWarning></span></div>
        <div className="pb-1">3. Teacher: <span className={editableInline} contentEditable suppressContentEditableWarning></span></div>
        <div className="pb-1">4. Teacher: <span className={editableInline} contentEditable suppressContentEditableWarning></span></div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="pb-1">
            {5 + i}. <span className={editableInline} contentEditable suppressContentEditableWarning></span>
          </div>
        ))}
      </div>

      {/* Headmaster signature */}
      <div className="mt-16 flex justify-end text-[12px]">
        <div className="text-center">
          <div className="border-b border-foreground w-52 mb-1"></div>
          <p className="font-bold">Headmaster</p>
          <p className="font-semibold">{record.hmName || ""}</p>
        </div>
      </div>
    </div>
  );
};
