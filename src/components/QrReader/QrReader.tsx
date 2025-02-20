import React, { useEffect, useState } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import useAxios from "@/mk/hooks/useAxios";
import { Card } from "@/mk/components/ui/Card/Card";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { getDateStrMes } from "@/mk/utils/date";
import { useAuth } from "@/mk/contexts/AuthProvider";
import LoadingScreen from "@/mk/components/ui/LoadingScreen/LoadingScreen";
import LevelAvatar from "../NoQr/LevelAvatar";

type PropsType = {
  open: boolean;
  close: () => void;
  eventId: number;
  onMsg?: any;
};

const QrReader = ({ open, close, eventId, onMsg = () => {} }: PropsType) => {
  const [scanResult, setScanResult]: any = useState(null);
  const [userId, setUserId]: any = useState("");
  const [error, setError]: any = useState(null);
  const [data, setData]: any = useState({});
  const { showToast } = useAuth();

  const { execute, loaded } = useAxios();

  const getAffiliate = async () => {
    const { data } = await execute("/affiliates", "GET", {
      searchBy: userId,
      fullType: "DET",
    });
    if (data?.success === true) {
      setData(data?.data);
    } else {
      onMsg("Afiliado no identificado", "Revisa que la persona esté correctamente afiliada en el sistema","I");
      close();
      // showToast("Afiliado no encontrado", "error");
      // setError(
      //   "Error al cargar los detalles del afiliado. Intente nuevamente."
      // );
    }
  };

  useEffect(() => {
    if (userId) {
      getAffiliate();
    }
  }, [userId]);

  const confirmAttendance = async () => {
    const { data } = await execute("/attendance", "POST", {
      event_id: eventId,
      affiliate_id: userId,
      type: "Q",
    });
    if (data?.success === true) {
      showToast("Asistencia confirmada", "success");
      close();
    } else {
      showToast(data?.message, "info");
      close();
      setError("Error al confirmar la asistencia. Intente nuevamente.");
    }
  };

  const checkResultScannerQr = (decodedText: string, scanner: any) => {
    const parts = decodedText.split("|");
    if (
      parts.length === 4 &&
      parts[0] === "elekta" &&
      parts[1] === "qr" &&
      parts[2] === "O"
    ) {
      const id = parts[3].slice(0, -12);
      setUserId(id);
      setScanResult(decodedText);
      setError(null);
      scanner.clear(); // Detener el escáner si es válido
    } else {
      onMsg("¡QR no válido!", "Asegúrate de que el afiliado tenga el QR correcto o regístralo manualmente.","Q");
      // setError("QR no válido. Por favor, inténtelo nuevamente.");
      // showToast("QR no válido. Por favor, inténtelo nuevamente.2222", "error");
      close();
      // // Reanudar el escáner
      // scanner.resume();
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        aspectRatio: 1,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          Html5QrcodeScanType.SCAN_TYPE_FILE,
        ],
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        useBarCodeDetectorIfSupported: true,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        checkResultScannerQr(decodedText, scanner);
      },
      (error: any) => {
        // Puedes manejar errores aquí
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.log("Error al limpiar el escáner:", error);
      });
    };
  }, []);


  const level =
    data?.affiliateLeague?.find((a: any) => a.status === "G")?.minlevel?.name ||
    "0";

  return (
    <>
      <DataModal
        open={open}
        onClose={() => close()}
        title="Escanear QR"
        fullScreen={true}
        buttonText=""
        disabled={false}
        buttonCancel=""
      >
        <>
          {scanResult ? (
            <DataModal
              open={true}
              onClose={() => {
                setUserId("");
                setScanResult(null);
                close();
              }}
              title="Detalle del afiliado"
              buttonText="Confirmar asistencia"
              buttonCancel=""
              onSave={() => confirmAttendance()}
            >
              <LoadingScreen loaded={loaded}>
                <Card style={{ backgroundColor: "var(--cBlackV1)" }}>
                  <Avatar
                    name={getFullName(data?.data)}
                    src={getUrlImages(
                      "/AFF-" +
                        data?.data?.id +
                        ".webp?d=" +
                        data?.data?.updated_at
                    )}
                    w={96}
                    h={96}
                  >
                    <LevelAvatar
                      level={level}
                      size={32}
                      style={{ marginTop: -10 }}
                    />
                  </Avatar>
                  <div
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      textAlign: "center",
                      marginTop: 8,
                      fontSize: 16,
                      color: "var(--cWhite)",
                    }}
                  >
                    {data?.data?.name || ""} {data?.data?.middle_name || ""}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: "var(--cWhite)",
                      }}
                    >
                      {data?.data?.last_name || ""}{" "}
                      {data?.data?.mother_last_name || ""}
                    </div>
                    {/* {data?.data?.is_verify === "A" && (
                    <div
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <IconVerify size={24} color={"var(--cInfo)"} />
                    </div>
                  )} */}
                  </div>
                  <div
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      color: "var(--cBlackV2)",
                      fontSize: 14,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    Se afilió el {getDateStrMes(data?.data?.created_at || "")}
                  </div>
                  <div
                    style={{
                      color: "var(--cInfo)",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    Líder del barrio {data?.data?.barrio || ""}
                  </div>
                </Card>
              </LoadingScreen>
            </DataModal>
          ) : (
            <div
              id="reader"
              style={{
                width: "100%",
                height: "100%",
                margin: 0,
                // textAlign: "center",
              }}
            ></div>
          )}
        </>
      </DataModal>
    </>
  );
};

export default QrReader;
