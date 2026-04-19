import { useState, useMemo } from "react";
import { grantsData, GrantRecord } from "@/data/grantsData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer, X, FileText, Receipt, ScrollText, Save, RotateCcw } from "lucide-react";
import { GrantReport } from "@/components/GrantReport";
import { GrantVoucher } from "@/components/GrantVoucher";
import { SmcResolution } from "@/components/SmcResolution";
import { useEditablePersist } from "@/hooks/use-editable-persist";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<GrantRecord | null>(null);
  const [voucherView, setVoucherView] = useState<"summary" | "vouchers" | "resolutions">("summary");
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

  // Single record view
  if (selectedRecord) {
    const nonZero = selectedRecord.grants.filter((g) => g.amount > 0);
    const storageKey = `editables:${selectedRecord.pfmsCode}:${voucherView}`;
    return (
      <SelectedRecordView
        key={`${selectedRecord.pfmsCode}-${voucherView}`}
        storageKey={storageKey}
        record={selectedRecord}
        nonZero={nonZero}
        voucherView={voucherView}
        setVoucherView={setVoucherView}
        onBack={() => { setSelectedRecord(null); setVoucherView("summary"); }}
        onPrint={handlePrint}
      />
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
        {!searchOpen ? (
          <div className="text-center mt-16">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-20 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-1">Find a school to view its grants</p>
            <p className="text-sm text-muted-foreground mb-6">Total {grantsData.length} schools in database</p>
            <Button
              onClick={() => setSearchOpen(true)}
              className="h-12 px-6 gap-2 bg-primary text-primary-foreground"
            >
              <Search className="h-5 w-5" /> Search Schools
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                autoFocus
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
              {searchTerm && filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                  {filteredResults.map((record) => (
                    <button
                      key={record.pfmsCode}
                      onClick={() => {
                        setSelectedRecord(record);
                        setSearchTerm("");
                        setSearchOpen(false);
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
              variant="outline"
              onClick={() => { setSearchOpen(false); setSearchTerm(""); }}
              className="h-12 gap-2"
            >
              <X className="h-4 w-4" /> Close
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
