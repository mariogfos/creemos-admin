"use client";
import Input from "@/mk/components/forms/Input/Input";
import InputFullName from "@/mk/components/forms/InputFullName/InputFullName";
import Select from "@/mk/components/forms/Select/Select";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { useUsers } from "./useUsers";
import styles from "./users.module.css";
import useAxios from "@/mk/hooks/useAxios";
import { PREFIX_COUNTRY } from "@/mk/utils/string";
import NotAccess from "@/components/auth/NotAccess/NotAccess";

type PropsType = {
  open: any;
  onClose: any;
  precarga?: any;
  reLoad?: any;
};

const AddUsers = ({ open, onClose, precarga = null, reLoad }: PropsType) => {
  const {
    user,
    formState,
    errorsUsers,
    roles,
    listsApi,
    handleChangeInput,
    onSave,
    _onClose,
    _onExist,
    isTablet,
    level,
    inputBarr,
    waiting,
    // focusDisabled,
    // setFocusDisabled,
    validate,
    userCan,
    setFormState,
  } = useUsers({ onClose, precarga, reLoad });
  const { data: datos } = useAxios("/users", "GET", {
    fullType: "EXTRA",
    todos: 1,
  });

  const getMuns = () => {
    let data: any = [];
    if (listsApi?.data?.muns.length > 0) {
      listsApi?.data.muns.find((item: any) => {
        if (item.dpto_id == formState.dpto_id) {
          data.push(item);
        }
      });
    }
    return data;
  };
  // const getLocals = () => {
  //   let data: any = [];
  //   if (listsApi?.data?.locals.length > 0) {
  //     listsApi?.data.locals.find((item: any) => {
  //       if (item.mun_id == formState.mun_id) {
  //         data.push(item);
  //       }
  //     });
  //   }
  //   return data;
  // };
  const getBarrios = () => {
    // let data: any = [{ id: -1, name: "Otro" }];
    let data: any = [];
    if (listsApi?.data?.barrios.length > 0) {
      listsApi?.data.barrios.find((item: any) => {
        if (item.mun_id == formState.mun_id) {
          data.push(item);
        }
      });
    }
    return data;
  };
  // const getListas = () => {
  //   let data: any = [];
  //   if (listsApi?.data?.listas.length > 0) {
  //     listsApi?.data.listas.find((item: any) => {
  //       if (item.sublema_id == formState.sublema_id) {
  //         data.push(item);
  //       }
  //     });
  //   }
  //   return data;
  // };

  const getDatos = (entidad: any) => {
    if (entidad == "sublema") {
      let item = datos?.data?.sublemas.find(
        (item: any) => item.id == user.datos.sublema_id
      );
      return item?.name || "";
    }
    if (entidad == "lista") {
      let item = datos?.data?.listas.find(
        (item: any) => item.id == user.datos.lista_id
      );
      return item?.name || "";
    }
    if (entidad == "dpto") {
      let item = datos?.data?.dptos.find(
        (item: any) => item.id == user.datos.dpto_id
      );
      return item?.name || "";
    }
    if (entidad == "mun") {
      let item = datos?.data?.muns.find(
        (item: any) => item.id == user.datos.mun_id
      );
      return item?.name || "";
    }
    // if (entidad == "local") {
    //   let item = datos?.data?.locals.find(
    //     (item: any) => item.id == user.datos.local_id
    //   );
    //   return item?.name || "";
    // }
    if (entidad == "barrio") {
      let item = datos?.data?.barrios.find(
        (item: any) => item.id == user.datos.barrio_id
      );
      return item?.name || "";
    }
  };
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const filterRoles = (type: any) => {
    let rolesFil: any = [];
    const userLevel = user?.role?.level;
    if (userLevel) {
      if (type == "A") {
        rolesFil = roles?.filter(
          (item: any) =>
            (item.level == userLevel || item.level == userLevel + 1) &&
            item.is_fixed == 1
        );
      } else {
        rolesFil = roles?.filter((item: any) => item.level == userLevel);
      }
    } else {
      console.log("El usuario no tiene nivel definido");
    }

    return rolesFil;
  };
  return (
    <DataModal
      open={open}
      onClose={() => _onClose()}
      fullScreen={isTablet}
      onSave={onSave}
      buttonText={userCan("users", "C") ? "Agregar" : ""}
      buttonCancel=""
      // disabled={Object.keys(errorsUsers).length > 0 || focusDisabled}
      disabled={Object.keys(errorsUsers).length > 0}
    >
      {!userCan("users", "C") ? (
        <NotAccess />
      ) : (
        <div style={{ marginTop: 16 }}>
          <h1>{`Registrar nuevo integrante`}</h1>
          {waiting > 0 ||
            (user?.role?.level > 1 && (
              <p className={styles["tSubtitle"]}>
                Estas registrando en
                <span>
                  {/* {user?.role?.level > 1 && ` ${getDatos("sublema")}`} */}
                  {user?.role?.level > 1 && ` ${getDatos("lista")}`}
                  {user?.role?.level > 2 && ` / ${getDatos("dpto")}`}
                  {user?.role?.level > 3 && ` / ${getDatos("mun")}`}
                  {/* {user?.role?.level > 5 && ` / ${getDatos("local")}`} */}
                  {user?.role?.level > 4 && ` / ${getDatos("barrio")}`}
                </span>
              </p>
            ))}
          <Select
            label="Rol "
            name="role_id"
            error={errorsUsers}
            required={true}
            disabled={precarga?.level && precarga.line == 2}
            value={formState["role_id"]}
            onChange={handleChangeInput}
            options={filterRoles(precarga.line == 1 ? "G" : "A") || []}
            // options={roles?.data || []}
            optionLabel="name"
            optionValue="id"
            className="appearance-none"
          />

          {/* {formState.role_id !== null &&
            user?.role?.level <= 1 &&
            level > 1 && (
              <Select
                label="Sublema"
                name="sublema_id"
                error={errorsUsers}
                disabled={precarga?.sublema_id}
                required={true}
                value={formState["sublema_id"]}
                onChange={handleChangeInput}
                options={listsApi?.data?.sublemas || []}
                className="appearance-none"
              />
            )} */}
          {formState.role_id !== null &&
            user?.role?.level <= 1 &&
            level > 1 && (
              <Select
                label="Organización"
                name="lista_id"
                error={errorsUsers}
                disabled={precarga?.lista_id}
                required={true}
                value={formState["lista_id"]}
                onChange={handleChangeInput}
                // options={getListas() || []}
                options={listsApi?.data?.listas || []}
                className="appearance-none"
              />
            )}
          {formState.role_id !== null &&
            user?.role?.level <= 2 &&
            level > 2 && (
              <Select
                label="Departamento"
                name="dpto_id"
                disabled={precarga?.dpto_id}
                error={errorsUsers}
                required={true}
                value={formState["dpto_id"]}
                onChange={handleChangeInput}
                options={listsApi?.data?.dptos || []}
                className="appearance-none"
              />
            )}
          {formState.role_id !== null &&
            user?.role?.level <= 3 &&
            level > 3 && (
              <Select
                label="Municipio"
                name="mun_id"
                disabled={precarga?.mun_id}
                error={errorsUsers}
                required={level > 4}
                value={formState["mun_id"]}
                onChange={handleChangeInput}
                options={getMuns() || []}
                className="appearance-none"
              />
            )}

          {/* {formState.role_id !== null &&
            user?.role?.level <= 4 &&
            level > 4 && (
              <Select
                label="Localidad"
                name="local_id"
                disabled={precarga?.local_id}
                error={errorsUsers}
                required={level > 4}
                value={formState["local_id"]}
                onChange={handleChangeInput}
                options={getLocals() || []}
                className="appearance-none"
              />
            )} */}

          {formState.role_id !== null &&
            user?.role?.level <= 4 &&
            level > 4 && (
              <>
                <Select
                  label="Barrios"
                  name="barrio_id"
                  error={errorsUsers}
                  disabled={precarga?.barrio_id}
                  required={level > 5}
                  value={formState["barrio_id"]}
                  onChange={handleChangeInput}
                  options={getBarrios() || []}
                  className="appearance-none"
                />

                {inputBarr && (
                  <Input
                    label="Barrio"
                    type="text"
                    name="barrio"
                    required={true}
                    error={errorsUsers}
                    value={formState["barrio"]}
                    // disabled={existCi}
                    onChange={handleChangeInput}
                  />
                )}
              </>
            )}
          <Input
            label="Cédula de identidad"
            type="text"
            name="ci"
            className="mt-5"
            error={errorsUsers}
            required={true}
            value={formState["ci"]}
            onChange={handleChangeInput}
            onBlur={() => {
              _onExist("ci");
              validate("ci");
            }}
            maxLength={11}
          />
          <Input
            label="Repetir cédula de identidad"
            name="reCi"
            required={true}
            error={errorsUsers}
            value={formState["reCi"]}
            // disabled={existCi}
            onChange={handleChangeInput}
            onBlur={() => validate("reCi")}
            maxLength={11}
          />
          {/* <div className="mb-2 ">
            <InputPassword
              label="Contraseña"
              required={true}
              name="password"
              // disabled={existCi}
              error={errorsUsers}
              value={formState.password}
              onChange={handleChangeInput}
              onBlur={() => validate("password")}
            />
          </div>
          <div className="mb-2 ">
            <InputPassword
              label="Repetir contraseña"
              required={true}
              name="repPassword"
              // disabled={existCi}
              error={errorsUsers}
              value={formState.repPassword}
              onChange={handleChangeInput}
              onBlur={() => validate("repPassword")}
            />
          </div> */}
          <InputFullName
            name="full_name"
            errors={errorsUsers}
            //disabled={existCi}
            value={formState}
            onChange={handleChangeInput}
            onBlur={validate}
          />
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            required={true}
            error={errorsUsers}
            value={formState["email"]}
            // disabled={existCi}
            onChange={handleChangeInput}
            onBlur={() => {
              _onExist("email");
              validate("email");
            }}
          />
          <Input
            label="Repetir correo electrónico"
            name="reEmail"
            required={true}
            error={errorsUsers}
            value={formState["reEmail"]}
            // disabled={existCi}
            onChange={handleChangeInput}
            onBlur={() => validate("reEmail")}
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
                error={errorsUsers}
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
                error={errorsUsers}
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
          <div className={styles.addUsersText}>
            {/* <div>
              Enviaremos un código de acceso al correo proporcionado para que
              pueda ingresar a la plataforma
            </div>
            <div>
              Si no encuentras el código en tu buzón, revisa la carpeta de spam
              o correos no deseados. Si el código no está allí, la dirección de
              email podría ser incorrecta o no existir.
            </div> */}
          </div>
        </div>
      )}
    </DataModal>
  );
};

export default AddUsers;
