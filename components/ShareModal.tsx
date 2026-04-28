"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { IconX, IconDownload, IconShare } from "@tabler/icons-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl: string;
  username: string;
}

export function ShareModal({ isOpen, onClose, profileUrl, username }: ShareModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    // We get the SVG element inside our wrapper
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Ensure namespace is present
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Embed in an img, draw to canvas, and download as PNG
    const image = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      // High-res canvas for crisp QR code
      canvas.width = image.width * 4;
      canvas.height = image.height * 4;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Draw dark background directly onto the PNG
        ctx.fillStyle = "#09090b"; // var(--background) equivalent
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // Trigger download
        const a = document.createElement("a");
        a.download = `${username}-endpoint-qr.png`;
        a.href = canvas.toDataURL("image/png");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("QR Code downloaded!");
      }
    };
    image.src = url;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-card border border-border/40 rounded-none p-6 sm:p-8 flex flex-col items-center gap-6 shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconX size={20} />
            </button>

            <div className="flex flex-col items-center gap-2 text-center mt-2">
              <h2 className="text-xl font-medium tracking-tight text-foreground normal-case">
                Share your profile
              </h2>
              <p className="text-sm text-muted-foreground/80 font-mono tracking-wide">
                @{username}
              </p>
            </div>

            {/* QR Code Container */}
            <div 
              className="bg-foreground p-4 rounded-none w-full aspect-square flex items-center justify-center shadow-inner"
              ref={qrRef}
            >
              <QRCode
                value={profileUrl}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor="#09090b" // Uses dark bg color for the dots
                bgColor="#ffffff" // White background behind dots
              />
            </div>

            <div className="flex w-full gap-3 mt-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 text-foreground py-3 rounded-none text-[10px] uppercase font-medium tracking-widest transition-colors"
              >
                <IconShare size={16} />
                Copy Link
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background py-3 rounded-none text-[10px] uppercase font-medium tracking-widest transition-colors"
              >
                <IconDownload size={16} />
                Download
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
