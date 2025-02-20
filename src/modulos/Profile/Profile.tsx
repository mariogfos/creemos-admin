"use client";
import { useAuth } from "@/mk/contexts/AuthProvider";
import useAxios from "@/mk/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import InputFullName from "@/mk/components/forms/InputFullName/InputFullName";
import styles from "./profile.module.css";
import { checkRules, hasErrors } from "@/mk/utils/validate/Rules";
import Authentication from "./Authentication";
import DataModal from "@/mk/components/ui/DataModal/DataModal";
import { resizeImage } from "@/mk/utils/images";
import {
  IconEmail,
  IconGallery,
  IconLook,
} from "@/components/layout/icons/IconsBiblioteca";
import NotAccess from "@/components/auth/NotAccess/NotAccess";

const Profile = () => {
  const { user, getUser, showToast, setStore, userCan, logout } = useAuth();
  const [formState, setFormState]: any = useState({});
  const [errors, setErrors] = useState({});
  const [preview, setPreview]: any = useState(null);
  const { execute } = useAxios();
  const [editProfile, setEditProfile] = useState(false);
  const [oldEmail, setOldEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [type, setType] = useState("");
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [onLogout, setOnLogout] = useState(false);

  useEffect(() => {
    setStore({
      title: "Mi perfil",
    });
  }, []);

  useEffect(() => {
    setFormState((prevState: any) => ({ ...prevState, ...user }));
  }, [user]);

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

    errors = checkRules({
      value: formState.email,
      rules: ["required", "email"],
      key: "email",
      errors,
    });

    setErrors(errors);
    return errors;
  };

  const _onExistEmail = async () => {
    if (formState.email === oldEmail || formState.email === "") {
      setIsDisabled(false);
      return;
    }
    setErrors({});
    const { data: response } = await execute("/adm-exist", "GET", {
      searchBy: formState.email,
      type: "email",
      cols: "id,email",
    });
    setIsDisabled(false);
    setOldEmail(formState.email);
    if (response?.data != null && response?.data.email !== user.email) {
      setErrors({ email: "El email ya existe" });
      return;
    }
  };

  const onSave = async () => {
    if (!userCan("profile", "U")) {
      showToast("No tienes permisos para realizar esta acción", "error");
      return;
    }
    if (hasErrors(validate())) return;
    const newUser = {
      ci: formState.ci,
      name: formState.name,
      middle_name: formState.middle_name,
      last_name: formState.last_name,
      mother_last_name: formState.mother_last_name,
      phone: formState.phone,
      avatar: formState.avatar,
      address: formState.address,
      email: formState.email,
    };

    const { data, error: err } = await execute(
      "/users/" + user.id,
      "PUT",
      newUser
    );

    if (data?.success == true) {
      getUser();
      showToast("Cambios guardados exitosamente", "success");
    } else {
      console.log("error:", err);
      setErrors(err.data?.errors);
    }
    setEditProfile(false);
    setOpenProfileModal(false);
  };

  const onCancel = () => {
    setEditProfile(false);
    setFormState(user);
    setErrors({});
    setOpenProfileModal(false);
    setPreview(null);
  };

  const onChangeFile = async (e: any) => {
    setPreview(null);
    setFormState({ ...formState, avatar: "" });
    try {
      const file = e.target.files[0];
      if (
        !["png", "jpg", "jpeg", "PNG"].includes(
          file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
        )
      ) {
        showToast("Solo se permiten imágenes png, jpg, jpeg", "error");
        return;
      }
      const image: any = await resizeImage(file, 720, 1024, 0.7);
      let base64String = image.replace("data:", "").replace(/^.+,/, "");
      base64String = encodeURIComponent(base64String);
      setPreview(image);
      setFormState({ ...formState, avatar: base64String });
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const { result }: any = e.target;

      //   let base64String = result.replace("data:", "").replace(/^.+,/, "");
      //   base64String = encodeURIComponent(base64String);
      //   console.log("base64String original", base64String);
      //   // setPreview(result);
      //   // setFormState({ ...formState, avatar: base64String });
      // };

      // reader.onerror = (error) => console.log("reader error", error);
      // reader.readAsDataURL(file);
    } catch (error) {
      setPreview(null);
      setFormState({ ...formState, avatar: "" });
    }
  };

  const onEditProfile = () => {
    setOpenProfileModal(true);
  };

  const onChangeEmail = () => {
    setType("M"); // M para modificar email
    setOpenAuthModal(true);
  };

  const onChangePassword = () => {
    setType("P"); // P para cambiar contraseña
    setOpenAuthModal(true);
  };

  if (!userCan("profile", "R", "mobile")) return <NotAccess />;

  return (
    <div className={styles.profile}>
      <div>
        <div>
          <Avatar
            name={getFullName(user)}
            src={
              preview ||
              getUrlImages("/ADM-" + user?.id + ".webp?d=" + user?.updated_at)
            }
            w={100}
            h={100}
          >
            {editProfile && (
              <label htmlFor="imagePerfil">
                <IconGallery size={42} color={"var(--cWhite)"} />
              </label>
            )}
          </Avatar>
          {/* <input
            type="file"
            id="imagePerfil"
            className="hidden"
            onChange={onChangeFile}
          /> */}
          <div>
            <p>{getFullName(user)}</p>
            <p>
              {user?.role?.name} {user?.entidad?.name}
            </p>
          </div>
        </div>

        <div>
          <div>
            <h2>Información personal</h2>
            <a onClick={onEditProfile}>Editar</a>
          </div>
          <div>
            <p>Cédula de identidad</p>
            <p>{user?.ci}</p>
          </div>
          <div>
            <p>Número de WhatsApp</p>
            <p>
              {user?.prefix_phone ? <>+{user?.prefix_phone} </> : <></>}
              {user?.phone}
            </p>
          </div>
          <div>
            <p>Correo electrónico</p>
            <p>{user?.email}</p>
          </div>
        </div>
        <div>
          <div>
            <h2>Ajustes de seguridad</h2>
          </div>
          <div
            onClick={onChangeEmail}
            style={{
              cursor: "pointer",
            }}
          >
            <IconEmail />
            <p>Cambiar correo electrónico</p>
          </div>
          <div
            onClick={onChangePassword}
            style={{
              cursor: "pointer",
            }}
          >
            <IconLook />
            <p>Cambiar contraseña</p>
          </div>
        </div>
        <div>
          <p onClick={() => setOnLogout(true)}>Cerrar sesión</p>
        </div>
      </div>
      <DataModal
        open={onLogout}
        title="Cerrar sesión"
        onClose={() => {
          setOnLogout(false);
        }}
        buttonText="Cerrar sesión"
        buttonCancel="Cancelar"
        onSave={() => logout()}
      >
        <p className={styles.modalLogout}>
          ¿Estás seguro de que deseas cerrar sesión?
        </p>
      </DataModal>
      {openProfileModal && (
        <DataModal
          open={openProfileModal}
          onClose={onCancel}
          title="Editar información personal"
          onSave={onSave}
          buttonText="Guardar cambios"
          buttonCancel=""
        >
          <div className={styles.profileModal}>
            <Avatar
              name={getFullName(user)}
              src={
                preview ||
                getUrlImages("/ADM-" + user?.id + ".webp?d=" + user?.updated_at)
              }
              w={100}
              h={100}
              className={styles.avatar}
            >
              {openProfileModal && (
                <label
                  htmlFor="imagePerfil"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <IconGallery size={42} color={"var(--cWhite)"} />
                </label>
              )}
            </Avatar>

            <input
              type="file"
              id="imagePerfil"
              className="hidden"
              accept=".png,.jpeg,.jpg,.webp"
              onChange={onChangeFile}
            />
          </div>
          <div style={{ marginTop: "32px" }}>
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
      )}
      {openAuthModal && (
        <Authentication
          open={openAuthModal}
          onClose={() => setOpenAuthModal(false)}
          type={type}
          formState={formState}
          setFormState={setFormState}
          errors={errors}
          setErrors={setErrors}
          execute={execute}
          getUser={getUser}
          user={user}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default Profile;
