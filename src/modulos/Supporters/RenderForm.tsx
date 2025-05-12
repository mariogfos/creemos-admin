import Input from "@/mk/components/forms/Input/Input";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider"; // Bien para showToast
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState, useEffect } from "react"; // Añadido useEffect por si lo necesitas para sincronizar 'item'

const RenderForm = ({
  open,
  onClose,      // Prop de useCrud (onCloseCrud)
  item,         // Prop de useCrud (formState de useCrud)
  setItem,      // Prop de useCrud (setFormState de useCrud)
  execute,      // Prop de useCrud
  extraData,    // Prop de useCrud
  user,         // Prop de useCrud
  reLoadExtra,  // Prop personalizada de Supporters.js (si aún la necesitas)
  reLoad,       // Prop de useCrud
  // --- NUEVA PROP ---
  onSuccessWithQrData, 
  // --- Props de error de useCrud (opcional si manejas errores solo localmente) ---
  // errors: propErrors, 
  // setErrors: propSetErrors,
}: any) => {
  // Estado local para los datos del formulario. Se inicializa con 'item' (de useCrud).
  const [formState, setFormStateLocal] = useState({ ...item });
  // Estado local para los errores de este formulario.
  const [localErrors, setLocalErrors] = useState({});
  // const [oldEmail, setOldEmail] = useState(formState.email); // Comentado, no usado
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const { showToast } = useAuth(); // Correcto para mostrar notificaciones

  // Sincroniza el estado local del formulario si la prop 'item' cambia desde useCrud
  useEffect(() => {
    // Solo actualiza si 'item' realmente ha cambiado para evitar bucles si 'item' es siempre una nueva referencia
    if (JSON.stringify(item) !== JSON.stringify(formState)) {
      setFormStateLocal({ ...item });
    }
  }, [item]); // Dependencia: item

  const handleChange = (e: any) => {
    let value = e.target.value;
    setFormStateLocal((prev: any) => ({ ...prev, [e.target.name]: value }));
    // Si quieres limpiar el error específico al cambiar el campo:
    setLocalErrors((prev: any) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    let currentErrors: any = {};
    // Tu lógica de checkRules actualiza currentErrors...
    currentErrors = checkRules({ value: formState.name, rules: ["required"], key: "name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.middle_name, rules: [""], key: "middle_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.last_name, rules: ["required"], key: "last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.mother_last_name, rules: [""], key: "mother_last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.ci, rules: ["required"], key: "ci", errors: currentErrors });
    currentErrors = checkRules({ value: formState.email, rules: ["required", "email"], key: "email", errors: currentErrors });
    currentErrors = checkRules({ value: formState.rep_email, rules: ["required", "same:email"], key: "rep_email", errors: currentErrors, data: formState });
    currentErrors = checkRules({ value: formState?.gender, rules: ["required"], key: "gender", errors: currentErrors });
    currentErrors = checkRules({ value: formState.phone, rules: ["required"], key: "phone", errors: currentErrors });
    
    setLocalErrors(currentErrors); // Actualiza el estado de errores local
    return currentErrors;
  };

  const onSaveInternal = async () => { // Renombrado para evitar confusión con prop onSave de useCrud
    const currentLocalErrors = validate(); // Usa la validación que actualiza localErrors
    if (hasErrors(currentLocalErrors)) { // Verifica los errores locales
        console.log("RenderForm: Validación local falló", currentLocalErrors);
        return;
    }
    
    console.log("RenderForm: Validación local exitosa. Ejecutando API call...");
    let method = formState.id ? "PUT" : "POST"; // Usa el formState local
    const { data: response } = await execute(
      "/supporters" + (formState.id ? "/" + formState.id : ""),
      method,
      { ...formState }, // Envía el formState local
      false
    );
    console.log("RenderForm: Respuesta de API:", response);

    if (response?.success == true) {
      // Estas funciones son props de useCrud y afectarán al padre.
      // El remontaje de RenderForm que puedan causar ya no afectará al modal QR.
      if (reLoad) reLoad();
      if (reLoadExtra) reLoadExtra(); // Si aún la necesitas y Supporters.js la provee
      if (setItem) setItem(formState); // Actualiza el formState de useCrud con el estado local del formulario

      showToast(response?.message || "Operación exitosa", "success");
      
      // --- LÓGICA PARA EL MODAL QR ---
      if (response.data && onSuccessWithQrData) {
        console.log("RenderForm: Éxito con datos para QR. Llamando onSuccessWithQrData.", response.data);
        onSuccessWithQrData(response.data); // Llama a la función del padre (Supporters.js)
      }
      // --- FIN LÓGICA MODAL QR ---

      // Siempre cierra el modal del formulario (DataModal) después del éxito
      // Esto llama a onCloseCrud de useCrud
      onClose(); 
    } else {
      showToast(response?.message || "Error al guardar.", "error");
      // Aquí podrías querer actualizar los errores con setLocalErrors(response.errors)
      // o con propSetErrors(response.errors) si la API devuelve errores de campo.
      if (response?.errors) {
        setLocalErrors(response.errors);
        // Si también quieres que useCrud maneje estos errores:
        // if (propSetErrors) propSetErrors(response.errors); 
      }
    }
  };

  // Funciones getMuns, getDmuns, etc., usando formState (el local)
  const getMuns = () => { if (!formState.prov_id) return []; return ( extraData?.muns.filter( (mun: any) => mun?.prov_code == Number(formState.prov_id) ) || [] ); };
  const getDmuns = () => { if (!formState.mun_id) return []; return ( extraData?.dists.filter( (dmun: any) => dmun?.mun_code == Number(formState.mun_id) ) || [] ); };
  const getLocals = () => { if (!formState?.dist_id) return []; return ( extraData?.locals.filter( (local: any) => local?.dist_code == Number(formState.dist_id) || local?.mun_code == Number(formState.mun_id) ) || [] ); };
  const getRecints = () => { if (!formState.local_id) return []; return ( extraData?.recints.filter( (rec: any) => rec?.local_code == Number(formState.local_id) ) || [] ); };

  return (
    <DataModal
      open={open} // Esta prop `open` viene de useCrud y controla la visibilidad de este modal
      onClose={onClose} // Esta prop `onClose` es `onCloseCrud` de useCrud
      title={!formState.id ? "Crear simpatizante" : "Editar simpatizante"}
      onSave={onSaveInternal} // Llama a la función onSave definida localmente en RenderForm
    >
      {/* Todos tus campos de formulario usan `formState` (local) y `localErrors` */}
      <Input label="Primer nombre" name="name" value={formState.name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Segundo nombre" name="middle_name" value={formState.middle_name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Apellido paterno" name="last_name" value={formState.last_name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Apellido materno" name="mother_last_name" value={formState.mother_last_name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Fecha de nacimiento" name="birth_date" type="date" value={formState.birth_date || ''} onChange={handleChange} error={localErrors} />
      <Select
        label="Tipo de Militante"
        name="militant_type"
        value={formState?.militant_type}
        optionLabel="name"
        optionValue="id"
        options={extraData?.militanses || []}
        onChange={handleChange}
        error={localErrors}
      />
      <Select
        label="Genero"
        name="gender"
        value={formState?.gender}
        optionLabel="name"
        optionValue="id"
        options={[ { id: "M", name: "Masculino" }, { id: "F", name: "Femenino" }]}
        onChange={handleChange}
        error={localErrors}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "35%" }}>
          <Select label="País" name="prefix_phone" error={localErrors} required={true} value={formState?.prefix_phone || ''} onChange={handleChange} options={PREFIX_COUNTRY} optionLabel={isMac ? "name" : "label"} optionValue="id" />
        </div>
        <div style={{ width: "65%" }}>
          <Input label="Número de whatsApp" type="number" name="phone" required={true} error={localErrors} value={formState?.phone || ''} onChange={handleChange} />
        </div>
      </div>
      <Input label="Cédula de identidad" name="ci" value={formState.ci || ''} onChange={handleChange} error={localErrors} />
      <Input label="Correo electrónico" name="email" value={formState.email || ''} onChange={handleChange} error={localErrors} />
      <Input label="Repita el correo electrónico" name="rep_email" value={formState.rep_email || ''} onChange={handleChange} error={localErrors} />
      <Select label="Provincia" name="prov_id" value={formState.prov_id || ''} options={extraData?.provs || []} optionLabel="name" optionValue="code" onChange={handleChange} error={localErrors} />
      {getMuns().length > 0 && ( <Select label="Municipio" name="mun_id" value={formState.mun_id || ''} options={getMuns()} optionLabel="name" optionValue="code" onChange={handleChange} error={localErrors} /> )}
      {getDmuns().length > 0 && ( <Select label="Distrito municipal" name="dist_id" value={formState.dist_id || ''} options={getDmuns()} optionLabel="name" optionValue="code" onChange={handleChange} error={localErrors} /> )}
      {getLocals().length > 0 && ( <Select label="Localidad" name="local_id" value={formState.local_id || ''} options={getLocals()} optionLabel="name" optionValue="code" onChange={handleChange} error={localErrors} /> )}
      {getRecints().length > 0 && ( <Select label="Recinto" name="recint_id" value={formState.recint_id || ''} options={getRecints()} optionLabel="name" optionValue="code" onChange={handleChange} error={localErrors} /> )}
    </DataModal>
  );
};

export default RenderForm;