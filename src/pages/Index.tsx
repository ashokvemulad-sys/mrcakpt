import { useState, useMemo } from "react";
import { grantsData, GrantRecord } from "@/data/grantsData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer, X, FileText, Receipt } from "lucide-react";
import { GrantReport } from "@/components/GrantReport";
import { GrantVoucher } from "@/components/GrantVoucher";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<GrantRecord | null>(null);
  const [voucherView, setVoucherView] = useState<"summary" | "vouchers">("summary");
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return grantsData.filter(
      (r) =>
        r.smcName.toLowerCase().includes(term) ||
        r.pfmsCode.toLowerCase().includes(term) ||
        r.uDise.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handlePrint = () => window.print();

  // Batch print: show all certificates + per-grant vouchers for every school
  if (batchPrint) {
    return (
      <>
        <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
          <Button onClick={handlePrint} className="bg-primary text-primary-foreground gap-2">
            <Printer className="h-4 w-4" /> Print All
          </Button>
          <Button variant="outline" onClick={() => setBatchPrint(false)} className="gap-2">
            <X className="h-4 w-4" /> Back
          </Button>
        </div>
        <div>
          {grantsData.map((record) => {
            const nonZero = record.grants.filter((g) => g.amount > 0);
            return (
              <div key={record.pfmsCode}>
                <div className="print:break-after-page">
                  <GrantReport record={record} />
                </div>
                {nonZero.map((grant, gIdx) => (
                  <div key={`${record.pfmsCode}-${gIdx}`} className="print:break-after-page">
                    <GrantVoucher record={record} grant={grant} serialNo={gIdx + 1} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // Single record view
  if (selectedRecord) {
    const nonZero = selectedRecord.grants.filter((g) => g.amount > 0);
    return (
      <>
        <div className="no-print fixed top-4 right-4 z-50 flex gap-2 flex-wrap justify-end">
          <Button
            variant={voucherView === "summary" ? "default" : "outline"}
            onClick={() => setVoucherView("summary")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" /> Summary
          </Button>
          <Button
            variant={voucherView === "vouchers" ? "default" : "outline"}
            onClick={() => setVoucherView("vouchers")}
            className="gap-2"
          >
            <Receipt className="h-4 w-4" /> Vouchers ({nonZero.length})
          </Button>
          <Button onClick={handlePrint} className="bg-primary text-primary-foreground gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={() => { setSelectedRecord(null); setVoucherView("summary"); }} className="gap-2">
            <X className="h-4 w-4" /> Back
          </Button>
        </div>
        {voucherView === "summary" ? (
          <GrantReport record={selectedRecord} />
        ) : (
          <div>
            {nonZero.map((grant, gIdx) => (
              <div key={gIdx} className="print:break-after-page">
                <GrantVoucher record={selectedRecord} grant={grant} serialNo={gIdx + 1} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary-foreground">
            School Grants Query System
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Mandal: AKKANNAPETA — Search by School Name, PFMS Code, or U-DISE Code
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search school name, PFMS code, or U-DISE code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-2 border-border focus:border-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Dropdown results */}
            {searchTerm && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {filteredResults.map((record) => (
                  <button
                    key={record.pfmsCode}
                    onClick={() => {
                      setSelectedRecord(record);
                      setSearchTerm("");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                  >
                    <p className="font-semibold text-foreground text-sm">{record.smcName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PFMS: {record.pfmsCode} | U-DISE: {record.uDise} | ₹{record.grandTotal.toLocaleString("en-IN")}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {searchTerm && filteredResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 px-4 py-3 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
          <Button
            onClick={() => setBatchPrint(true)}
            className="h-12 bg-green-600 hover:bg-green-700 text-white gap-2 whitespace-nowrap"
          >
            <FileText className="h-4 w-4" /> Print All ({grantsData.length})
          </Button>
        </div>


        {!searchTerm && (
          <div className="text-center mt-16 text-muted-foreground">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Start typing to search for a school</p>
            <p className="text-sm mt-1">Total {grantsData.length} schools in database</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
