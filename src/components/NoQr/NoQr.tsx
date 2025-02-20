import Input from "@/mk/components/forms/Input/Input";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import useAxios from "@/mk/hooks/useAxios";
import { getDateStrMes } from "@/mk/utils/date";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import React, { useState } from "react";
import styles from "./NoQr.module.css";
import LevelAvatar from "./LevelAvatar";
import { useAuth } from "../../mk/contexts/AuthProvider";
import { AvatarV2 } from "@/mk/components/ui/Avatar/AvatarV2";

const NoQr = ({ open, onClose, idEvent }: any) => {
  const [errors, setErrors] = useState({});
  const [formState, setFormState]: any = useState({});
  const { showToast } = useAuth();
  const progress =
    (formState?.leagues?.[0]?.points / formState?.leagues?.[0]?.nextlevel) *
    100;

  const [openAffiliate, setOpenAffiliate] = useState(false);
  const { execute } = useAxios();
  const handleChange = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };

  const validate = () => {
    let errors: any = {};

    errors = checkRules({
      value: formState.ci,
      rules: ["required"],
      key: "ci",
      errors,
    });

    setErrors(errors);
    return errors;
  };

  const onExist = async () => {
    if (hasErrors(validate())) return;
    const { data, error } = await execute("/aff-exist", "GET", {
      type: "ci",
      searchBy: formState.ci,
      extra: 1,
    });
    console.log("onExist: ", data);
    if (data?.data) {
      setFormState(data?.data);
      setOpenAffiliate(true);
    } else {
      setErrors({
        ci: "Afiliado no encontrado. Verifica la cédula de identidad.",
      });
    }
  };
  //   console.log(formState, "formState");
  //   console.log(progress);

  const onSave = async () => {
    const { data } = await execute("/attendance", "POST", {
      type: "S",
      affiliate_id: formState.id,
      event_id: idEvent,
    });
    if (data?.success === true) {
      setOpenAffiliate(false);
      setFormState({});
      showToast(data?.message, "success");
    } else {
      showToast(data?.message, "info");
    }
  };

  let porcentageBar =
    (formState?.leagues?.[0]?.points / formState?.leagues?.[0]?.nextlevel) *
    100;

  return (
    <div className={styles.NoQr}>
      <DataModal
        open={open}
        onClose={onClose}
        onSave={onExist}
        fullScreen
        title="Registrar sin Elekta QR"
        buttonText="Buscar afiliado"
        buttonCancel=""
      >
        <p style={{ marginBottom: 16, color: "var(--cBlackV2)", fontSize: 14 }}>
          Ingresa el número de cédula para encontrar al afiliado y registrar su
          asistencia Cédula de identidad
        </p>
        <Input
          label="Cédula de identidad"
          name="ci"
          type="text"
          onChange={handleChange}
          value={formState?.ci}
          error={errors}
        />
      </DataModal>
      <DataModal
        open={openAffiliate}
        onClose={() => {
          setOpenAffiliate(false);
          setFormState({});
        }}
        onSave={onSave}
        buttonCancel=""
        buttonText="Confirmar asistencia"
        title="Afiliado encontrado"
      >
        <div
          style={{
            backgroundColor: "var(--cBlackV1)",
            borderRadius: 16,
            textAlign: "center",
            padding: 12,
            marginBottom: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <AvatarV2
            src={getUrlImages(
              "/AFF-" + formState?.id + ".webp?d=" + formState?.updated_at
            )}
            w={96}
            h={96}
            name={getFullName(formState)}
            percentageLevelBar={porcentageBar}
          >
            <LevelAvatar level={formState?.leagues?.[0]?.name} />
          </AvatarV2>

          <p
            style={{
              color: "var(--cWhite)",
              fontSize: 16,

              marginTop: 12,
            }}
          >
            {getFullName(formState)}
          </p>
          <p style={{ color: "var(--cBlackV2)", fontSize: 14, marginTop: 4 }}>
            Afiliado el {getDateStrMes(formState?.created_at)}
          </p>
          <p style={{ color: "var(--cInfo)", fontSize: 12, marginTop: 4 }}>
            {!formState?.sponsor_id && <span>Lider del </span>}
            {formState?.barrio}
          </p>
        </div>
      </DataModal>
    </div>
  );
};

export default NoQr;
