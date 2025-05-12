"use client";

import useAxios from "@/mk/hooks/useAxios";
import React, { useEffect, useState, useRef } from "react"; // Importa useRef
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
  IconEdit
} from "@/components/layout/icons/IconsBiblioteca";
import { useAuth } from "@/mk/contexts/AuthProvider";

const Profile = () => {
  const { user, getUser, showToast, setStore, userCan, logout }: any = useAuth();
  const [formState, setFormState] = useState<any>({
    name: "",
    middle_name: "",
    last_name: "",
    mother_last_name: "",
    email: "",
    avatar: null,
    ci: "",
    phone: "",
    prefix_phone: "",
    address: "",
    code: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [preview, setPreview] = useState<any>(null);
  const { execute }: any = useAxios();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [type, setType] = useState("");
  const [onLogout, setOnLogout] = useState(false);
  const [oldEmail, setOldEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // Ref para rastrear si el título ya fue establecido por esta instancia del componente
  const titleSetRef = useRef(false);

  useEffect(() => {
    // Solo intentar establecer el título si setStore es una función
    // y no se ha establecido ya por esta instancia del componente.
    // Esto ayuda a prevenir llamadas repetidas si setStore es una referencia inestable
    // pero la intención es solo establecer el título una vez.
    if (typeof setStore === 'function' && !titleSetRef.current) {
      setStore({
        title: "Mi perfil",
      });
      titleSetRef.current = true; // Marcar que el título ha sido establecido
    }
    // Dejar setStore en el array de dependencias es correcto si ESLint lo requiere.
    // El ref previene la re-ejecución de la lógica interna, no del efecto en sí si setStore cambia.
  }, [setStore]);

  useEffect(() => {
    if (user) {
      setFormState((prevState: any) => ({
        ...prevState, // Mantiene el estado local como 'code'
        name: user.name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        mother_last_name: user.mother_last_name || "",
        email: user.email || "",
        avatar: user.avatar || null,
        ci: user.ci || "",
        phone: user.phone || "",
        prefix_phone: user.prefix_phone || "",
        address: user.address || "",
        code: "", // Reinicia el código cuando el usuario cambia
      }));
      setOldEmail(user.email || "");
      setPreview(null); // Reinicia el preview cuando el usuario cambia
    } else {
      // Opcional: Manejar el caso en que user es null (ej. después de logout)
      // setFormState({ /* estado inicial vacío */ });
      // setOldEmail("");
      // setPreview(null);
    }
  }, [user]); // Este array de dependencias es correcto.
              // Si 'user' desde useAuth() es inestable (nueva referencia en cada render
              // incluso con los mismos datos), este efecto se ejecutará en cada render de Profile.
              // Esto llama a setFormState, lo que re-renderiza Profile.
              // Este ciclo dentro de Profile no es un bucle infinito por sí mismo A MENOS QUE
              // de alguna manera active que AuthProvider genere una nueva referencia de 'user' otra vez.

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: null }));
    }
  };

  const validate = (fieldsToValidate: any[] = []) => {
    let currentErrors: any = { ...errors };

    const allFields: any[] = [
      { key: "name", rules: ["required", "alpha"] },
      { key: "last_name", rules: ["required", "alpha"] },
      { key: "email", rules: ["required", "email"] },
    ];

    if (openProfileModal) {
        allFields.push({ key: "code", rules: ["required", "numeric", "len:4"] });
    }

    let fieldsToProcess: any[] = fieldsToValidate.length > 0 ?
        allFields.filter((f: any) => fieldsToValidate.includes(f.key)) :
        allFields;

    fieldsToProcess.forEach((field: any) => {
        currentErrors = checkRules({
            value: formState[field.key],
            rules: field.rules,
            key: field.key,
            errors: currentErrors,
        });
    });
    
    // Solo actualiza errores si realmente han cambiado para evitar re-renders innecesarios
    // Esta es una optimización menor; el problema principal de "max depth" raramente es esto.
    if (JSON.stringify(errors) !== JSON.stringify(currentErrors)) {
        setErrors(currentErrors);
    }
    return currentErrors;
  };


  const _onExistEmail = async () => {
    if (!formState.email || formState.email === oldEmail) {
      setIsDisabled(false);
      return;
    }
    const { data: response }: any = await execute("/adm-exist", "GET", {
      searchBy: formState.email,
      type: "email",
      cols: "id,email",
    });
    setIsDisabled(false);
    if (response?.data != null && response?.data.email !== user.email) {
      setErrors((prevErrors: any) => ({ ...prevErrors, email: "El correo electrónico ya existe" }));
    } else {
      setErrors((prevErrors: any) => ({ ...prevErrors, email: null }));
    }
  };

  const onSave = async () => {
    if (userCan && !userCan("profile", "U")) {
      if (showToast) showToast("No tienes permisos para realizar esta acción", "error");
      return;
    }

    const validationErrors = validate(); // Llama a validate sin argumentos para validar todos los campos relevantes del modal
    if (hasErrors(validationErrors)) {
        if (showToast) showToast("Por favor, corrige los errores en el formulario.", "error");
        return;
    }

    const payload: any = {
      name: formState.name,
      middle_name: formState.middle_name || "",
      last_name: formState.last_name,
      mother_last_name: formState.mother_last_name || "",
      email: formState.email,
      code: formState.code,
    };

    if (typeof formState.avatar === "string" && formState.avatar.startsWith("data:image")) {
        payload.avatar = formState.avatar;
    } else if (formState.avatar === "") {
        payload.avatar = "";
    }

    const { data, error: err }: any = await execute(
      `/users/${user.id}`,
      "PUT",
      payload
    );

    if (data?.success === true) {
      if (getUser) await getUser();
      if (showToast) showToast("Cambios guardados exitosamente", "success");
      setOpenProfileModal(false);
      setFormState((prevState: any) => ({ ...prevState, code: "" }));
      setPreview(null);
    } else {
      console.log("Error al guardar perfil:", err);
      const backendErrors = err?.data?.errors || {};
      if (err?.data?.message) {
        if (showToast) showToast(err.data.message, "error");
      } else {
        if (showToast) showToast("Error al guardar los cambios. Inténtalo de nuevo.", "error");
      }
      setErrors((prevErrors: any) => ({ ...prevErrors, ...backendErrors }));
      if (backendErrors.code) {
         if (showToast) showToast("El código de seguridad es incorrecto.", "error");
      }
    }
  };

  const onCancel = () => {
    setOpenProfileModal(false);
    if (user) {
      setFormState((prevState: any) => ({
        ...prevState,
        ...user,
        avatar: user.avatar || null,
        code: "",
      }));
    }
    setErrors({});
    setPreview(null);
  };

  const onChangeFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["png", "jpg", "jpeg", "webp"].includes(file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase())) {
      if (showToast) showToast("Solo se permiten imágenes png, jpg, jpeg, webp", "error");
      return;
    }

    try {
      const image: any = await resizeImage(file, 720, 1024, 0.7);
      setPreview(image);
      setFormState((prevState: any) => ({ ...prevState, avatar: image })); // Asegurar que se usa prevState
    } catch (error) {
      console.error("Error procesando imagen:", error);
      if (showToast) showToast("Error al procesar la imagen.", "error");
      setPreview(null);
      setFormState((prevState: any) => ({ ...prevState, avatar: user.avatar || null })); // Asegurar que se usa prevState
    }
  };

  const onEditProfile = () => {
    if (user) {
        setFormState({ // Aquí no se necesita prevState porque se resetea con 'user'
            ...user,
            middle_name: user.middle_name || "",
            mother_last_name: user.mother_last_name || "",
            avatar: user.avatar || null,
            code: "",
        });
    }
    setErrors({});
    // @ts-ignore
    setPreview(user.avatar ? getUrlImages(typeof user.avatar === 'string' ? user.avatar : `/ADM-${user.id}.webp?d=${user.updated_at}`) : null);
    setOpenProfileModal(true);
  };

  const onChangeEmail = () => {
    if (userCan && !userCan("profile", "U")) return;
    setType("M");
    setOpenAuthModal(true);
  };

  const onChangePassword = () => {
    if (userCan && !userCan("profile", "U")) return;
    setType("P");
    setOpenAuthModal(true);
  };

  const currentAvatarSrc = () => {
    if (preview) return preview;
    if (user?.avatar) {
      if (typeof user.avatar === 'string') return getUrlImages(user.avatar);
      if (user.avatar.file && user.avatar.ext) {
          // @ts-ignore
          return getUrlImages(`/path/to/images/${user.avatar.file}.${user.avatar.ext}?d=${user?.updated_at}`);
      }
    }
    // @ts-ignore
    return getUrlImages(`/ADM-${user?.id}.webp?d=${user?.updated_at}`);
  };
  
  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainerPage}>
          <Avatar
            name={getFullName(user as any)}
            src={currentAvatarSrc()}
            w={120}
            h={120}
            className={styles.mainAvatar}
          />
        </div>
        <div className={styles.userInfoPage}>
          <h1>{getFullName(user as any)}</h1>
          <p>{user?.role?.name} {user?.entidad?.name}</p>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h2>Información Personal</h2>
            {userCan && userCan("profile", "U") && (
              <button onClick={onEditProfile} className={styles.editButton}>
                <IconEdit size={18} /> Editar
              </button>
            )}
          </div>
          <div className={styles.infoGrid}>
            <div><p className={styles.infoLabel}>Nombre Completo:</p> <p>{getFullName(user as any)}</p></div>
            {user?.ci && <div><p className={styles.infoLabel}>Cédula de identidad:</p> <p>{user.ci}</p></div>}
            {(user?.phone || user?.prefix_phone) && <div><p className={styles.infoLabel}>Número de WhatsApp:</p> <p>{user.prefix_phone ? `+${user.prefix_phone} ` : ""}{user.phone}</p></div>}
            <div><p className={styles.infoLabel}>Correo electrónico:</p> <p>{user?.email}</p></div>
          </div>
        </div>

        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <h2>Ajustes de Seguridad</h2>
          </div>
          <ul className={styles.settingsList}>
            <li onClick={userCan && userCan("profile", "U") ? onChangeEmail : undefined} className={userCan && userCan("profile", "U") ? styles.settingItem : styles.settingItemDisabled}>
              <IconEmail />
              <span>Cambiar correo electrónico</span>
            </li>
            <li onClick={userCan && userCan("profile", "U") ? onChangePassword : undefined} className={userCan && userCan("profile", "U") ? styles.settingItem : styles.settingItemDisabled}>
              <IconLook />
              <span>Cambiar contraseña</span>
            </li>
          </ul>
        </div>

        <div className={styles.logoutSection}>
          <button onClick={() => setOnLogout(true)} className={styles.logoutButton}>Cerrar sesión</button>
        </div>
      </div>

      <DataModal
        open={onLogout}
        title="Cerrar sesión"
        onClose={() => setOnLogout(false)}
        buttonText="Cerrar sesión"
        buttonCancel="Cancelar"
        onSave={logout as any}
      >
        <p className={styles.modalLogoutText}>
          ¿Estás seguro de que deseas cerrar sesión?
        </p>
      </DataModal>

      {openProfileModal && (
        <DataModal
          open={openProfileModal}
          onClose={onCancel}
          title="Editar Información Personal"
          onSave={onSave}
          buttonText="Guardar Cambios"
          buttonCancel="Cancelar"
        >
          <div className={styles.profileModalForm}>
            <div className={styles.modalAvatarSection}>
              <Avatar
                name={getFullName(formState as any)}
                src={preview || (formState.avatar && typeof formState.avatar === 'string' ? formState.avatar : currentAvatarSrc())}
                w={100}
                h={100}
              />
              <input
                type="file"
                id="imagePerfilModal"
                className="hidden"
                accept=".png,.jpeg,.jpg,.webp"
                onChange={onChangeFile}
              />
              <label htmlFor="imagePerfilModal" className={styles.uploadButtonLabel}>
                <IconGallery size={22} /> Cambiar Foto
              </label>
            </div>
            
            <InputFullName
              value={formState}
              name={"full_name"}
              errors={errors}
              onChange={handleChange}
              disabled={false}
              onBlur={(e: any) => validate([e.target.name])}
            />
            
            <div className={styles.formField}>
              <label htmlFor="emailModal" className={styles.label}>Correo Electrónico:</label>
              <input
                type="email"
                id="emailModal" name="email"
                className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                value={formState.email || ""}
                onChange={handleChange}
                onBlur={() => { validate(['email'] as any[]); _onExistEmail(); }}
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="codeModal" className={styles.label}>Código de Seguridad (4 dígitos):</label>
              <input
                type="password"
                id="codeModal" name="code"
                className={`${styles.inputField} ${errors.code ? styles.inputError : ''}`}
                value={formState.code || ""}
                onChange={handleChange}
                maxLength={4}
                placeholder="••••"
                onBlur={() => validate(['code'] as any[])}
              />
              {errors.code && <p className={styles.errorText}>{errors.code}</p>}
            </div>
          </div>
        </DataModal>
      )}

      {openAuthModal && (
        <Authentication
          open={openAuthModal}
          onClose={() => setOpenAuthModal(false)}
          type={type}
          formState={formState}
          setFormState={setFormState as any}
          errors={errors}
          setErrors={setErrors as any}
          execute={execute}
          getUser={getUser as any}
          user={user}
          showToast={showToast as any}
        />
      )}
    </div>
  );
};

export default Profile;