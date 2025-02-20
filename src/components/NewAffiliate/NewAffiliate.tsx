import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useState } from "react";
import styles from "./NewAffiliate.module.css";
import Select from "@/mk/components/forms/Select/Select";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import Input from "@/mk/components/forms/Input/Input";
import useAxios from "@/mk/hooks/useAxios";
import ListAffiliates from "./ListAffiliates";
import { useAuth } from "@/mk/contexts/AuthProvider";

type PropsType = {
  open: boolean;
  close: (e?: any) => any;
  eventId: number;
};

const NewAffiliate = ({ open, close, eventId }: PropsType) => {
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const { execute } = useAxios();
  const [data, setData]: any = useState({});
  const { showToast } = useAuth();

  const handleChangeInput = (e: any) => {
    let value = e.target.value;
    if (e.target.type == "checkbox") {
      value = e.target.checked ? "Y" : "N";
    }
    setFormState({ ...formState, [e.target.name]: value });
  };

  const searchSponsor = async () => {
    const { data } = await execute("/affiliates", "GET", {
      ci: formState.ci,
      prefix_phone: formState.prefix_phone,
      phone: formState.phone,
      name: formState.name,
      last_name: formState.last_name,
      fullType: "BP",
    });
    if (data?.success == true) {
      if (data?.length === 0)
        showToast(
          "Error al buscar el patrocinador. Intente nuevamente.",
          "info"
        );
      setData(data);
    } else {
      showToast("Error al buscar el patrocinador. Intente nuevamente.", "info");
    }
  };

  // console.log(data, "data");

  const buttonDisabled = () => {
    return (
      !formState.prefix_phone &&
      !formState.phone &&
      !formState.name &&
      !formState.last_name &&
      !formState.ci
    );
  };

  return (
    <>
      <DataModal
        open={open}
        onClose={() => close()}
        title="Nuevo afilliado"
        fullScreen={true}
        buttonText={"Buscar patrocinador"}
        disabled={buttonDisabled()}
        buttonCancel=""
        onSave={searchSponsor}
      >
        <div className={styles.containerNewAffiliate}>
          <h1>¿Quién lo invitó al evento?</h1>
          <p>
            Este afiliado fue recomendado por alguien. Ingresa el nombre o
            cédula de identidad del patrocinador.
          </p>
          <Input
            label="Nombre"
            type="text"
            name="name"
            // required={true}
            error={errors}
            value={formState["name"]}
            onChange={handleChangeInput}
          />
          <Input
            label="Apellido"
            type="text"
            name="last_name"
            // required={true}
            error={errors}
            value={formState["last_name"]}
            onChange={handleChangeInput}
          />
          <Input
            label="Cédula de identidad"
            type="number"
            name="ci"
            // required={true}
            error={errors}
            value={formState["ci"]}
            onChange={handleChangeInput}
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
                // required={true}
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
                // required={true}
                error={errors}
                value={formState["phone"]}
                onChange={handleChangeInput}
              />
            </div>
          </div>
        </div>
        {data?.data?.length > 0 && (
          <ListAffiliates
            open={data?.data?.length > 0}
            close={(e: any = "") => {
              if (e == "C") close();
              setData({});
            }}
            data={data}
            eventId={eventId}
          />
        )}
      </DataModal>
    </>
  );
};

export default NewAffiliate;
