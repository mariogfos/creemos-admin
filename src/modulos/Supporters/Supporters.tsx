/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./Supporters.module.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import useCrudUtils from "../shared/useCrudUtils";
import RenderItem from "../shared/RenderItem";
import { getDateTimeStrMes } from "@/mk/utils/date";
import RenderForm from "./RenderForm";
import CardMetricts from "./CardMetricts/CardMetricts";
import {
  IconUserMen,
  IconUserV2,
  IconUserWomen,
} from "@/components/layout/icons/IconsBiblioteca";
import QrModal from "./QrModal/QrModal";
import RenderView from "./RenderView";
import { useAuth } from "@/mk/contexts/AuthProvider";
import axios, { AxiosError } from 'axios';

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Supporters = () => {
  const { user: authUser, showToast: showToastFromAuth } = useAuth(); 
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isInvitationQrVisible, setIsInvitationQrVisible] = useState(false);
  const [openImportHook, setOpenImportHook] = useState(false);

  const handleGenerateAndShowCard = useCallback(async (idDelSimpatizante: any) => {
    // idDelSimpatizante AHORA ES DIRECTAMENTE EL STRING DEL ID
    if (!idDelSimpatizante || typeof idDelSimpatizante !== 'string') {
      console.error("Supporters.js: El ID del simpatizante no es un string válido. ID recibido:", idDelSimpatizante);
      showToastFromAuth("Error: El ID del simpatizante no es válido.", "error");
      return;
    }
    const supporterId = idDelSimpatizante; // Usar directamente ya que ES el ID
    
    console.log("Supporters.js: handleGenerateAndShowCard llamado con ID:", supporterId);
    
    setIsGeneratingCard(true);

    const apiUrl = process.env.NEXT_PUBLIC_URL;
    if (!apiUrl) {
      console.error("Error de configuración: NEXT_PUBLIC_URL no disponible.");
      showToastFromAuth("Error de configuración del sistema.", "error");
      setIsGeneratingCard(false);
      return;
    }

    const cardGenerationUrl = `${apiUrl}/sup-card-by-id?id=${supporterId}`;

    try {
      const response = await axios.post(cardGenerationUrl, {}); 

      if (response.data && response.data.success && response.data.data && response.data.data.path) {
        const filePath = response.data.data.path;
        const downloadUrl = `${apiUrl}/storage/${filePath}`; 
        window.open(downloadUrl, '_blank');
        showToastFromAuth("Carnet generado exitosamente.", "success");
      } else {
        const message = response.data?.message || "No se pudo obtener la ruta del carnet desde la respuesta de generación.";
        console.error("Error en la respuesta de la API de generación de carnet:", response.data);
        showToastFromAuth(message, "error");
      }
    } catch (err: any) {
      console.error("Error al generar el carnet:", err);
      let errorMessage = 'Error desconocido al generar el carnet.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response) {
          const status = axiosError.response.status;
          const responseData = axiosError.response.data;
          const backendMessage = responseData?.message || responseData?.error || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
          errorMessage = `Error del servidor (${status}): ${backendMessage || 'No se pudo procesar la solicitud.'}`;
        } else if (axiosError.request) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        } else {
          errorMessage = `Error al preparar la petición: ${axiosError.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = `Ocurrió un error inesperado: ${err.message}`;
      }
      showToastFromAuth(errorMessage, "error");
    } finally {
      setIsGeneratingCard(false);
    }
  }, [showToastFromAuth]);

  const handleShowInvitationQr = useCallback(() => {
    const websiteUrl = process.env.NEXT_PUBLIC_WEB_SITE_URL;
    if (!websiteUrl) {
      console.error("WEB_SITE_URL no está definido en las variables de entorno");
      showToastFromAuth("Error de configuración: URL del sitio no definida.", "error");
      return;
    }
    const invitationUrl = `${websiteUrl}/register?ref=${authUser?.id}`; 
    setIsInvitationQrVisible(true);
  }, [authUser?.id, showToastFromAuth]);

  const fields = useMemo(() => {
    return {
      id: { rules: [], api: "e" },
      created_at: { api: "", label: " Fecha y hora de registro", form: false, list: { width: "300px", onRender: ({ value }: any) => getDateTimeStrMes(value) }},
      user_id: { rules: [], api: "", label: "Administrador", form: false, list: false, filter: { label: "Administrador", width: "150px", extraData: "admins" }},
      fullName: { api: "ae", label: "Nombre", form: false, onRender: ({ item }: any) => (<div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar src={getUrlImages("/AFF-" + item?.affiliate_id + ".webp?d=" + item?.updated_at)} name={getFullName(item)} /><p>{getFullName(item)}</p></div>), list: true },
      name: { rules: ["required"], api: "ae", label: "Primer nombre", form: { type: "text" }, list: false },
      middle_name: { rules: [], api: "ae", label: "Segundo nombre", form: { type: "text" }, list: false },
      last_name: { rules: ["required"], api: "ae", label: "Apellido paterno", form: { type: "text" }, list: false },
      mother_last_name: { rules: [], api: "ae", label: "Apellido materno", form: { type: "text" }, list: false },
      ci: { rules: ["required"], api: "ae", label: "Cédula de identidad", form: { type: "text" }, list: { width: "190px" }},
      prov_code: { rules: ["required"], api: "ae", label: "Provincia", form: false, list: { width: "150px", onRender: ({ item, extraData: listExtraData }: any) => listExtraData?.provs?.find( (prov: any) => prov?.id == item?.prov_code )?.name }},
      prefix_phone: { rules: ["required"], api: "ae", label: "Prefijo teléfono", form: { type: "number", precarga: 591 }, list: false },
      phone: { rules: ["required"], api: "ae", label: "Teléfono", form: { type: "number" }, list: { width: "150px" }},
      email: { rules: ["required"], api: "ae", label: "Correo electrónico", form: { type: "text" }, list: { width: "300px" }},
    };
  }, []);

  const modConfig: ModCrudType = useMemo(() => ({
    modulo: "supporters",
    singular: "simpatizante",
    plural: "simpatizantes",
    permiso: "",
    export: true,
    filter: true,
    extraData: true,
    renderView: RenderView,
    renderForm: (propsFromUseCrud: any) => (
      <RenderForm
        {...propsFromUseCrud}
        onSuccessWithQrData={handleGenerateAndShowCard} 
      />
    ),
  }), [handleGenerateAndShowCard]);

  const {
    userCan,
    List,
    setStore,
    onSearch,
    searchs,
    onEdit,
    onDel,
    // showToast, // showToastFromAuth se usa directamente
    extraData,
  } = useCrud({
    paramsInitial,
    mod: modConfig,
    fields,
    _onImport: () => setOpenImportHook(true),
  });

  const { onLongPress, selItem, searchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod: modConfig,
    onEdit,
    onDel,
  });

  useEffect(() => {
    setOpenImportHook(searchState === 3);
  }, [searchState]);

  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <ItemList
          title={getFullName(item)} 
          subtitle={item?.ci || item?.email}
          variant="V1"
          active={selItem && selItem.id === item.id}
        />
      </RenderItem>
    );
  };

  if (!userCan(modConfig.permiso, "R")) return <NotAccess />;

  return (
    <div className={styles.Users}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <CardMetricts value={extraData?.grals?.total_supporters} label="Total de simpatizantes" icon={<IconUserV2 color="var(--cInfo)" />} />
        <CardMetricts value={extraData?.grals?.male_supporters} label="Simpatizantes masculinos" icon={<IconUserMen viewBox="0 0 30 30" color="var(--cSuccess)" />} />
        <CardMetricts value={extraData?.grals?.female_supporters} label="Simpatizantes femeninos" icon={<IconUserWomen viewBox="0 0 30 30" color="#F0A8B2" />} />
      </div>
      
      {isGeneratingCard && <div style={{ textAlign: 'center', margin: '10px 0', color: 'var(--cPrimary)', fontWeight: 'bold' }}>Generando carnet, por favor espere...</div>}

      <List onTabletRow={renderItem} />

      <QrModal
        open={isInvitationQrVisible}
        onClose={() => setIsInvitationQrVisible(false)}
        qrData={`${process.env.NEXT_PUBLIC_WEB_SITE_URL}/register?ref=${authUser?.id}`} 
        title="QR de Invitación"
      />

      <button 
        onClick={handleShowInvitationQr}
        className={styles.floatingQrButton}
        title="Generar QR de invitación"
        disabled={isGeneratingCard} 
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3H11V11H3V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 3H21V11H13V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13H11V21H3V13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 13H21V21H13V13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default Supporters;