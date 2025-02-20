import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useEffect, useState } from "react";
import CardActivity from "./CardActivity";
import Select from "@/mk/components/forms/Select/Select";
import Input from "@/mk/components/forms/Input/Input";
import Radio from "@/mk/components/forms/Ratio/Radio";
import TextArea from "@/mk/components/forms/TextArea/TextArea";
import styles from "../Activities.module.css";
import { UploadFile } from "@/mk/components/forms/UploadFile/UploadFile";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import ModalDestiny from "./ModalDestiny";
import { useAuth } from "@/mk/contexts/AuthProvider";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";

const RenderForm = ({
  onClose,
  open,
  item,
  setItem,
  // errors,
  extraData,
  user,
  execute,
  // setErrors,
  reLoad,
  action,
  openList,
  setOpenList,
}: any) => {
  const [formState, setFormState]: any = useState({
    ...item,
  });
  useEffect(() => {
    if (action != "edit") {
      setFormState({
        ...item,
        activity_mode: "P",
        location: "",
      });
    }
  }, []);

  useEffect(() => {
    if (formState?.activity_mode == "V" && action != "edit") {
      setFormState({
        ...formState,
        location: "",
        address: "",
      });
    }
    if (formState?.activity_mode == "P" && action != "edit") {
      setFormState({
        ...formState,
        location: "",
      });
    }
  }, [formState?.activity_mode]);
  const { showToast } = useAuth();
  const [errors, setErrors]: any = useState({});
  const [openDestiny, setOpenDestiny] = useState(false);
  const [ldestinys, setLdestinys]: any = useState([]);

  const handleChangeInput = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
    if (e.target.name == "destiny" && value > 0) {
      setOpenDestiny(true);
      if (formState.destiny != value) {
        setFormState({
          ...formState,
          lDestiny: [],
          [e.target.name]: value,
        });
      }
    }
  };
  useEffect(() => {
    let lDestinies: any = formState.lDestiny || [];
    if (action == "edit" && !formState.lDestiny) {
      formState?.cdestinies?.map((d: any) => {
        if (formState?.destiny == 2) {
          lDestinies.push(d.lista_id);
        }
        if (formState?.destiny == 3) {
          lDestinies.push(d.dpto_id);
        }
        if (formState?.destiny == 4) {
          lDestinies.push(d.mun_id);
        }
        if (formState?.destiny == 5) {
          lDestinies.push(d.barrio_id);
        }
      });
    }
    setLdestinys(lDestinies);
  }, [action, formState.lDestiny]);

  const lDestinies = () => {
    const level = user?.role.level;
    const r = [];
    if (level == 1 || level == 0) {
      r.push({ id: 0, name: "Todos" });
    }
    if (level == 2) r.push({ id: 0, name: "Mi organización" });
    if (level == 3) r.push({ id: 0, name: "Mi departamento" });
    if (level == 4) r.push({ id: 0, name: "Mi municipio" });
    // if (level == 4) r.push({ id: 0, name: "Mi localidad" });
    if (level == 5) r.push({ id: 0, name: "Mi barrio" });

    if (level <= 1) r.push({ id: 2, name: "Organización" });
    if (level <= 2) r.push({ id: 3, name: "Departamento" });
    if (level <= 3) r.push({ id: 4, name: "Municipo" });
    // if (level <= 4) r.push({ id: 5, name: "Localidad" });
    // if (level <= 5) r.push({ id: 5, name: "Barrio" });
    return r;
  };
  const selDestinies = (value: any) => {
    let selDestinies = [];
    if (value == 2) selDestinies = extraData?.listas;
    if (value == 3) selDestinies = extraData?.dptos;
    if (value == 4) selDestinies = extraData?.muns;
    // if (value == 5) selDestinies = extraData.barrios;

    return selDestinies;
  };

  const getGabinete = () => {
    let gabinete: any = [];
    extraData?.gabinete.map((item: any) => {
      gabinete.push({ id: item.user_id, name: getFullName(item) });
    });
    return gabinete;
  };
  // console.log(formState);
  const getDestinysNames = () => {
    let des: any = [];
    if (formState?.destiny == 0) {
      return (des = ["Todos"]);
    }
    if (formState?.destiny > 0) {
      selDestinies(formState?.destiny)
        .filter((d: any) => ldestinys?.includes(d.id))
        .map((d: any) => des.push(d.name));
      return des;
    }
    return des;
  };

  const validate = (field: any = "") => {
    let errors: any = {};

    errors = checkRules({
      value: formState?.destiny,
      rules: ["required"],
      key: "destiny",
      errors,
    });
    errors = checkRules({
      value: formState?.begin_at,
      rules: ["required", "futureDate"],
      key: "begin_at",
      errors,
    });
    errors = checkRules({
      value: formState?.end_at,
      rules: ["required", "greaterDate", "greaterDate:begin_at"],
      key: "end_at",
      errors,
      data: formState,
    });

    errors = checkRules({
      value: formState?.activity_type,
      rules: ["required"],
      key: "activity_type",
      errors,
    });
    errors = checkRules({
      value: formState?.activity_mode,
      rules: ["required"],
      key: "activity_mode",
      errors,
    });

    if (formState?.activity_mode == "P") {
      errors = checkRules({
        value: formState?.address,
        rules: ["required"],
        key: "address",
        errors,
      });
    }
    errors = checkRules({
      value: formState?.location,
      rules: ["required"],
      key: "location",
      errors,
    });
    errors = checkRules({
      value: formState?.volunteer_count,
      rules: ["required"],
      key: "volunteer_count",
      errors,
    });
    errors = checkRules({
      value: formState?.date_limit,
      rules: ["required", "lessDate:begin_at", "greaterDate"],
      key: "date_limit",
      errors,
      data: formState,
    });
    errors = checkRules({
      value: formState?.name,
      rules: ["required"],
      key: "name",
      errors,
    });
    errors = checkRules({
      value: formState?.description,
      rules: ["required"],
      key: "description",
      errors,
    });
    errors = checkRules({
      value: formState?.coordinator_id,
      rules: ["required"],
      key: "coordinator_id",
      errors,
    });
    if (action == "add") {
      errors = checkRules({
        value: formState?.avatar,
        rules: ["required"],
        key: "avatar",
        errors,
      });
    }

    setErrors(errors);
    return errors;
  };

  const onSave = async () => {
    let method = formState.id ? "PUT" : "POST";
    if (hasErrors(validate())) return;
    const { data } = await execute(
      "/activities" + (formState.id ? "/" + formState.id : ""),
      method,
      {
        lDestiny: formState?.lDestiny,
        destiny: formState?.destiny,
        begin_at: formState?.begin_at,
        end_at: formState?.end_at,
        activity_type: formState?.activity_type,
        activity_mode: formState?.activity_mode,
        address: formState?.address,
        location: formState?.location,
        // participants: formState?.participants,
        volunteer_count: formState?.volunteer_count,
        date_limit: formState?.date_limit,
        name: formState?.name,
        description: formState?.description,
        coordinator_id: formState?.coordinator_id,
        avatar: formState?.avatar,
      }
    );

    if (data?.success == true) {
      onClose();
      reLoad();
      showToast(data.message, "success");
    } else {
      showToast(data.message, "error");
    }
  };

  return (
    <DataModal
      className={styles.RenderForm}
      open={open}
      onClose={onClose}
      title="Crear actividad"
      onSave={onSave}
    >
      <CardActivity
        style={{ flexDirection: "row" }}
        title="Destino"
        styleSubtitle={{
          color: formState?.lDestiny?.length > 0 ? "var(--cSuccess)" : "",
        }}
        subtitle={
          formState?.lDestiny?.length > 0
            ? getDestinysNames().toString()
            : "Escoge el lugar donde quieres que aparezca la actividad para que los afiliados puedan participar como voluntarios"
        }
      >
        <div style={{ marginTop: 8 }}>
          <Select
            name="destiny"
            style={{ width: 200 }}
            label="Público"
            value={formState?.destiny}
            options={lDestinies()}
            onChange={handleChangeInput}
            error={errors}
          />
        </div>
      </CardActivity>
      <CardActivity
        style={{ flexDirection: "row" }}
        title="Tipo de actividad"
        subtitle="Define la naturaleza de la iniciativa que deseas organizar con tu equipo  y los afiliados"
      >
        <Select
          name="activity_type"
          style={{ width: 200 }}
          label="Tipo de actividad"
          value={formState?.activity_type}
          options={[
            { id: "T", name: "Taller" },
            { id: "C", name: "Capacitación" },
            { id: "R", name: "Reuniones" },
            { id: "V", name: "Voluntariado" },
          ]}
          onChange={handleChangeInput}
          error={errors}
        />
      </CardActivity>
      <CardActivity title="Modalidad">
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <Radio
            label="Presencial"
            checked={formState.activity_mode == "P"}
            onChange={() => setFormState({ ...formState, activity_mode: "P" })}
            disabled={action == "edit"}
          />
          <Radio
            label="Virtual"
            checked={formState.activity_mode == "V"}
            onChange={() => setFormState({ ...formState, activity_mode: "V" })}
            disabled={action == "edit"}
          />
        </div>
        {formState?.activity_mode == "P" && (
          <Input
            label="Lugar de la actividad"
            name="address"
            value={formState?.address}
            onChange={handleChangeInput}
            error={errors}
          />
        )}

        <Input
          type="text"
          label={
            formState?.activity_mode == "P"
              ? "Link de la ubicación"
              : "Link de la reunión"
          }
          name="location"
          value={formState?.location}
          onChange={handleChangeInput}
          error={errors}
        />

        {/* {formState?.modalidad == "P" && (
          <Input
            label="Link de la Reunion"
            name="location"
            value={formState?.link}
            onChange={handleChangeInput}
            error={errors}
          />
        )} */}
      </CardActivity>

      <CardActivity title="Fecha de actividad">
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            type="datetime-local"
            label="Fecha y hora de inicio"
            name="begin_at"
            value={formState?.begin_at}
            onChange={handleChangeInput}
            error={errors}
          />
          <Input
            type="datetime-local"
            label="Fecha y hora de fin"
            name="end_at"
            value={formState?.end_at}
            onChange={handleChangeInput}
            error={errors}
          />
        </div>
      </CardActivity>
      <CardActivity
        title="Fecha límite de inscripción"
        subtitle="Define hasta cuándo pueden inscribirse los afiliados"
        style={{ flexDirection: "row" }}
      >
        <div style={{ marginTop: 8, width: 400 }}>
          <Input
            type="datetime-local"
            label="Fecha límite de inscripción"
            name="date_limit"
            value={formState?.date_limit}
            onChange={handleChangeInput}
            error={errors}
          />
        </div>
      </CardActivity>
      <CardActivity
        title="Coordinador"
        subtitle="Selecciona a una persona que sea responsable para que la actividad se cumpla con éxito."
      >
        <Select
          name="coordinator_id"
          label="Coordinador"
          value={formState?.coordinator_id}
          options={getGabinete()}
          onChange={handleChangeInput}
          error={errors}
        />
      </CardActivity>
      <CardActivity
        title="Cantidad de participantes"
        subtitle="Indica el número máximo de participantes que se pueden inscribir para la actividad"
        style={{ flexDirection: "row" }}
      >
        <div style={{ marginTop: 8 }}>
          <Input
            type="number"
            label="Cantidad de participantes"
            name="volunteer_count"
            style={{ width: 200 }}
            value={formState?.volunteer_count}
            onChange={handleChangeInput}
            error={errors}
          />
        </div>
      </CardActivity>

      <CardActivity title="Información general">
        <Input
          name="name"
          label="Nombre de la actividad"
          value={formState?.name}
          onChange={handleChangeInput}
          error={errors}
        />
        <TextArea
          name="description"
          label="Descripción de la actividad"
          value={formState?.description}
          onChange={handleChangeInput}
          error={errors}
          isLimit={true}
          maxLength={5000}
        />
      </CardActivity>

      <CardActivity
        title="Imagen referencia"
        subtitle="Sube una imagen de la actividad"
      >
        <UploadFile
          name="avatar"
          // value={formState?.avatar}
          value={
            item?.id
              ? getUrlImages(
                  "/" + "ACTIVITY" + "-" + item?.id + ".webp?" + item.updated_at
                )
              : ""
          }
          onChange={handleChangeInput}
          label={"Subir una imagen"}
          error={errors}
          ext={["jpg", "png", "jpeg", "webp"]}
          setError={setErrors}
          img={true}
          item={formState}
          // editor={}
          // sizePreview={_field.sizePreview}
          // autoOpen={data?.action == "add"}
        />
      </CardActivity>

      {openDestiny && (
        <ModalDestiny
          open={openDestiny}
          onClose={() => {
            setOpenDestiny(false);
          }}
          selDestinies={selDestinies(formState?.destiny)}
          formState={{ ...formState, lDestiny: ldestinys }}
          setFormState={setFormState}
          showToast={showToast}
          // onSave={getMeta}
        />
      )}
    </DataModal>
  );
};

export default RenderForm;
