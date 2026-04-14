import { useState, useMemo, useRef } from "react";
import { grantsData, GrantRecord } from "@/data/grantsData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer, Download, X } from "lucide-react";
import { GrantReport } from "@/components/GrantReport";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<GrantRecord | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const schoolName = selectedRecord?.smcName?.replace(/\s+/g, "_") || "certificate";
    pdf.save(`${schoolName}_UC_2025-26.pdf`);
  };

  if (selectedRecord) {
    return (
      <>
        <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
          <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={handlePrint} className="bg-primary text-primary-foreground gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={() => setSelectedRecord(null)} className="gap-2">
            <X className="h-4 w-4" /> Back
          </Button>
        </div>
        <div ref={reportRef}>
          <GrantReport record={selectedRecord} />
        </div>
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
        <div className="relative">
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
        </div>

        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-3 mb-2">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
          </p>
        )}

        <div className="mt-2 space-y-2">
          {filteredResults.map((record) => (
            <button
              key={record.pfmsCode}
              onClick={() => setSelectedRecord(record)}
              className="w-full text-left p-4 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">{record.smcName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PFMS: {record.pfmsCode} &nbsp;|&nbsp; U-DISE: {record.uDise}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary whitespace-nowrap ml-4">
                  ₹{record.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </button>
          ))}
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
