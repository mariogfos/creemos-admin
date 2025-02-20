import Input from "@/mk/components/forms/Input/Input";
import InputFullName from "@/mk/components/forms/InputFullName/InputFullName";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import styles from "./DirectAffiliates.module.css";
import React, { useEffect, useState } from "react";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import { useAuth } from "../../mk/contexts/AuthProvider";
import useAxios from "@/mk/hooks/useAxios";

const AddLeader = ({ open, onClose, execute, showToast, reLoad }: any) => {
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const [formState, setFormState]: any = useState({});
  // const [inputBarr, setInputBarr]: any = useState(false);
  const [lbarrios, setLbarrios] = useState([]);

  const { data: listas } = useAxios("/listas", "GET", {
    fullType: "L",
    perPage: -1,
  });
  const { data: dptos } = useAxios("/dptos", "GET", {
    fullType: "L",
    perPage: -1,
  });
  const { data: muns } = useAxios("/muns", "GET", {
    fullType: "L",
    perPage: -1,
  });
  const { data: barrios } = useAxios("/barrios", "GET", {
    fullType: "L",
    perPage: -1,
  });
  // console.log("USER", formState);
  useEffect(() => {
    let obj: any = { prefix_phone: "598" };
    if (user?.role.level == 2) {
      obj = {
        ...obj,
        lista_id: user?.datos?.lista_id || null,
      };
    } else if (user?.role.level == 3) {
      obj = {
        ...obj,
        lista_id: user?.datos?.lista_id || null,
        dpto_id: user?.datos?.dpto_id || null,
      };
    } else if (user?.role.level == 4) {
      obj = {
        ...obj,
        lista_id: user?.datos?.lista_id || null,
        dpto_id: user?.datos?.dpto_id || null,
        mun_id: user?.datos?.mun_id || null,
      };
    } else if (user?.role.level == 5) {
      obj = {
        ...obj,
        lista_id: user?.datos?.lista_id || null,
        dpto_id: user?.datos?.dpto_id || null,
        mun_id: user?.datos?.mun_id || null,
        barrio_id: user?.datos?.barrio_id || null,
      };
    }

    setFormState({ ...formState, ...obj });
  }, []);

  const validate = (field: any = "") => {
    let errors: any = {};
    // if (field != "") {
    //   errors = { ...errors };
    //   delete errors[field];
    // }

    if (field == "" || field == "ci") {
      errors = checkRules({
        value: formState.ci,
        rules: ["required", "number", "ci"],
        key: "ci",
        errors,
      });
    }
    if (field == "" || field === "reCi") {
      errors = checkRules({
        value: formState.reCi,
        rules: ["required", "max:11", "same:ci"],
        key: "reCi",
        errors,
        data: formState,
      });
    }
    if (field == "" || field == "name") {
      errors = checkRules({
        value: formState.name,
        rules: ["required", "alpha"],
        key: "name",
        errors,
      });
    }
    if (field == "" || field == "middle_name") {
      errors = checkRules({
        value: formState.middle_name,
        rules: ["alpha"],
        key: "middle_name",
        errors,
      });
    }
    if (field == "" || field == "mother_last_name") {
      errors = checkRules({
        value: formState.mother_last_name,
        rules: ["alpha"],
        key: "mother_last_name",
        errors,
      });
    }
    if (field == "" || field == "last_name") {
      errors = checkRules({
        value: formState.last_name,
        rules: ["required", "alpha"],
        key: "last_name",
        errors,
      });
    }
    if (field == "" || field == "phone") {
      errors = checkRules({
        value: formState.phone,
        rules: ["required", "number", "min:8"],
        key: "phone",
        errors,
      });
    }
    if (user?.role?.level <= 1) {
      if ((field == "" || field == "lista_id") && !formState.lista_id) {
        errors = { ...errors, lista_id: "El campo es requerido" };
      }
    }
    if (user?.role?.level <= 2) {
      if ((field == "" || field == "dpto_id") && !formState.dpto_id) {
        errors = { ...errors, dpto_id: "El campo es requerido" };
      }
    }
    if (user?.role?.level <= 3) {
      if ((field == "" || field == "mun_id") && !formState.mun_id) {
        errors = { ...errors, mun_id: "El campo es requerido" };
      }
    }

    if (lbarrios.length > 0) {
      errors = checkRules({
        value: formState.barrio_id,
        rules: ["required"],
        key: "barrio_id",
        errors,
      });
    }

    setErrors(errors);
    return errors;
  };
  const _onExist = async (type = "ci") => {
    const { data: response } = await execute("/aff-exist", "GET", {
      searchBy:
        type == "email"
          ? formState.email
          : type == "phone"
          ? formState.phone
          : formState.ci,
      type: type,
      cols: "id",
    });
    if (response?.data != null) {
      if (type == "email") {
        setErrors({ ...errors, email: "El email ya existe" });
        return;
      } else if (type == "phone") {
        setErrors({ ...errors, phone: "El teléfono ya existe" });

        return;
      } else {
        setErrors({ ...errors, ci: "El CI ya existe" });
        return;
      }
    }
    validate(type);
  };
  const onSave = async () => {
    if (hasErrors(validate())) return;
    const { data } = await execute("pre-register", "POST", {
      name: formState.name,
      middle_name: formState.middle_name,
      last_name: formState.last_name,
      mother_last_name: formState.mother_last_name,
      ci: formState.ci,
      sponsor_id: null,
      prefix_phone: formState.prefix_phone,
      phone: formState.phone,
      email: formState.email,
      lista_id: formState.lista_id,
      dpto_id: formState.dpto_id,
      mun_id: formState.mun_id,
      barrio_id: formState.barrio_id,
      position: 0,
    });

    if (data?.success == true) {
      setFormState({});
      setErrors({});
      onClose();
      reLoad();
      showToast("Lider registrado con éxito", "success");
    } else {
      console.log("Error", data?.errors);
      setErrors(data?.errors);
      showToast("Ocurrió un error " + data?.errors, "error");
    }
  };
  const handleChangeInput = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };
  const isMac = navigator.platform.toUpperCase().includes("MAC");

  const getMuns = () => {
    let data: any = [];
    if (muns?.data.length > 0) {
      muns?.data.find((item: any) => {
        if (item.dpto_id == formState.dpto_id) {
          data.push(item);
        }
      });
    }

    return data;
  };

  // const getBarrios = () => {
  //   // let data: any = [{ id: -1, name: "Otro" }];
  //   let data: any = [];
  //   if (barrios?.data.length > 0) {
  //     barrios?.data.find((item: any) => {
  //       if (item.mun_id == formState.mun_id) {
  //         data.push(item);
  //       }
  //     });
  //   }
  //   return data;
  // };
  useEffect(() => {
    // let data: any = [{ id: -1, name: "Otro" }];
    let data: any = [];
    // if (barrios?.data.length > 0) {
    barrios?.data.find((item: any) => {
      if (item.mun_id == formState.mun_id) {
        console.log("ENTROO");
        data.push(item);
      }
    });
    setLbarrios(data);
    // }
    console.log(data);
  }, [formState?.mun_id]);
  console.log(lbarrios);

  // console.log(extraData?.data?.barrios);
  // useEffect(() => {
  //   getBarrios();
  // }, [formState.mun_id]);
  console.log(formState);
  return (
    <DataModal
      title="Nuevo líder de red"
      open={open}
      onClose={onClose}
      onSave={onSave}
    >
      <Input
        type="text"
        name="ci"
        label="Cédula de identidad"
        error={errors}
        value={formState?.ci}
        onBlur={() => _onExist("ci")}
        onChange={handleChangeInput}
      />
      <Input
        name="reCi"
        label="Repetir cédula de identidad"
        error={errors}
        value={formState?.reCi}
        onChange={handleChangeInput}
      />
      <InputFullName
        errors={errors}
        value={formState}
        name="full_name"
        onChange={handleChangeInput}
      />
      {user?.role?.level <= 1 && (
        <Select
          label="Organización"
          name="lista_id"
          error={errors}
          // disabled={precarga?.lista_id}
          required={true}
          value={formState["lista_id"]}
          onChange={handleChangeInput}
          // options={getListas() || []}
          options={listas?.data || []}
          className="appearance-none"
        />
      )}
      {user?.role?.level <= 2 && (
        <Select
          label="Departamento"
          name="dpto_id"
          // disabled={precarga?.dpto_id}
          error={errors}
          required={true}
          value={formState["dpto_id"]}
          onChange={handleChangeInput}
          options={dptos?.data || []}
          className="appearance-none"
        />
      )}
      {user?.role?.level <= 3 && (
        <Select
          label="Municipio"
          name="mun_id"
          // disabled={precarga?.mun_id}
          error={errors}
          // required={level > 4}
          value={formState["mun_id"]}
          onChange={handleChangeInput}
          options={getMuns() || []}
          className="appearance-none"
        />
      )}

      {user?.role?.level <= 4 && lbarrios.length > 0 && (
        <>
          <Select
            label="Barrios"
            name="barrio_id"
            error={errors}
            value={formState["barrio_id"]}
            onChange={handleChangeInput}
            options={lbarrios || []}
            className="appearance-none"
          />
          {/* 
          {inputBarr && (
            <Input
              label="Barrio"
              type="text"
              name="barrio"
              required={true}
              error={errors}
              value={formState["barrio"]}
              onChange={handleChangeInput}
            />
          )} */}
        </>
      )}
      {/* <Input
        name="email"
        label="Correo electrónico"
        error={errors}
        value={formState?.email}
        onChange={handleChangeInput}
      />
      <Input
        name="reEmail"
        label="Repetir correo electrónico"
        error={errors}
        value={formState?.reEmail}
        onChange={handleChangeInput}
      /> */}
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
            // selectOptionsClassName={styles.selectOptions}
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
            // onFocus={() => setFocusDisabled(true)}
            // onBlur={() => {
            //   _onExist("phone");
            //   validate("phone");
            // }}
          />
        </div>
      </div>
    </DataModal>
  );
};

export default AddLeader;
