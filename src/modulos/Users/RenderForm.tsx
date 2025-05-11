import Input from "@/mk/components/forms/Input/Input";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState, useEffect, useCallback, useRef } from "react";

interface Area {
  code: string;
  name: string;
  prov_code?: string;
  mun_code?: string;
}

interface MetricsData {
  areas: {
    provs: Area[];
    muns: Area[];
    dists: Area[];
  };
}

const itemPropsSignificantlyChanged = (prevItem: any, nextItem: any): boolean => {
  if (!prevItem && nextItem) return true;
  if (prevItem && !nextItem) return true;
  if (!prevItem && !nextItem) return false;

  const keysToCompare: (keyof typeof nextItem)[] = [
    'id', 'name', 'middle_name', 'last_name', 'mother_last_name', 'ci', 
    'email', 'role_id', 'prefix_phone', 'phone', 
    'prov_code', 'mun_code', 'dist_code'
  ];

  for (const key of keysToCompare) {
    if (prevItem[key] !== nextItem[key]) {
      return true;
    }
  }
  return false;
};

const RenderForm = ({
  open,
  onClose,
  item,
  setItem, // setItem de useCrud, usualmente no se llama directamente desde el form interno así
  execute,
  extraData,
  user,
  reLoad,
}: {
  open: boolean;
  onClose: () => void;
  item: any;
  setItem: (item: any) => void;
  execute: (url: string, method: string, payload?: any, showDefaultError?: boolean, hideLoading?: boolean) => Promise<{ data?: any; success?: boolean; message?: string }>;
  extraData: any;
  user: any;
  reLoad: () => void;
}) => {
  // Usar una función para inicializar el estado solo la primera vez que el componente se monta
  // o cuando 'item' cambia de forma significativa (controlado por el useEffect).
  const [formState, setFormState] = useState(() => ({ ...item }));
  const [errors, setErrors] = useState({});
  const [oldEmail, setOldEmail] = useState(() => item?.email);

  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  
  const metricsLoadAttemptedRef = useRef(false);
  const prevItemRef = useRef<any>(item); // Inicializar con el item actual
  const isOpeningModalRef = useRef(false); // Para detectar la transición de cerrado a abierto

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes("MAC");
  const { showToast } = useAuth();

  // --- Efecto de Inicialización y Limpieza del Formulario y Métricas ---
// --- Efecto de Inicialización y Limpieza del Formulario y Métricas ---
const formInitializedForItemRef = useRef<string | null | undefined>(undefined);

useEffect(() => {
  if (open) {
    // Si es la primera vez que se abre el modal O si el ID del item actual es diferente al ID del item
    // para el cual ya se inicializó el formulario la última vez que se abrió.
    if (formInitializedForItemRef.current === undefined || (item?.id !== formInitializedForItemRef.current)) {
      console.log("RenderForm: Modal opened OR item.id changed. Resetting formState from item prop.", item);
      setFormState({ ...item }); // Inicializa/resetea el formState con el item actual
      setOldEmail(item?.email);
      setErrors({});
      metricsLoadAttemptedRef.current = false; // Permitir un nuevo intento de carga de métricas
      formInitializedForItemRef.current = item?.id; // Marcar que este item.id ya se procesó para esta apertura
    }
    prevItemRef.current = item; // Siempre guardar la referencia del item actual para la próxima comparación si es necesario

  } else { // Cuando el modal se cierra
    if (formInitializedForItemRef.current !== undefined) { // Solo limpiar si el modal estuvo abierto y procesado
      console.log("RenderForm: Modal closed. Resetting ALL relevant states.");
      setMetrics(null);
      setIsLoadingMetrics(false);
      metricsLoadAttemptedRef.current = false;
      setFormState({}); 
      setErrors({});
      setOldEmail(undefined);
      prevItemRef.current = undefined; 
      formInitializedForItemRef.current = undefined; // Muy importante: resetear para la próxima apertura
    }
  }
}, [open, item]); // Ejecutar cuando 'open' o 'item' (la prop) cambien


// --- Carga de Datos Geográficos (métricas) ---
const getMetrics = useCallback(async (params: any = { tab: "CAT" }) => {
  // ... (resto del código inicial de getMetrics) ...
  setIsLoadingMetrics(true);
  metricsLoadAttemptedRef.current = true; 

  try {
    const response = await execute("/map-metrics", "GET", params, false, true);
    // La API responde con { "data": { "areas": { ... } } }
    // Accedemos a response.data.data para obtener el objeto que contiene 'areas'
    if (response?.data?.data?.areas) { // <--- VERIFICAR ESTA RUTA
      console.log("RenderForm: Metrics fetched successfully. Setting 'metrics' state to:", response.data.data);
      setMetrics(response.data.data); // <--- ASIGNAR response.data.data
    } else {
      console.warn("RenderForm: Metrics response.data.data.areas structure not recognized or fetch failed", response);
      setMetrics(null);
    }
  }  catch (error) {
    console.error("Error fetching metrics:", error);
  } finally {
    setIsLoadingMetrics(false); // AÑADE ESTA LÍNEA
  }
}, [execute]); // Quitar isLoadingMetrics de aquí // isLoadingMetrics se quitó para no recrear getMetrics si solo ese flag cambia.

  // Efecto para disparar la carga de métricas
  useEffect(() => {
    // Solo cargar si el modal está abierto, no hay métricas, no se ha intentado cargar Y no está cargando.
    if (open && !metrics && !metricsLoadAttemptedRef.current && !isLoadingMetrics) {
      console.log("RenderForm: Conditions met to call getMetrics.");
      metricsLoadAttemptedRef.current = true; // Marcar intento ANTES de llamar
      getMetrics({ tab: "CAT" });
    }
    // Si el modal se cierra, metricsLoadAttemptedRef se resetea en el useEffect de [open, item]
  }, [open, metrics, isLoadingMetrics, getMetrics]);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`handleChange - Name: ${name}, Value: ${value}`);
    setFormState((prevState: any) => { // prevState ya está tipado implícitamente por el useState
      const newState = { ...prevState, [name]: value };
      if (name === "prov_code") {
        newState.mun_code = "";
        newState.dist_code = "";
      } else if (name === "mun_code") { // Usar else if para exclusividad
        newState.dist_code = "";
      }
      console.log("handleChange - New FormState:", newState);
      return newState;
    });
  }, []);

  const getMuns = useCallback(() => {
    if (!formState.prov_code || !metrics?.areas?.muns) return [];
    return metrics.areas.muns.filter((mun: Area) => String(mun.prov_code) === String(formState.prov_code));
  }, [formState.prov_code, metrics]);

  const getDmuns = useCallback(() => {
    if (!formState.prov_code || !formState.mun_code || !metrics?.areas?.dists) return [];
    if (String(formState.prov_code) === '1' && String(formState.mun_code) === '1') {
      return metrics.areas.dists.filter(
        (dmun: Area) => String(dmun.prov_code) === String(formState.prov_code) && String(dmun.mun_code) === String(formState.mun_code)
      );
    }
    return [];
  }, [formState.prov_code, formState.mun_code, metrics]);

  const validate = useCallback(() => {
    let currentErrors: any = {};
    currentErrors = checkRules({ value: formState.name, rules: ["required"], key: "name", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.middle_name, rules: [""], key: "middle_name", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.last_name, rules: ["required"], key: "last_name", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.mother_last_name, rules: [""], key: "mother_last_name", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.ci, rules: ["required"], key: "ci", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.email, rules: ["required", "email"], key: "email", errors: currentErrors, });
    currentErrors = checkRules({ value: formState.rep_email, rules: ["required", "same:email"], key: "rep_email", errors: currentErrors, data: formState, });
    currentErrors = checkRules({ value: formState.phone, rules: ["required"], key: "phone", errors: currentErrors, });
    setErrors(currentErrors);
    return currentErrors;
  }, [formState]);

  const onCheckEmail = useCallback(async () => {
    if (!formState.email || formState.email === oldEmail) {
      return;
    }
    const response = await execute("/adm-exist", "GET", { searchBy: formState.email, type: "email", cols: "id" }, false, true);
    if (response?.data != null) {
      setErrors((prevErrors: any) => ({ ...prevErrors, email: "El correo electrónico ya existe" }));
    }
  }, [formState.email, oldEmail, execute]);

  const onSave = useCallback(async () => {
    if (hasErrors(validate())) {
      showToast("Por favor, corrija los errores.", "warning");
      return;
    }
    const method = formState.id ? "PUT" : "POST";
    const payload = {
        name: formState.name,
        middle_name: formState.middle_name,
        last_name: formState.last_name,
        mother_last_name: formState.mother_last_name,
        ci: formState.ci,
        email: formState.email,
        role_id: formState.role_id,
        prefix_phone: formState.prefix_phone,
        phone: formState.phone,
      prov_code: formState.prov_code,
      mun_code: formState.mun_code,
      dist_code: formState.dist_code,
    };
    try {
      const response = await execute("/users" + (formState.id ? "/" + formState.id : ""), method, payload);
      console.log("RenderForm: onSave response:", response);
      console.log("RenderForm: onSave response?.success:", response?.success);
      if (response?.data?.success) {
        // Primero muestra el toast
        showToast(response?.data?.message || "Guardado con éxito", "success");
        // Luego recarga los datos
        await reLoad();

        // Finalmente cierra el modal
        onClose();
      } else {
        showToast(response?.data?.message || "Error al guardar", "error");
        if (response?.data?.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error en onSave:", error);
      showToast("Error inesperado al guardar", "error");
    }
  }, [formState, validate, execute, reLoad, showToast, onClose]);


  // --- Renderizado ---
  // Estado de carga para el primer render mientras se obtienen las métricas
  if (open && isLoadingMetrics && !metrics) {
    return (
      <DataModal open={open} onClose={onClose} title="Cargando...">
        <div>Cargando datos geográficos...</div>
      </DataModal>
    );
  }

  // Log para depurar el estado de 'disabled'
  if (open) {
    console.log("RenderForm - Disabled states:", {
        isLoadingMetrics,
        metricsExists: !!metrics,
        provCodeExists: !!formState.prov_code,
        munCodeExists: !!formState.mun_code,
        provinciaDisabled: isLoadingMetrics || !metrics,
        municipioDisabled: isLoadingMetrics || !formState.prov_code || !metrics,
        distritoDisabled: isLoadingMetrics || !(String(formState.prov_code) === '1' && String(formState.mun_code) === '1') || !formState.mun_code || !metrics
    });
  }

  return (
    <DataModal
      open={open}
      onClose={onClose}
      title={formState.id ? "Editar administrador" : "Crear administrador"}
      onSave={onSave}
    >
      <Input label="Primer nombre" name="name" value={formState.name || ""} onChange={handleChange} error={errors} />
      <Input label="Segundo nombre" name="middle_name" value={formState.middle_name || ""} onChange={handleChange} error={errors} />
      <Input label="Apellido paterno" name="last_name" value={formState.last_name || ""} onChange={handleChange} error={errors} />
      <Input label="Apellido materno" name="mother_last_name" value={formState.mother_last_name || ""} onChange={handleChange} error={errors} />
      
      <Select
        label="Provincia"
        name="prov_code"
        value={formState?.prov_code || ""}
        options={metrics?.areas?.provs || []}
        optionLabel="name"
        optionValue="code"
        onChange={handleChange}
        error={errors}
        disabled={isLoadingMetrics || !metrics}
      />
      <Select
        label="Municipio"
        name="mun_code"
        value={formState?.mun_code || ""}
        options={getMuns()}
        optionLabel="name"
        optionValue="code"
        onChange={handleChange}
        error={errors}
        disabled={isLoadingMetrics || !formState.prov_code || !metrics} // Si no hay prov_code, deshabilitado
      />
      <Select
        label="Distrito municipal"
        name="dist_code"
        value={formState?.dist_code || ""}
        options={getDmuns()}
        optionLabel="name"
        optionValue="code"
        onChange={handleChange}
        error={errors}
        // La lógica original: disabled={isLoadingMetrics || !(formState.prov_code === '1' && formState.mun_code === '1') || !formState.mun_code || !metrics}
        // Simplificada y corregida:
        disabled={
          isLoadingMetrics || 
          !metrics || 
          !formState.mun_code || 
          !(String(formState.prov_code) === '1' && String(formState.mun_code) === '1')
        }
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "35%" }}>
          <Select label="País" name="prefix_phone" error={errors} required={true} value={formState?.prefix_phone || ""} onChange={handleChange} options={PREFIX_COUNTRY} optionLabel={isMac ? "name" : "label"} optionValue="id" />
        </div>
        <div style={{ width: "65%" }}>
          <Input label="Número de whatsApp" type="number" name="phone" required={true} error={errors} value={formState?.phone || ""} onChange={handleChange} />
        </div>
      </div>
      <Input label="Cédula de identidad" name="ci" value={formState.ci || ""} onChange={handleChange} error={errors} />
      <Input label="Correo electrónico" name="email" value={formState.email || ""} onChange={handleChange} onBlur={onCheckEmail} error={errors} />
      <Input label="Repita el correo electrónico" name="rep_email" value={formState.rep_email || ""} onChange={handleChange} error={errors} />
    </DataModal>
  );
};

export default RenderForm;