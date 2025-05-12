import Input from "@/mk/components/forms/Input/Input";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState, useEffect } from "react";

const RenderForm = ({
  open,
  onClose,
  item,
  setItem,
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
    if (item && item.id !== formState.id || JSON.stringify(item) !== JSON.stringify(formState)) {
        setFormStateLocal({ ...item });
        setLocalErrors({});
    }
  }, [item]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormStateLocal((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setLocalErrors((prev: any) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    let currentErrors: any = {};
    currentErrors = checkRules({ value: formState.name, rules: ["required"], key: "name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.middle_name, rules: [""], key: "middle_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.last_name, rules: ["required"], key: "last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.mother_last_name, rules: [""], key: "mother_last_name", errors: currentErrors });
    currentErrors = checkRules({ value: formState.ci, rules: ["required"], key: "ci", errors: currentErrors });
    currentErrors = checkRules({ value: formState.email, rules: ["required", "email"], key: "email", errors: currentErrors });
    currentErrors = checkRules({ value: formState.rep_email, rules: ["required", "same:email"], key: "rep_email", errors: currentErrors, data: formState });
    currentErrors = checkRules({ value: formState?.gender, rules: ["required"], key: "gender", errors: currentErrors });
    currentErrors = checkRules({ value: formState.phone, rules: ["required"], key: "phone", errors: currentErrors });
    
    setLocalErrors(currentErrors);
    return currentErrors;
  };

  const onSaveInternal = async () => {
    const currentLocalErrors = validate();
    if (hasErrors(currentLocalErrors)) {
      return;
    }

    const payload = { ...formState };
    delete payload._initItem;
    delete payload.rep_email;

    let method = payload.id ? "PUT" : "POST";
    const { data: response } = await execute(
      "/supporters" + (payload.id ? "/" + payload.id : ""),
      method,
      payload,
      false
    );

    if (response?.success == true) {
      if (reLoad) reLoad();
      if (reLoadExtra) reLoadExtra();
      if (setItem) setItem(payload);

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

  const getMuns = () => { if (!formState.prov_id) return []; return ( extraData?.muns.filter( (mun: any) => mun?.prov_code == Number(formState.prov_id) ) || [] ); };
  const getDmuns = () => { if (!formState.mun_id) return []; return ( extraData?.dists.filter( (dmun: any) => dmun?.mun_code == Number(formState.mun_id) ) || [] ); };
  const getLocals = () => { if (!formState?.dist_id) return []; return ( extraData?.locals.filter( (local: any) => local?.dist_code == Number(formState.dist_id) || local?.mun_code == Number(formState.mun_id) ) || [] ); };
  const getRecints = () => { if (!formState.local_id) return []; return ( extraData?.recints.filter( (rec: any) => rec?.local_code == Number(formState.local_id) ) || [] ); };

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
        name="birth_date" 
        type="date" 
        value={formState.birth_date || ''} 
        onChange={handleChange} 
        error={localErrors}
        style={{ colorScheme: 'light' }}
      />
      <Select
        label="Tipo de Militante"
        name="militant_type"
        value={formState?.militant_type || ''}
        optionLabel="name"
        optionValue="id"
        options={extraData?.militanses || []}
        onChange={handleChange}
        error={localErrors}
      />
      <Select
        label="Genero"
        name="gender"
        value={formState?.gender || ''}
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