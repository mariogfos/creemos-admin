import Input from "@/mk/components/forms/Input/Input";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState, useEffect } from "react"; // Eliminado useCallback no solicitado

const RenderForm = ({
  open,
  onClose,
  item,
  setItem,
  execute,
  extraData,
  user, // Mantenido por si lo usabas, aunque comentado en tu original
  // reLoadExtra, // Mantenido comentado como en tu original
  reLoad,
  onSuccessWithQrData,
}: any) => {
  const [formState, setFormStateLocal] = useState({ ...item });
  const [localErrors, setLocalErrors] = useState({});
  // typeof navigator chequeado para evitar errores en SSR si aplica
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes("MAC");
  const { showToast } = useAuth();

  // Efecto original para actualizar el estado cuando 'item' cambia
  useEffect(() => {
    // Comprobación original para resetear el form state si el item cambia
    // Asume que 'item' (si viene de useCrud->onEdit) ya tiene los nombres correctos (ej: prov_code)
    if (item && (item.id !== formState.id || JSON.stringify(item) !== JSON.stringify(formState))) {
        setFormStateLocal({ ...item, rep_email: item?.email || '' }); // Añadido rep_email aquí también para consistencia al resetear
        setLocalErrors({});
    } else if (!item && formState.id) { // Lógica para limpiar si se pasa de editar a crear
        setFormStateLocal({ prefix_phone: 591 }); // O cualquier estado inicial deseado para crear
        setLocalErrors({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]); // Dependencia original

  // Manejador de cambios original
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value; // Corregido para usar newValue

    setFormStateLocal((prev: any) => {
         const newState = {
            ...prev,
            [name]: newValue,
         };
         // Lógica original para limpiar campos dependientes (adaptada a nuevos nombres)
         // ¡Asegúrate que esta lógica de limpieza es la que deseas!
         if (name === 'prov_code') {
            newState.mun_code = '';
            newState.dist_code = '';
            newState.local_code = '';
            newState.recint_code = '';
         } else if (name === 'mun_code') {
            newState.dist_code = '';
            newState.local_code = '';
            newState.recint_code = '';
         } else if (name === 'dist_code') {
            newState.local_code = '';
            newState.recint_code = '';
         } else if (name === 'local_code') {
            newState.recint_code = '';
         }
         return newState;
    });
    // Limpieza original de errores para el campo que cambia
    setLocalErrors((prev: any) => ({ ...prev, [name]: null }));
  };

  // Función de validación original
  const validate = () => {
    let currentErrors: any = {};
    // Validaciones originales explícitas
    currentErrors = checkRules({ value: formState.name, rules: ["required"], key: "name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.middle_name, rules: [], key: "middle_name", errors: currentErrors }); // Regla original vacía [""] cambiada a []
    currentErrors = checkRules({ value: formState.last_name, rules: ["required"], key: "last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.mother_last_name, rules: [], key: "mother_last_name", errors: currentErrors }); // Regla original vacía [""] cambiada a []
    currentErrors = checkRules({ value: formState.ci, rules: ["required"], key: "ci", errors: currentErrors });
    currentErrors = checkRules({ value: formState.email, rules: ["required", "email"], key: "email", errors: currentErrors });
    // Asegúrate que `formState` siempre tenga `rep_email` para la validación `same`. El useEffect ahora lo inicializa.
    currentErrors = checkRules({ value: formState.rep_email, rules: ["required", `same:${formState.email}`], key: "rep_email", errors: currentErrors, data: formState });
    currentErrors = checkRules({ value: formState?.gender, rules: ["required"], key: "gender", errors: currentErrors });
    currentErrors = checkRules({ value: formState.phone, rules: ["required"], key: "phone", errors: currentErrors });
    // Se añade validación para provincia si es requerida (ajusta 'rules' si no lo es)
    currentErrors = checkRules({ value: formState.prov_code, rules: ["required"], key: "prov_code", errors: currentErrors });
    // Puedes añadir validaciones para mun_code, dist_code etc. si son requeridos, siguiendo el mismo patrón.

    setLocalErrors(currentErrors);
    return currentErrors;
  };

  // Función de guardado original
  const onSaveInternal = async () => {
    const currentLocalErrors = validate();
    if (hasErrors(currentLocalErrors)) {
        // Podrías añadir un showToast aquí si lo deseas
        // showToast("Por favor, corrija los errores.", "warning");
      return;
    }

    // Payload original, ahora con los nombres correctos gracias a `handleChange` y los `name` de los inputs/selects
    const payload = { ...formState };
    delete payload._initItem; // Mantenido de tu código original si lo usabas
    delete payload.rep_email; // Campo de frontend

    let method = payload.id ? "PUT" : "POST";
    // Llamada a execute original
    const { data: response } = await execute(
      "/supporters" + (payload.id ? "/" + payload.id : ""),
      method,
      payload, // Envía el estado con los nombres correctos (ej: prov_code)
      false
    );

    // Lógica de respuesta original
    if (response?.success == true) {
      if (reLoad) reLoad();
      // if (reLoadExtra) reLoadExtra(); // Mantenido comentado
      if (setItem) setItem(response.data || payload); // Actualiza item en padre con respuesta o payload

      showToast(response?.message || "Operación exitosa", "success");

      if (response.data && onSuccessWithQrData) {
        onSuccessWithQrData(response.data);
      }

      onClose();
    } else {
      showToast(response?.message || "Error al guardar.", "error");
      if (response?.errors) {
        setLocalErrors(response.errors);
      }
    }
  };

  // --- Funciones get... originales, adaptadas a los nuevos nombres ---
  const getMuns = () => {
    // Cambiado prov_id a prov_code. Asume que mun.prov_code y formState.prov_code son comparables directamente (ambos códigos).
    if (!formState.prov_code || !extraData?.muns) return [];
    return ( extraData.muns.filter( (mun: any) => mun?.prov_code == formState.prov_code ) || [] );
  };
  const getDmuns = () => {
    // Cambiado mun_id a mun_code.
    if (!formState.mun_code || !extraData?.dists) return [];
    return ( extraData.dists.filter( (dmun: any) => dmun?.mun_code == formState.mun_code ) || [] );
  };
  const getLocals = () => {
     // Cambiado dist_id a dist_code y mun_id a mun_code.
    if (!formState?.dist_code || !extraData?.locals) return [];
    // Ajusta la lógica de filtro si es necesario (ej: solo por dist_code)
    return ( extraData.locals.filter( (local: any) => local?.dist_code == formState.dist_code /* || local?.mun_code == formState.mun_code */) || [] );
  };
  const getRecints = () => {
    // Cambiado local_id a local_code.
    if (!formState.local_code || !extraData?.recints) return [];
    return ( extraData.recints.filter( (rec: any) => rec?.local_code == formState.local_code ) || [] );
  };

  // --- Renderizado del JSX original con nombres corregidos ---
  return (
    <DataModal
      open={open}
      onClose={onClose}
      title={!formState.id ? "Crear simpatizante" : "Editar simpatizante"}
      onSave={onSaveInternal}
    >
      {/* Inputs originales */}
      <Input label="Primer nombre" name="name" value={formState.name || ''} onChange={handleChange} error={localErrors['name' as keyof typeof localErrors]} required/>
      <Input label="Segundo nombre" name="middle_name" value={formState.middle_name || ''} onChange={handleChange} error={localErrors['middle_name' as keyof typeof localErrors]} />
      <Input label="Apellido paterno" name="last_name" value={formState.last_name || ''} onChange={handleChange} error={localErrors['last_name' as keyof typeof localErrors]} required/>
      <Input label="Apellido materno" name="mother_last_name" value={formState.mother_last_name || ''} onChange={handleChange} error={localErrors['mother_last_name' as keyof typeof localErrors]} />
      <Input
        label="Fecha de nacimiento"
        name="birthdate" // Ya coincidía
        type="date"
        value={formState.birthdate || ''}
        onChange={handleChange}
        error={localErrors['birthdate' as keyof typeof localErrors]}
        style={{ colorScheme: 'light' }}
      />
      <Select
        label="Tipo de Militante"
        name="militancy_code" // ** CAMBIO **
        value={formState?.militancy_code || ''} // ** CAMBIO **
        optionLabel="name"
        optionValue="id" // Mantenido de tu original (envía ID)
        options={extraData?.militanses || []}
        onChange={handleChange}
        error={localErrors['militancy_code' as keyof typeof localErrors]} // Acceso seguro a errores
      />
      <Select
        label="Genero"
        name="gender" // Ya coincidía
        value={formState?.gender || ''}
        optionLabel="name"
        optionValue="id" // Mantenido ('M'/'F')
        options={[ { id: "M", name: "Masculino" }, { id: "F", name: "Femenino" }]}
        onChange={handleChange}
        error={localErrors['gender' as keyof typeof localErrors]} // Acceso seguro a errores
        required
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "35%" }}>
          <Select label="País" name="prefix_phone" error={localErrors['prefix_phone' as keyof typeof localErrors]} required={true} value={formState?.prefix_phone || ''} onChange={handleChange} options={PREFIX_COUNTRY} optionLabel={isMac ? "name" : "label"} optionValue="id" />
        </div>
        <div style={{ width: "65%" }}>
          <Input label="Número de whatsApp" type="number" name="phone" required={true} error={localErrors['phone' as keyof typeof localErrors]} value={formState?.phone || ''} onChange={handleChange} />
        </div>
      </div>
      <Input label="Cédula de identidad" name="ci" value={formState.ci || ''} onChange={handleChange} error={localErrors['ci' as keyof typeof localErrors]} required/>
      <Input label="Correo electrónico" name="email" value={formState.email || ''} onChange={handleChange} error={localErrors['email' as keyof typeof localErrors]} required type="email"/>
      <Input label="Repita el correo electrónico" name="rep_email" value={formState.rep_email || ''} onChange={handleChange} error={localErrors['rep_email' as keyof typeof localErrors]} required type="email"/>

      {/* --- Selects de Ubicación con nombres corregidos --- */}
      <Select
        label="Provincia"
        name="prov_code" // ** CAMBIO **
        value={formState.prov_code || ''} // ** CAMBIO **
        options={extraData?.provs || []}
        optionLabel="name"
        optionValue="code" // Mantenido de tu original (envía código)
        onChange={handleChange}
        error={localErrors['prov_code' as keyof typeof localErrors]} // Acceso seguro
        required // Añadido required si la validación lo exige
        />
      {getMuns().length > 0 && (
        <Select
            label="Municipio"
            name="mun_code" // ** CAMBIO **
            value={formState.mun_code || ''} // ** CAMBIO **
            options={getMuns()}
            optionLabel="name"
            optionValue="code" // Mantenido
            onChange={handleChange}
            error={localErrors['mun_code' as keyof typeof localErrors]} // Acceso seguro
            />
        )}
      {getDmuns().length > 0 && (
        <Select
            label="Distrito municipal"
            name="dist_code" // ** CAMBIO **
            value={formState.dist_code || ''} // ** CAMBIO **
            options={getDmuns()}
            optionLabel="name"
            optionValue="code" // Mantenido
            onChange={handleChange}
            error={localErrors['dist_code' as keyof typeof localErrors]} // Acceso seguro
            />
        )}
      {getLocals().length > 0 && (
        <Select
            label="Localidad"
            name="local_code" // ** CAMBIO **
            value={formState.local_code || ''} // ** CAMBIO **
            options={getLocals()}
            optionLabel="name"
            optionValue="code" // Mantenido
            onChange={handleChange}
            error={localErrors['local_code' as keyof typeof localErrors]} // Acceso seguro
            />
        )}
      {getRecints().length > 0 && (
        <Select
            label="Recinto"
            name="recint_code" // ** CAMBIO **
            value={formState.recint_code || ''} // ** CAMBIO **
            options={getRecints()}
            optionLabel="name"
            optionValue="code" // Mantenido
            onChange={handleChange}
            error={localErrors['recint_code' as keyof typeof localErrors]} // Acceso seguro
            />
        )}
         {/* Input de dirección comentado como en tu original */}
      {/* <Input label="Dirección" name="address" value={formState.address || ''} onChange={handleChange} error={localErrors.address} /> */}
    </DataModal>
  );
};

export default RenderForm;