import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import styles from "./QrModal.module.css"; // Importa el CSS Module
import { IconDownload, IconPrint } from "@/components/layout/icons/IconsBiblioteca";
import Image from "next/image";

interface QrModalProps {
  open: boolean;
  onClose: () => void;
  qrData: any;
  title?: string;
}

const QrModal: React.FC<QrModalProps> = ({
  open,
  onClose,
  qrData,
  title = "Código QR Generado",
}) => {
  if (!open || !qrData) {
    return null;
  }

  console.log(qrData);
  console.log("mis datitos");
  const dataString = typeof qrData === "string" ? qrData : JSON.stringify(qrData);

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas instanceof HTMLCanvasElement) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "codigo_qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("No se pudo encontrar el elemento canvas para descargar.");
    }
  };

  const handlePrint = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement | null;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      // (Tu lógica de windowContent y printWin permanece igual)
      let windowContent = `<!DOCTYPE html><html><head><title>Imprimir QR</title></head><body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;"><img src="${dataUrl}" style="max-width: 90%; max-height: 90%;" alt="Código QR"><script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };</script></body></html>`;
      const printWin = window.open("","_blank","width=600,height=600,scrollbars=yes,resizable=yes");
      if (printWin) {
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
      } else {
        alert("Por favor, permite las ventanas emergentes para imprimir.");
      }
    } else {
      console.error("No se pudo encontrar el elemento canvas para imprimir.");
    }
  };

  return (
    <DataModal
      open={open}
      onClose={onClose}
      title={title}
      // Si tu DataModal tiene un botón de "Guardar" por defecto y no lo quieres:
      buttonText="" // Esto podría ocultar el botón de "Guardar" si DataModal lo soporta
      // Si quieres que el botón de "Cerrar" del DataModal sea el único botón del footer:
      buttonCancel="Cerrar" // O el texto que prefieras
    >
      <div className={styles.qrContainer}> {/* Contenedor principal con estilos */}
        <div className={styles.logoContainer}>
          <Image
            src="/images/creemos.png"
            alt="Logo Creemos"
            width={60}
            height={60}
            priority
          />
        </div>
        <div className={styles.qrCodeCanvas}> {/* Contenedor opcional para el canvas si quieres estilizarlo más */}
          <QRCodeCanvas
            id="qr-code-canvas"
            value={dataString}
            size={220} // Un poco más pequeño para dar espacio al padding y borde
            level={"H"}
            includeMargin={true} // includeMargin es bueno para que el QR no toque los bordes
            // bgColor="#ffffff" // Puedes especificar colores si es necesario
            // fgColor="#000000"
          />
        </div>
        <p className={styles.dataString}>
          Este es tu QR de simpatizante, te servirá para eventos, participaciones, etc.
        </p>
        <div className={styles.actionsContainer}>
          <button
            onClick={handleDownload}
            className={`${styles.actionButton} ${styles.downloadButton}`}
          >
            <IconDownload size={20} />
            Descargar
          </button>
          <button
            onClick={handlePrint}
            // Elige un estilo: styles.printButton o styles.printButtonOutline
            className={`${styles.actionButton} ${styles.printButtonOutline}`} 
          >
            <IconPrint size={20} />
            Imprimir
          </button>
        </div>
      </div>
    </DataModal>
  );
};

export default QrModal;