import Input from "@/mk/components/forms/Input/Input";
import InputFullName from "@/mk/components/forms/InputFullName/InputFullName";
import Select from "@/mk/components/forms/Select/Select";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useEffect, useState } from "react";
import styles from "./NewAffiliate.module.css";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import SponsorCard from "./SponsorCard";
import useAxios from "@/mk/hooks/useAxios";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { on } from "events";

type PropsType = {
  open: boolean;
  close: (e?: any) => any;
  sponsorData: any;
  eventId: number;
};

const RegisterAffiliate = ({
  open,
  close,
  sponsorData,
  eventId,
}: PropsType) => {
  const [formState, setFormState]: any = useState({});
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const { execute } = useAxios();
  const { showToast, user } = useAuth();

  const [errors, setErrors] = useState({});
  const handleChangeInput = (e: any) => {
    let value = e.target.value;
    if (e.target.type == "checkbox") {
      value = e.target.checked ? "Y" : "N";
    }
    setFormState({ ...formState, [e.target.name]: value });
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };

  const validate = (field: any = "") => {
    let errors: any = {};

    errors = checkRules({
      value: formState.ci,
      rules: ["required", "max:11"],
      key: "ci",
      errors,
    });

    errors = checkRules({
      value: formState.name,
      rules: ["required", "alpha"],
      key: "name",
      errors,
    });

    errors = checkRules({
      value: formState.last_name,
      rules: ["required", "alpha"],
      key: "last_name",
      errors,
    });

    // errors = checkRules({
    //   value: formState.prefix_phone,
    //   rules: ["required", "alpha"],
    //   key: "prefix_phone",
    //   errors,
    // });

    errors = checkRules({
      value: formState.reCi,
      rules: ["required", "same:ci"],
      key: "reCi",
      errors,
      data: formState,
    });

    errors = checkRules({
      value: formState.phone,
      rules: ["required", "numeric", "max:11"],
      key: "phone",
      errors,
    });

    setErrors(errors);
    return errors;
  };

  const onCheckCI = async () => {
    const { data, error } = await execute("/aff-exist", "GET", {
      type: "ci",
      searchBy: formState.ci,
      extra: 1,
    });
    if (data?.data) {
      setErrors({
        ci: "Cédula de identidad ya registrada.",
      });
    }
  };

  useEffect(() => {
    let obj: any = {};
    const defaultCountry = PREFIX_COUNTRY.find(
      (country) => country.id === "598"
    );
    if (defaultCountry) {
      obj.prefix_phone = defaultCountry.id;
    }
    setFormState(obj);
  }, []);

  const buttonDisableModal = () => {
    return (
      !formState.ci ||
      !formState.name ||
      !formState.last_name ||
      !formState.reCi ||
      !formState.phone ||
      formState.phone.length < 8 ||
      Object.keys(errors).length > 0
    );
  };

  const onSave = async () => {
    const { data } = await execute("/pre-register", "POST", {
      name: formState.name,
      middle_name: formState.middle_name,
      last_name: formState.last_name,
      mother_last_name: formState.mother_last_name,
      ci: formState.ci,
      sponsor_id: sponsorData.id,
      prefix_phone: formState.prefix_phone,
      phone: formState.phone,
      position: -1,
      event_id: eventId,
    });
    if (data.success === true) {
      setErrors({});
      showToast("Cuenta registrada con exito", "success");
      close("C");
    } else {
      setErrors(data.message);
      showToast(data.errors.name, "error");
      close("C");
    }
  };
  return (
    <DataModal
      open={open}
      onClose={() => {
        setErrors({});
        close();
      }}
      title="Nuevo afilliado"
      fullScreen={true}
      buttonText="Crear cuenta y registrar asistencia"
      disabled={buttonDisableModal()}
      buttonCancel=""
      onSave={onSave}
    >
      <div>
        <SponsorCard sponsor={sponsorData} />
        <h1 style={{ marginBottom: 16, marginTop: 16 }}>
          Registra al nuevo afiliado
        </h1>

        <Input
          label="Cédula de identidad"
          name="ci"
          required={true}
          error={errors}
          value={formState["ci"]}
          onChange={handleChangeInput}
          onBlur={() => {
            onCheckCI();
            validate("ci");
          }}
          maxLength={11}
        />
        <Input
          label="Repetir cédula de identidad"
          name="reCi"
          required={true}
          error={errors}
          value={formState["reCi"]}
          // disabled={existCi}
          onChange={handleChangeInput}
          onBlur={() => validate("reCi")}
          maxLength={11}
        />
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "35%",
            }}
          >
            <Select
              label="País"
              name="prefix_phone"
              error={errors}
              required={true}
              value={formState["prefix_phone"]}
              onChange={handleChangeInput}
              options={PREFIX_COUNTRY}
              optionLabel={isMac ? "name" : "label"}
              optionValue="id"
              selectOptionsClassName={styles.selectOptions}
            />
          </div>
          <div
            style={{
              width: "65%",
            }}
          >
            <Input
              label="Número de whatsApp"
              type="number"
              name="phone"
              required={true}
              error={errors}
              value={formState["phone"]}
              // disabled={existCi}
              onChange={handleChangeInput}
              onBlur={() => {
                validate("phone");
              }}
              //   iconRight={<div>+{formState.prefix_phone}</div>}
            />
          </div>
        </div>
        <InputFullName
          value={formState}
          name={"full_name"}
          errors={errors}
          onChange={handleChange}
          disabled={false}
          onBlur={validate}
        />
      </div>
    </DataModal>
  );
};

export default RegisterAffiliate;
