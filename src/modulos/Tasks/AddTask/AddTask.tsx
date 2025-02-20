import DataModal from "@/mk/components/ui/DataModal/DataModal";
import React, { useState } from "react";
import styles from "./AddTask.module.css";
import CardTask from "./CardTask";
import TextArea from "@/mk/components/forms/TextArea/TextArea";
import Input from "@/mk/components/forms/Input/Input";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import { useAuth } from "@/mk/contexts/AuthProvider";
type PropsType = {
  open: boolean;
  onClose: any;
  item?: any;
  reLoad: any;
  execute?: any;
  activity?: any;
  volunters: any;
};

const AddTask = ({
  open,
  onClose,
  item,
  reLoad,
  execute,
  activity,
  volunters,
}: PropsType) => {
  const [formState, setFormState]: any = useState({ ...item });
  const { showToast } = useAuth();
  const [errors, setErrors] = useState({});
  const handleInputChange = (e: any) => {
    let value = e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };

  const validate = (field: any = "") => {
    let errors: any = {};

    errors = checkRules({
      value: formState?.description,
      rules: ["required"],
      key: "description",
      errors,
    });
    errors = checkRules({
      value: formState?.volunteer_count,
      rules: ["required"],
      key: "volunteer_count",
      errors,
    });
    errors = checkRules({
      value: formState?.points,
      rules: ["required"],
      key: "points",
      errors,
    });
    errors = checkRules({
      value: formState?.begin_at,
      rules: ["required", "greaterDate"],
      key: "begin_at",
      errors,
    });

    errors = checkRules({
      value: formState?.begin_at,
      rules: ["greaterDate:begin_at"],
      key: "begin_at",
      errors,
      data: { begin_at: activity?.begin_at },
    });

    errors = checkRules({
      value: formState?.end_at,
      rules: ["required", "greaterDate", "greaterDate:begin_at"],
      key: "end_at",
      errors,
      data: formState,
    });
    errors = checkRules({
      value: formState?.end_at,
      rules: ["lessDate:end_at"],
      key: "end_at",
      errors,
      data: { end_at: activity?.end_at },
    });
    errors = checkRules({
      value: formState?.requirements,
      rules: ["required"],
      key: "requirements",
      errors,
    });

    errors = checkRules({
      value: formState?.address,
      rules: ["required"],
      key: "address",
      errors,
    });

    errors = checkRules({
      value: formState?.location,
      rules: ["required"],
      key: "location",
      errors,
    });

    setErrors(errors);
    return errors;
  };

  const onSave = async () => {
    let method = formState.id ? "PUT" : "POST";
    if (hasErrors(validate())) return;

    if (
      volunters + Number(formState?.volunteer_count) >
      activity.volunteer_count
    ) {
      showToast("Los voluntarios sobrepasan a los de la actividad", "error");
      return;
    }
    const { data } = await execute(
      "/tasks" + (formState.id ? "/" + formState.id : ""),
      method,
      {
        description: formState?.description,
        volunteer_count: formState?.volunteer_count,
        points: formState?.points,
        begin_at: formState?.begin_at,
        end_at: formState?.end_at,
        requirements: formState?.requirements,
        address: formState?.address,
        location: formState?.location,
        coordinator_id: activity?.coordinator_id,
        activity_id: activity?.id,
      },
      false,
      true
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
      title="Crear tarea"
      open={open}
      onClose={onClose}
      className={styles.AddTask}
      onSave={onSave}
      buttonText={formState.id ? "Actualizar" : "Crear tarea"}
    >
      <CardTask title="Descripción de la tarea">
        <TextArea
          name="description"
          label="Descripcion"
          value={formState?.description}
          onChange={handleInputChange}
          error={errors}
        />
      </CardTask>
      <CardTask
        title="Cantidad de voluntarios"
        subtitle="Indica el número de afiliados que necesitas para realizar esta tarea"
        style={{ flexDirection: "row" }}
      >
        <Input
          name="volunteer_count"
          label="Voluntarios"
          value={formState?.volunteer_count}
          onChange={handleInputChange}
          error={errors}
          style={{ width: 300 }}
        />
      </CardTask>
      <CardTask
        title="Gamificación"
        subtitle="Establece los puntos que ganará el voluntario al completar la tarea"
        style={{ flexDirection: "row" }}
      >
        <Input
          name="points"
          label="Puntos"
          value={formState?.points}
          onChange={handleInputChange}
          error={errors}
          style={{ width: 300 }}
        />
      </CardTask>
      <CardTask title="Fecha de actividad">
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            type="datetime-local"
            label="Fecha y hora de inicio"
            name="begin_at"
            value={formState?.begin_at}
            onChange={handleInputChange}
            error={errors}
          />
          <Input
            type="datetime-local"
            label="Fecha y hora de fin"
            name="end_at"
            value={formState?.end_at}
            onChange={handleInputChange}
            error={errors}
          />
        </div>
      </CardTask>
      <CardTask
        title="Requisitos"
        subtitle="Escribe los requisitos que los voluntarios necesitan cumplir para poder realizar la tarea"
      >
        <TextArea
          name="requirements"
          label="Descripcion"
          value={formState?.requirements}
          onChange={handleInputChange}
          error={errors}
        />
      </CardTask>
      <CardTask
        title="Ubicación"
        subtitle="Si la tarea tiene una ubicación específica para que se haga, coloca el link aquí"
      >
        <Input
          name="address"
          label="Nombre del lugar"
          value={formState?.address}
          onChange={handleInputChange}
          error={errors}
        />
        <Input
          name="location"
          label="Link de la ubicación"
          value={formState?.location}
          onChange={handleInputChange}
          error={errors}
        />
      </CardTask>
    </DataModal>
  );
};

export default AddTask;
