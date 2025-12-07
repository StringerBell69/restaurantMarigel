"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open popup on mount
    setIsOpen(true);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-transparent border-none shadow-none">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/event-popup.png"
                alt="Soirée Portugaise"
                width={500}
                height={700}
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
              />
            </div>
        </DialogContent>
      </Dialog>

      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 shadow-lg gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
          variant="default"
          size="lg"
        >
          <Ticket className="h-5 w-5" />
          Soirée Portugaise
        </Button>
      )}
    </>
  );
}
