'use client';

import { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { QrCode, Download } from "lucide-react";

interface QRCodeDialogProps {
  vehicleId: string;
  brandModel: string;
  variant?: 'icon' | 'full';
}

export function QRCodeDialog({ vehicleId, brandModel, variant = 'icon' }: QRCodeDialogProps) {
  const [size, setSize] = useState<number>(450);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/vehiculos/${vehicleId}`;
  
  // Function to download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (!canvas) {
      // If canvas not found, create one from the SVG
      const svg = qrCodeRef.current.querySelector("svg");
      if (!svg) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size + 100; // Add extra space for the title
        canvas.height = size + 150; // Add extra space for the title and caption
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add title
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`La Moderna - ${brandModel}`, canvas.width / 2, 30);
        
        // Draw QR code
        ctx.drawImage(img, 50, 50, size, size);
        
        // Add caption
        ctx.font = "14px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("Escanea para ver detalles", canvas.width / 2, size + 70);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode-${brandModel.replace(/\s+/g, "-").toLowerCase()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } else {
      // If canvas exists, use it directly
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${brandModel.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            title="Generar QR"
            data-vehicle-id={vehicleId}
          >
            <QrCode className="h-4 w-4" />
            <span className="sr-only">QR Code</span>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            data-vehicle-id={vehicleId}
          >
            <QrCode className="h-4 w-4" />
            <span>Generar código QR</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Código QR</DialogTitle>
          <DialogDescription>
            Genera un código QR para {brandModel}.
            Descarga la imagen para pegarla en el vehículo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="border border-gray-200 p-6 rounded-lg">
            <h3 className="text-center font-semibold mb-4">La Moderna - {brandModel}</h3>
            <div 
              ref={qrCodeRef} 
              className="bg-white rounded-lg"
              style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <QRCode
                size={size}
                value={fullUrl}
                level="H"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Escanea para ver detalles</p>
          </div>
          
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tamaño:</span>
              <span className="text-sm font-medium">{size}px</span>
            </div>
            <Slider
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
              min={300}
              max={600}
              step={50}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={downloadQRCode}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar QR para impresión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 