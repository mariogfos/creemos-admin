import Input from "@/mk/components/forms/Input/Input";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState, useEffect, useMemo } from "react";

const RenderForm = ({
  open,
  onClose,
  item,
  setItem, // setItem del useCrud para actualizar el estado global si es necesario
  execute,
  extraData,
  user,
  reLoadExtra,
  reLoad,
  onSuccessWithQrData,
}: any) => {
  const [formState, setFormStateLocal] = useState({ ...item });
  const [localErrors, setLocalErrors] = useState({});
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const { showToast } = useAuth();

  useEffect(() => {
    // Sincronizar el estado local del formulario si el 'item' prop cambia desde fuera
    if (item && (item.id !== formState.id || JSON.stringify(item) !== JSON.stringify(formState))) {
        setFormStateLocal({ ...item });
        setLocalErrors({}); // Resetear errores locales al cambiar el item
    }
  }, [item]); // Dependencia solo de 'item'

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    setFormStateLocal((prev: any) => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Lógica de reseteo en cascada para campos geográficos
      if (name === "prov_code") {
        newState.mun_code = "";
        newState.dist_code = "";
        newState.local_code = "";
        newState.recint_code = "";
      } else if (name === "mun_code") {
        newState.dist_code = "";
        newState.local_code = "";
        newState.recint_code = "";
      } else if (name === "dist_code") { // Relevante si dist_code afecta a local_code o recint_code directamente
        newState.local_code = ""; // Asumiendo que si distrito cambia, localidad podría cambiar o resetearse
        newState.recint_code = "";
      } else if (name === "local_code") {
        newState.recint_code = "";
      }
      return newState;
    });

    // Limpiar el error específico del campo que está cambiando
    setLocalErrors((prev: any) => ({ ...prev, [name]: null }));
  };

  // Funciones para obtener opciones de los selects (manteniendo tu lógica original)
  // Estas funciones determinan si un select dependiente tiene opciones y, por lo tanto, si se mostrará.
  const getMuns = () => { if (!formState.prov_code) return []; return ( extraData?.muns?.filter( (mun: any) => mun?.prov_code == Number(formState.prov_code) ) || [] ); };
  const getDmuns = () => { // Distritos municipales, típicamente para SCZ capital
    if (!formState.mun_code || !formState.prov_code) return [];
    // Asumimos que distritos solo son relevantes para Provincia SCZ (1) y Municipio SCZ (1)
    if (Number(formState.prov_code) !== 1 || Number(formState.mun_code) !== 1) return [];
    return ( extraData?.dists?.filter( (dmun: any) => dmun?.mun_code == Number(formState.mun_code) && dmun?.prov_code == Number(formState.prov_code) ) || [] );
  };
  const getLocals = () => { 
    if (!formState.mun_code || !formState.prov_code) return [];
    // En SerParteForm, localidades dependían de prov_code y mun_code.
    // Adaptando a la estructura que `extraData.locals` pueda tener:
    // Si `extraData.locals` tiene `mun_code` y `prov_code`:
    return ( extraData?.locals?.filter( (local: any) => local?.mun_code == Number(formState.mun_code) && local?.prov_code == Number(formState.prov_code) ) || [] );
    // Si `extraData.locals` solo tiene `mun_code`:
    // return ( extraData?.locals?.filter( (local: any) => local?.mun_code == Number(formState.mun_code) ) || [] );
    // Tu lógica original era: if (!formState?.dist_code) return []; return ( extraData?.locals.filter( (local: any) => local?.dist_code == Number(formState.dist_code) || local?.mun_code == Number(formState.mun_code) ) || [] );
    // Esta lógica original es un poco ambigua, la he ajustado para mayor claridad basándome en la dependencia jerárquica provincia -> municipio -> localidad.
  };
  const getRecints = () => { 
    if (!formState.local_code || !formState.mun_code || !formState.prov_code) return [];
    
    const isSczCapital = Number(formState.prov_code) === 1 && Number(formState.mun_code) === 1;

    // Si es SCZ Capital y el distrito es relevante y no está seleccionado, no mostrar recintos aún.
    if (isSczCapital && getDmuns().length > 0 && !formState.dist_code) {
        return []; // Esperar a que se seleccione distrito
    }

    return ( extraData?.recints?.filter( (rec: any) => 
        rec?.local_code == Number(formState.local_code) &&
        rec?.mun_code == Number(formState.mun_code) && // Asumiendo que recintos tienen mun_code
        rec?.prov_code == Number(formState.prov_code) && // Asumiendo que recintos tienen prov_code
        (isSczCapital && formState.dist_code ? rec?.dist_code == Number(formState.dist_code) : true) // y dist_code si es SCZ y hay distrito
      ) || [] 
    );
  };


  const validate = () => {
    let currentErrors: any = {};
    // Validaciones estándar
    currentErrors = checkRules({ value: formState.name, rules: ["required"], key: "name", errors: currentErrors });
    // middle_name es opcional según tu regla [""]
    currentErrors = checkRules({ value: formState.middle_name, rules: [""], key: "middle_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.last_name, rules: ["required"], key: "last_name", errors: currentErrors });
    // mother_last_name es opcional
    currentErrors = checkRules({ value: formState.mother_last_name, rules: [""], key: "mother_last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.ci, rules: ["required"], key: "ci", errors: currentErrors });
    currentErrors = checkRules({ value: formState.email, rules: ["required", "email"], key: "email", errors: currentErrors });
    currentErrors = checkRules({ value: formState.rep_email, rules: ["required", "same:email"], key: "rep_email", errors: currentErrors, data: formState });
    currentErrors = checkRules({ value: formState?.gender, rules: ["required"], key: "gender", errors: currentErrors });
    currentErrors = checkRules({ value: formState.phone, rules: ["required"], key: "phone", errors: currentErrors });
    currentErrors = checkRules({ value: formState.birthdate, rules: ["required"], key: "birthdate", errors: currentErrors });
    currentErrors = checkRules({ value: formState.prefix_phone, rules: ["required"], key: "prefix_phone", errors: currentErrors });
     // militancy_id podría ser opcional o requerido dependiendo de tu lógica de negocio
    currentErrors = checkRules({ value: formState.militancy_id, rules: [""], key: "militancy_id", errors: currentErrors });


    // Validaciones condicionales para campos geográficos
    let provRules = [];
    if (extraData?.provs && extraData.provs.length > 0) {
      provRules.push("required");
    }
    currentErrors = checkRules({ value: formState.prov_code, rules: provRules, key: "prov_code", errors: currentErrors });

    let munRules = [];
    if (formState.prov_code && getMuns().length > 0) {
      munRules.push("required");
    }
    currentErrors = checkRules({ value: formState.mun_code, rules: munRules, key: "mun_code", errors: currentErrors });

    // Distrito Municipal: Requerido solo para SCZ Capital si hay opciones
    let distRules = [];
    const isSczCapital = Number(formState.prov_code) === 1 && Number(formState.mun_code) === 1;
    if (isSczCapital && getDmuns().length > 0) {
      distRules.push("required");
    }
    currentErrors = checkRules({ value: formState.dist_code, rules: distRules, key: "dist_code", errors: currentErrors });

    let localRules = [];
    if (formState.mun_code && getLocals().length > 0) { // Asumiendo que localidad depende de municipio
      localRules.push("required");
    }
    currentErrors = checkRules({ value: formState.local_code, rules: localRules, key: "local_code", errors: currentErrors });
    
    let recintRules = [];
    if (formState.local_code && getRecints().length > 0) { // Asumiendo que recinto depende de localidad
        // Si es SCZ Capital y los distritos son relevantes y hay un distrito seleccionado (o no hay distritos aplicables)
        if (isSczCapital) {
            if (getDmuns().length > 0 && formState.dist_code) { // Si hay distritos y uno está seleccionado
                 recintRules.push("required");
            } else if (getDmuns().length === 0) { // Si no hay distritos para SCZ capital (improbable pero cubre el caso)
                 recintRules.push("required");
            }
            // Si hay distritos pero ninguno seleccionado, el error debería estar en dist_code
        } else { // No es SCZ Capital
            recintRules.push("required");
        }
    }
    currentErrors = checkRules({ value: formState.recint_code, rules: recintRules, key: "recint_code", errors: currentErrors });

    setLocalErrors(currentErrors);
    return currentErrors;
  };

  const onSaveInternal = async () => {
    const currentLocalErrors = validate();
    if (hasErrors(currentLocalErrors)) {
      showToast("Por favor, corrija los errores en el formulario.", "error"); // Mensaje genérico
      return;
    }

    const payload = { ...formState };
    delete payload._initItem; // Común en useCrud para limpiar el item inicial de tracking
    delete payload.rep_email; // Campo solo para validación UI
    delete payload.created_at; // Gestionado por el backend
    delete payload.updated_at; // Gestionado por el backend
    
    // Asegurarse que los códigos numéricos se envíen como números si el backend lo espera
    if (payload.prov_code) payload.prov_code = Number(payload.prov_code);
    if (payload.mun_code) payload.mun_code = Number(payload.mun_code);
    if (payload.dist_code) payload.dist_code = Number(payload.dist_code); else delete payload.dist_code; // Enviar null o no enviar si está vacío
    if (payload.local_code) payload.local_code = Number(payload.local_code);
    if (payload.recint_code) payload.recint_code = Number(payload.recint_code);
    if (payload.militancy_id) payload.militancy_id = Number(payload.militancy_id);


    let method = payload.id ? "PUT" : "POST";
    const { data: response } = await execute(
      "/supporters" + (payload.id ? "/" + payload.id : ""),
      method,
      payload,
      false //  spinner
    );

    if (response?.success == true) {
      if (reLoad) reLoad();
      if (reLoadExtra) reLoadExtra(); // Si necesitas recargar datos como contadores, etc.
      // setItem(payload); // Opcional: setItem es del hook useCrud, podría actualizar la lista sin recargarla completa

      showToast(response?.message || "Operación exitosa", "success");
      
      if (response.data && onSuccessWithQrData) {
        onSuccessWithQrData(response.data); // Para mostrar el QR si es una creación exitosa
      }
      
      onClose(); 
    } else {
      showToast(response?.message || "Error al guardar.", "error");
      if (response?.errors) { // Si el backend devuelve errores de campo
        setLocalErrors(response.errors);
      }
    }
  };

  const munsOptions = useMemo(getMuns, [formState.prov_code, extraData?.muns]);
  const dmunsOptions = useMemo(getDmuns, [formState.mun_code, formState.prov_code, extraData?.dists]);
  const localsOptions = useMemo(getLocals, [formState.mun_code, formState.prov_code, /*formState.dist_code,*/ extraData?.locals]);
  const recintsOptions = useMemo(getRecints, [formState.local_code, formState.mun_code, formState.prov_code, formState.dist_code, extraData?.recints]);


  return (
    <DataModal
      open={open}
      onClose={onClose}
      title={!formState.id ? "Crear simpatizante" : "Editar simpatizante"}
      onSave={onSaveInternal}
    >
      <Input label="Primer nombre" name="name" value={formState.name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Segundo nombre" name="middle_name" value={formState.middle_name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Apellido paterno" name="last_name" value={formState.last_name || ''} onChange={handleChange} error={localErrors} />
      <Input label="Apellido materno" name="mother_last_name" value={formState.mother_last_name || ''} onChange={handleChange} error={localErrors} />
      <Input 
        label="Fecha de nacimiento" 
        name="birthdate" 
        type="date" 
        value={formState.birthdate || ''} 
        onChange={handleChange} 
        error={localErrors}
        // style={{ colorScheme: 'light' }} // Puedes manejar esto con CSS global si es necesario
      />
      <Select
        label="Tipo de Militante"
        name="militancy_id"
        value={formState?.militancy_id || ''}
        optionLabel="name"
        optionValue="id"
        options={extraData?.militanses || []}
        onChange={handleChange}
        error={localErrors}
      />
      <Select
        label="Género"
        name="gender"
        value={formState?.gender || ''}
        optionLabel="name"
        optionValue="id"
        options={[ { id: "M", name: "Masculino" }, { id: "F", name: "Femenino" }]}
        onChange={handleChange}
        error={localErrors}
      />
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}> {/* alignItems para alinear labels si difieren */}
        <div style={{ width: "35%" }}>
          <Select 
            label="País" 
            name="prefix_phone" 
            error={localErrors} 
            value={formState?.prefix_phone || '591'} // Default a Bolivia si está vacío
            onChange={handleChange} 
            options={PREFIX_COUNTRY} 
            optionLabel={isMac ? "name" : "label"} 
            optionValue="id" 
          />
        </div>
        <div style={{ width: "65%" }}>
          <Input 
            label="Número de WhatsApp" 
            type="number" 
            name="phone" 
            error={localErrors} 
            value={formState?.phone || ''} 
            onChange={handleChange} 
          />
        </div>
      </div>
      <Input label="Cédula de identidad" name="ci" value={formState.ci || ''} onChange={handleChange} error={localErrors} />
      <Input label="Correo electrónico" name="email" value={formState.email || ''} onChange={handleChange} error={localErrors} />
      <Input label="Repita el correo electrónico" name="rep_email" value={formState.rep_email || ''} onChange={handleChange} error={localErrors} />
      
      <Select 
        label="Provincia" 
        name="prov_code" 
        value={formState.prov_code || ''} 
        options={extraData?.provs || []} 
        optionLabel="name" 
        optionValue="code" // Asumiendo que el valor es 'code' como en SerParteForm
        onChange={handleChange} 
        error={localErrors} 
      />
      
      {munsOptions.length > 0 && ( 
        <Select 
            label="Municipio" 
            name="mun_code" 
            value={formState.mun_code || ''} 
            options={munsOptions} 
            optionLabel="name" 
            optionValue="code" 
            onChange={handleChange} 
            error={localErrors} 
        /> 
      )}

      {dmunsOptions.length > 0 && ( // Solo se muestra si hay distritos (ej. SCZ Capital)
        <Select 
            label="Distrito municipal" 
            name="dist_code" 
            value={formState.dist_code || ''} 
            options={dmunsOptions} 
            optionLabel="name" 
            optionValue="code" 
            onChange={handleChange} 
            error={localErrors} 
        /> 
      )}

      {localsOptions.length > 0 && ( 
        <Select 
            label="Localidad" 
            name="local_code" 
            value={formState.local_code || ''} 
            options={localsOptions} 
            optionLabel="name" 
            optionValue="code" 
            onChange={handleChange} 
            error={localErrors} 
        /> 
      )}

      {recintsOptions.length > 0 && ( 
        <Select 
            label="Recinto" 
            name="recint_code" 
            value={formState.recint_code || ''} 
            options={recintsOptions} 
            optionLabel="name" 
            optionValue="code" 
            onChange={handleChange} 
            error={localErrors} 
        /> 
      )}
    </DataModal>
  );
};

export default RenderForm;