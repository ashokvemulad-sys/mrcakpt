import { useCallback, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

/**
 * Persists contentEditable values within a container scope to localStorage.
 * Each editable element must have a unique `data-editable-key` attribute, OR
 * the hook will auto-assign one based on its position.
 */
export const useEditablePersist = (storageKey: string) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getEditables = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[contenteditable="true"]')
    );
  }, []);

  const ensureKeys = useCallback(() => {
    getEditables().forEach((el, idx) => {
      if (!el.dataset.editableKey) el.dataset.editableKey = `f_${idx}`;
    });
  }, [getEditables]);

  // Load on mount / storageKey change
  useEffect(() => {
    if (!containerRef.current) return;
    ensureKeys();
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, string>;
      getEditables().forEach((el) => {
        const k = el.dataset.editableKey!;
        if (data[k] !== undefined) el.innerText = data[k];
      });
    } catch {
      /* ignore */
    }
  }, [storageKey, ensureKeys, getEditables]);

  const save = useCallback(() => {
    ensureKeys();
    const data: Record<string, string> = {};
    getEditables().forEach((el) => {
      data[el.dataset.editableKey!] = el.innerText;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      toast({ title: "Saved", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Save failed", description: "Could not save changes.", variant: "destructive" });
    }
  }, [storageKey, ensureKeys, getEditables]);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    getEditables().forEach((el) => {
      el.innerText = "";
    });
    toast({ title: "Reset", description: "Editable fields cleared." });
  }, [storageKey, getEditables]);

  return { containerRef, save, reset };
};
