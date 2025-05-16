/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import styles from "./Supporters.module.css";
import { useEffect, useMemo, useState, useCallback } from "react"; // useCallback añadido
import ItemList from "@/mk/components/ui/ItemList/ItemList";
import NotAccess from "@/components/layout/NotAccess/NotAccess";
import useCrud, { ModCrudType } from "@/mk/hooks/useCrud/useCrud";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import useCrudUtils from "../shared/useCrudUtils";
import RenderItem from "../shared/RenderItem";
import { getDateTimeStrMes } from "@/mk/utils/date";
import RenderForm from "./RenderForm"; // Tu componente de formulario personalizado
import CardMetricts from "./CardMetricts/CardMetricts";
import {
  IconUserMen,
  IconUserV2,
  IconUserWomen,
  IconGenericQr,
} from "@/components/layout/icons/IconsBiblioteca";
import QrModal from "./QrModal/QrModal"; // Asegúrate que la ruta sea correcta
import RenderView from "./RenderView";
import { useAuth } from "@/mk/contexts/AuthProvider";


const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Supporters = () => {
  const { user: authUser } = useAuth();
  // --- PASO 1: Definir estados y manejadores que NO dependen de useCrud ---
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [qrModalData, setQrModalData] = useState(null);
  const [isInvitationQrVisible, setIsInvitationQrVisible] = useState(false);

  const handleShowQr = useCallback((dataForQr: any) => {
    console.log("Supporters.js: handleShowQr llamado con datos:", dataForQr);
    setQrModalData(dataForQr);
    setIsQrModalVisible(true);
  }, []); // useCallback para estabilidad si se pasa como dependencia

  const handleCloseQr = useCallback(() => {
    setIsQrModalVisible(false);
    setQrModalData(null);
  }, []); // useCallback para estabilidad

  const handleShowInvitationQr = useCallback(() => {
    const websiteUrl = process.env.NEXT_PUBLIC_WEB_SITE_URL;
    if (!websiteUrl) {
      console.error("WEB_SITE_URL no está definido en las variables de entorno");
      return;
    }
    const invitationUrl = `${websiteUrl}?ref=${authUser?.id}`;
    setIsInvitationQrVisible(true);
  }, [authUser?.id]);

  // --- PASO 2: Definir 'fields' y 'mod' que se pasarán a useCrud ---
  // 'fields' no suele tener dependencias complejas de este scope
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

  // 'mod' se define aquí. Su 'renderForm' ahora solo depende de `handleShowQr`
  // (y asume que RenderForm obtendrá showToast de useAuth, y reLoadExtra se maneja con reLoad/execute)
  const modConfig: ModCrudType = useMemo(() => ({
    modulo: "supporters",
    singular: "simpatizante",
    plural: "simpatizantes",
    permiso: "",
    export: true,
    filter: true,
    extraData: true, // Para que useCrud cargue extraData
    renderView: RenderView,
    renderForm: (propsFromUseCrud: any) => (
      <RenderForm
        {...propsFromUseCrud} // Pasa todas las props estándar de useCrud
        // reLoadExtra={/* Eliminado por ahora, manejar con execute/reLoad si es necesario */}
        onSuccessWithQrData={handleShowQr} // Prop de Supporters.js
        // showToast={/* RenderForm debe obtenerlo de useAuth o useCrud debe pasarlo */}
        // Si `useCrud` NO pasa `showToast` en `propsFromUseCrud`, y `RenderForm` lo espera como prop,
        // necesitarás añadir `showToast={showToastFromUseCrud}` aquí, pero eso reintroduce la dependencia.
        // Es mejor si RenderForm usa useAuth() o si useCrud pasa showToast.
        // Por ahora, asumiré que RenderForm lo gestiona o que showToast está en propsFromUseCrud.
      />
    ),
  
    // ... otras configuraciones de 'mod' que tenías
  }), [handleShowQr]); // La dependencia de `handleShowQr` asegura que se pasa la instancia correcta.

  // --- PASO 3: Llamar a useCrud con las configs definidas ---
  const {
    userCan,
    List,
    setStore,
    onSearch,
    searchs,
    onEdit,
    onDel,
    showToast, // Obtenido de useCrud
    extraData,
    execute,
    data,
    params,
    user,
    setParams,
    reLoad,
    getExtraData, // Obtenido de useCrud (para tu uso general en Supporters si es necesario)
  } = useCrud({
    paramsInitial,
    mod: modConfig, // Pasa el mod configurado
    fields,       // Pasa los fields configurados
    _onImport: () => setOpenImportHook(true), // Se usa la función onImport definida abajo
  });

  // --- PASO 4: Lógica restante que puede usar los resultados de useCrud ---
  const [openImportHook, setOpenImportHook] = useState(false); 

  const { onLongPress, selItem, searchState } = useCrudUtils({
    onSearch,
    searchs,
    setStore,
    mod: modConfig, // Pasa el mismo modConfig
    onEdit,
    onDel,
  });

  useEffect(() => {
    setOpenImportHook(searchState == 3);
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
          active={selItem && selItem.id == item.id}
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
      <List onTabletRow={renderItem} />

      <QrModal
        open={isQrModalVisible}
        onClose={handleCloseQr}
        qrData={qrModalData}
        title={`QR para ${modConfig.singular}`}
      />

      <QrModal
        open={isInvitationQrVisible}
        onClose={() => setIsInvitationQrVisible(false)}
        qrData={`${process.env.NEXT_PUBLIC_WEB_SITE_URL}/${authUser?.id}`}
        title="QR de Invitación"
      />

      <button 
        onClick={handleShowInvitationQr}
        className={styles.floatingQrButton}
        title="Generar QR de invitación"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3H11V11H3V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 3H21V11H13V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13H11V21H3V13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 13H21V21H13V13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Tu lógica para el modal de importación si es diferente al de useCrud */}
      {/* Ejemplo: <ImportDataModal open={openImportHook} onClose={() => setOpenImportHook(false)} ... /> */}
    </div>
  );
};

export default Supporters;