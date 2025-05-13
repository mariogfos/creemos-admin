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
import RenderForm from "./RenderForm"; // Tu componente de formulario personalizado
import CardMetricts from "./CardMetricts/CardMetricts";
import {
  IconUserMen,
  IconUserV2,
  IconUserWomen,
} from "@/components/layout/icons/IconsBiblioteca";
import QrModal from "./QrModal/QrModal"; // Asegúrate que la ruta sea correcta

const paramsInitial = {
  perPage: 10,
  page: 1,
  fullType: "L",
  searchBy: "",
};

const Supporters = () => {
  // --- PASO 1: Definir estados y manejadores que NO dependen de useCrud ---
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);
  const [qrModalData, setQrModalData] = useState(null);

  const handleShowQr = useCallback((dataForQr: any) => {
    console.log("Supporters.js: handleShowQr llamado con datos:", dataForQr);
    setQrModalData(dataForQr);
    setIsQrModalVisible(true);
  }, []);

  const handleCloseQr = useCallback(() => {
    setIsQrModalVisible(false);
    setQrModalData(null);
  }, []);

  // --- PASO 2: Definir 'fields' y 'mod' que se pasarán a useCrud ---
  // 'fields' actualizado para coincidir con los nombres de $fillable del backend
  const fields = useMemo(() => {
    return {
      // --- Identificadores y Metadatos ---
      id: { rules: [], api: "e" }, // Se envía solo en edición (e)
      created_at: { api: "", label: " Fecha y hora de registro", form: false, list: { width: "300px", onRender: ({ value }: any) => getDateTimeStrMes(value) }},
      user_id: { rules: [], api: "", label: "Administrador", form: false, list: false, filter: { label: "Administrador", width: "150px", extraData: "admins" }}, // Asumo que se asigna en backend o ya existe en el item para filtros

      // --- Campos de Nombre (coinciden con $fillable) ---
      fullName: { api: "", label: "Nombre", form: false, list: { onRender: ({ item }: any) => (<div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar src={getUrlImages("/AFF-" + item?.affiliate_id + ".webp?d=" + item?.updated_at)} name={getFullName(item)} /><p>{getFullName(item)}</p></div>) }}, // Campo virtual para mostrar, no se envía directamente (api: "")
      name: { rules: ["required"], api: "ae", label: "Primer nombre", form: { type: "text" }, list: false },
      middle_name: { rules: [], api: "ae", label: "Segundo nombre", form: { type: "text" }, list: false }, // Corregido: rules era [""] lo cual no tiene sentido, ahora es []
      last_name: { rules: ["required"], api: "ae", label: "Apellido paterno", form: { type: "text" }, list: false },
      mother_last_name: { rules: [], api: "ae", label: "Apellido materno", form: { type: "text" }, list: false }, // Corregido: rules era [""]

      // --- Identificación y Contacto (coinciden con $fillable) ---
      ci: { rules: ["required"], api: "ae", label: "Cédula de identidad", form: { type: "text" }, list: { width: "190px" }},
      email: { rules: ["required", "email"], api: "ae", label: "Correo electrónico", form: { type: "email" }, list: { width: "300px" }}, // Añadida regla 'email' y tipo 'email'
      prefix_phone: { rules: ["required"], api: "ae", label: "Prefijo teléfono", form: { type: "number", precarga: 591 }, list: false },
      phone: { rules: ["required"], api: "ae", label: "Teléfono", form: { type: "number" }, list: { width: "150px" } },

      // --- Ubicación (coinciden con $fillable) ---
      // ** CAMBIO CLAVE: Usamos 'prov_code' que es el nombre en $fillable **
      // Asumimos que el backend espera el 'code' o 'id' de la provincia bajo este nombre.
      prov_code: {
         rules: ["required"],
         api: "ae", // Se enviará como 'prov_code' al crear (a) y editar (e)
         label: "Provincia",
         form: false, // Asumimos que RenderForm maneja la selección de provincia
         list: {
           width: "150px",
           // IMPORTANTE: Ajusta esta lógica según la estructura de tus datos.
           // Asume que `item.prov_code` contiene el valor a buscar (podría ser ID o código)
           // y que `extraData.provs` es un array de objetos con `id` y `name`.
           // Si `item.prov_code` es el código y `provs` usa `code`, cambia a `prov.code == item.prov_code`.
           onRender: ({ item, extraData: listExtraData }: any) =>
             listExtraData?.provs?.find( (prov: any) => prov?.id == item?.prov_code )?.name || item?.prov_code // Muestra el código si no se encuentra el nombre
         }
      },
      // Otros códigos de ubicación (de $fillable), asumimos que RenderForm los maneja
      mun_code: { rules: [], api: "ae", label: "Municipio", form: false, list: false },
      dist_code: { rules: [], api: "ae", label: "Distrito", form: false, list: false },
      local_code: { rules: [], api: "ae", label: "Localidad", form: false, list: false },
      recint_code: { rules: [], api: "ae", label: "Recinto", form: false, list: false },

      // --- Otros Campos de $fillable (Añadidos si son necesarios en el form) ---
      address: { rules: [], api: "ae", label: "Dirección", form: { type: "text" }, list: false },
      birthdate: { rules: [], api: "ae", label: "Fecha de Nacimiento", form: { type: "date" }, list: false }, // Asume un input de fecha
      gender: { rules: [], api: "ae", label: "Género", form: { type: "select", options: [{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}, /* añade otros si es necesario */] }, list: false }, // Ejemplo de select
      militancy_code: { rules: [], api: "ae", label: "Código Militancia", form: { type: "text" }, list: false }, // Si aplica

      // --- Campos de $fillable que probablemente NO se editan aquí ---
      // password: { rules: [], api: "ae", label: "Contraseña", form: { type: "password" }, list: false }, // Descomentar si es necesario editar contraseña aquí
      // email_verified_at: { form: false, list: false }, // Gestionado por backend
      // url_avatar: { form: false, list: false }, // Probablemente manejado con carga de imagen separada
      // type: { form: false, list: false }, // Podría ser un campo fijo o manejado de otra forma
      // status: { form: false, list: false }, // Usualmente se cambia con acciones específicas
    };
  }, []); // Sin dependencias aquí, la configuración es estática

  // 'mod' se define aquí. Su 'renderForm' ahora solo depende de `handleShowQr`
  const modConfig: ModCrudType = useMemo(() => ({
    modulo: "supporters",
    singular: "simpatizante",
    plural: "simpatizantes",
    permiso: "", // Asegúrate de establecer el permiso correcto si aplica
    export: true,
    filter: true,
    extraData: true, // Para que useCrud cargue extraData
    renderForm: (propsFromUseCrud: any) => (
      <RenderForm
        {...propsFromUseCrud} // Pasa todas las props estándar de useCrud
        onSuccessWithQrData={handleShowQr} // Prop de Supporters.js para mostrar QR al crear/editar exitosamente
        // Asumimos que RenderForm obtiene showToast de useAuth o que useCrud lo pasa en propsFromUseCrud
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
    // execute, // Descomentar si se usa para acciones personalizadas
    // data, // Descomentar si se necesita acceso directo a los datos cargados
    // params, // Descomentar si se necesita acceso a los parámetros actuales
    // user, // Descomentar si se necesita información del usuario autenticado
    // setParams, // Descomentar si se necesita modificar parámetros manualmente
    // reLoad, // Descomentar si se necesita recargar datos manualmente
    // getExtraData, // Descomentar si se necesita recargar extraData manualmente
  } = useCrud({
    paramsInitial,
    mod: modConfig, // Pasa el mod configurado
    fields,        // Pasa los fields configurados y CORREGIDOS
    _onImport: () => setOpenImportHook(true), // Función para manejar la importación
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

  // Efecto para abrir el modal de importación basado en searchState (si esa es la lógica deseada)
  useEffect(() => {
    setOpenImportHook(searchState == 3); // Asume que searchState 3 significa 'importar'
  }, [searchState]);

  // Renderizador para cada item en la lista (vista tablet/mobile)
  const renderItem = (
    item: Record<string, any>,
    i: number,
    onClick: Function
  ) => {
    return (
      <RenderItem item={item} onClick={onClick} onLongPress={onLongPress}>
        <ItemList
          title={getFullName(item)} // Usa la función helper para el nombre completo
          subtitle={item?.ci || item?.email} // Muestra CI o email como subtítulo
          variant="V1"
          active={selItem && selItem.id == item.id} // Marca el item seleccionado
        />
      </RenderItem>
    );
  };

  // --- Renderizado del Componente ---

  // Verifica permisos antes de renderizar
  if (!userCan(modConfig.permiso || 'supporters', "R")) return <NotAccess />; // Usa un permiso por defecto si no está definido

  return (
    <div className={styles.Users}>
      {/* Sección de Métricas */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <CardMetricts value={extraData?.grals?.total_supporters} label="Total de simpatizantes" icon={<IconUserV2 color="var(--cInfo)" />} />
        <CardMetricts value={extraData?.grals?.male_supporters} label="Simpatizantes masculinos" icon={<IconUserMen viewBox="0 0 30 30" color="var(--cSuccess)" />} />
        <CardMetricts value={extraData?.grals?.female_supporters} label="Simpatizantes femeninos" icon={<IconUserWomen viewBox="0 0 30 30" color="#F0A8B2" />} />
      </div>

      {/* Componente Lista de useCrud */}
      <List onTabletRow={renderItem} />

      {/* Modal para mostrar el QR */}
      <QrModal
        open={isQrModalVisible}
        onClose={handleCloseQr}
        qrData={qrModalData} // Los datos para generar el QR (probablemente ID o alguna URL)
        title={`QR para ${modConfig.singular}`}
      />

      {/* Aquí iría tu modal de importación si es necesario */}
      {/* Ejemplo:
      <ImportDataModal
        open={openImportHook}
        onClose={() => setOpenImportHook(false)}
        module={modConfig.modulo} // Pasa el módulo para la importación
        // ... otras props necesarias para el modal de importación
      />
      */}
    </div>
  );
};

export default Supporters;