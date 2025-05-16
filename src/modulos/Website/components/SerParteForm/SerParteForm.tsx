import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import styles from './SerParteForm.module.css';
import { IconoChevronAbajo } from '../../Website'; // Asegúrate que la ruta sea correcta
import { PREFIX_COUNTRY } from '@/mk/utils/string';


// Interfaz para los datos de las áreas geográficas
interface AreaItem {
  code: string | number;
  name: string;
  prov_code?: string | number;
  mun_code?: string | number;
  local_code?: string | number;
  dist_code?: string | number;
}

interface AreasData {
  provs: AreaItem[];
  muns: AreaItem[];
  dists: AreaItem[];
  locals: AreaItem[];
  recints: AreaItem[];
}

interface FormDataInterface {
  primer_nombre: string;
  segundo_nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  cedula: string;
  correo: string;
  whatsapp: string;
  address: string;
  fecha_nacimiento: string;
  provincia: string;
  municipio: string;
  distrito: string;
  localidad: string;
  recinto: string;
  genero: string;
}

interface SerParteFormProps {
  user_id?: string;
}

const SerParteForm: React.FC<SerParteFormProps> = ({ user_id }) => {
  const initialFormData: FormDataInterface = {
    primer_nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    cedula: '',
    correo: '',
    whatsapp: '',
    address: '',
    fecha_nacimiento: '',
    provincia: '',
    municipio: '',
    distrito: '',
    localidad: '',
    recinto: '',
    genero: ''
  };

  const [formData, setFormData] = useState<FormDataInterface>(initialFormData);
  const [selectedPrefix, setSelectedPrefix] = useState('591'); // Default to Bolivia
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [areaData, setAreaData] = useState<AreasData | null>(null);
  const [isLoadingAreaData, setIsLoadingAreaData] = useState(true);
  const [areaDataError, setAreaDataError] = useState<string | null>(null);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Nuevos estados para validación
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormDataInterface, string>>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchAreaData = async () => {
      setIsLoadingAreaData(true);
      setAreaDataError(null);
      const apiUrl = process.env.NEXT_PUBLIC_URL;
      if (!apiUrl) {
        console.error("API URL (NEXT_PUBLIC_API_URL) no está configurada.");
        setAreaDataError("Error de configuración: No se pudo determinar la URL de la API para cargar datos geográficos.");
        setIsLoadingAreaData(false);
        return;
      }
      try {
        const response = await axios.get<{ data: { areas: AreasData } }>(`${apiUrl}/map-metrics-public`);
        if (response.data && response.data.data && response.data.data.areas) {
            setAreaData(response.data.data.areas);
        } else {
            console.error("Estructura de respuesta inesperada de /map-metrics:", response.data);
            setAreaDataError("No se pudieron procesar los datos geográficos recibidos.");
        }
      } catch (e: any) {
        console.error("Error fetching area data:", e);
        let message = "No se pudieron cargar los datos geográficos.";
        if (axios.isAxiosError(e) && e.response) {
            message += ` (Error ${e.response.status})`;
        }
        setAreaDataError(message);
      } finally {
        setIsLoadingAreaData(false);
      }
    };
    fetchAreaData();
  }, []);

  // Función para verificar si hay opciones reales más allá del placeholder
  const hasActualOptions = (options: Array<{ value: string | number, label: string }>) => {
    if (isLoadingAreaData) return false; // Si está cargando, no hay opciones "reales" aún
    return options.some(opt => opt.value !== "" && !opt.label.toLowerCase().includes("cargando") && !opt.label.toLowerCase().includes("seleccione") && !opt.label.toLowerCase().includes("no hay") && !opt.label.toLowerCase().includes("n/a") && !opt.label.toLowerCase().includes("datos de") && !opt.label.toLowerCase().includes("primero"));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      // Lógica de reseteo en cascada
      if (name === "provincia") {
        newState.municipio = "";
        newState.distrito = "";
        newState.localidad = "";
        newState.recinto = "";
      } else if (name === "municipio") {
        newState.distrito = "";
        newState.localidad = "";
        newState.recinto = "";
      } else if (name === "distrito") {
        newState.recinto = "";
      } else if (name === "localidad") {
        newState.recinto = "";
      }
      return newState;
    });

    if (formSubmitted) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormDataInterface];
        return newErrors;
      });
    }
  };

  // --- Opciones para los selects (memoizadas y con corrección de tipos) ---
  const provinciasOptions = useMemo(() => {
    if (isLoadingAreaData) return [{ value: "", label: "Cargando provincias..." }];
    if (!areaData?.provs || areaData.provs.length === 0) return [{ value: "", label: "No hay datos de provincia" }];
    return [
      { value: "", label: "Seleccione su provincia" },
      ...areaData.provs.map(p => ({ value: String(p.code), label: p.name }))
    ];
  }, [areaData, isLoadingAreaData]);

  const municipiosOptions = useMemo(() => {
    if (!formData.provincia) return [{ value: "", label: "Seleccione provincia primero" }];
    if (isLoadingAreaData) return [{ value: "", label: "Cargando municipios..." }];
    if (!areaData?.muns) return [{ value: "", label: "Datos de municipio no disponibles" }];
    const filtered = areaData.muns.filter(m => String(m.prov_code) === formData.provincia);
    if (filtered.length === 0 && formData.provincia) return [{ value: "", label: "No hay municipios para esta provincia" }];
    return [
      { value: "", label: "Seleccione su municipio" },
      ...filtered.map(m => ({ value: String(m.code), label: m.name }))
    ];
  }, [areaData, formData.provincia, isLoadingAreaData]);

  const distritosOptions = useMemo(() => {
    if (formData.provincia !== '1' || !formData.municipio) { // Solo relevantes si provincia es SCZ y municipio seleccionado
        if (formData.provincia === '1' && !formData.municipio) {
            return [{ value: "", label: "Seleccione municipio primero" }];
        }
        return [{ value: "", label: "N/A" }]; // N/A si no es SCZ o falta municipio en SCZ
    }
    if (isLoadingAreaData) return [{ value: "", label: "Cargando distritos..." }];
    if (!areaData?.dists) return [{ value: "", label: "Datos de distrito no disponibles" }];

    if (formData.provincia === '1' && formData.municipio === '1') { // Específicamente para SCZ capital
      const filtered = areaData.dists.filter(d =>
        String(d.prov_code) === formData.provincia &&
        String(d.mun_code) === formData.municipio
      );
      if (filtered.length === 0) return [{ value: "", label: "No hay distritos para esta selección" }];
      return [
        { value: "", label: "Seleccione su distrito municipal" },
        ...filtered.map(d => ({ value: String(d.code), label: d.name }))
      ];
    }
    return [{ value: "", label: "N/A para esta selección" }]; // Otros municipios de SCZ (no capital) o si no hay match
  }, [areaData, formData.provincia, formData.municipio, isLoadingAreaData]);

  const localidadesOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio) return [{ value: "", label: "Seleccione provincia y municipio" }];
    if (isLoadingAreaData) return [{ value: "", label: "Cargando localidades..." }];
    if (!areaData?.locals) return [{ value: "", label: "Datos de localidad no disponibles" }];
    const filtered = areaData.locals.filter(l =>
        String(l.prov_code) === formData.provincia &&
        String(l.mun_code) === formData.municipio
    );
    if (filtered.length === 0 && formData.municipio) return [{ value: "", label: "No hay localidades para esta selección" }];
    return [
      { value: "", label: "Seleccione su localidad" },
      ...filtered.map(l => ({ value: String(l.code), label: l.name }))
    ];
  }, [areaData, formData.provincia, formData.municipio, isLoadingAreaData]);

  const recintosOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio || !formData.localidad) return [{ value: "", label: "Seleccione P., M. y L." }];
    if (isLoadingAreaData) return [{ value: "", label: "Cargando recintos..." }];
    if (!areaData?.recints) return [{ value: "", label: "Datos de recinto no disponibles" }];

    const isSCZCapital = formData.provincia === '1' && formData.municipio === '1';

    // Para SCZ Capital, si el distrito no está seleccionado o no es aplicable, no mostrar recintos aún.
    if (isSCZCapital && (!formData.distrito || distritosOptions[0]?.label === "N/A" || distritosOptions[0]?.label === "No hay distritos para esta selección" || distritosOptions[0]?.label === "Seleccione municipio primero" )) {
        return [{ value: "", label: "Seleccione distrito municipal primero" }];
    }

    const filtered = areaData.recints.filter(rec => {
      let match = String(rec.prov_code) === formData.provincia &&
                  String(rec.mun_code) === formData.municipio &&
                  String(rec.local_code) === formData.localidad;

      if (!match) return false;

      if (isSCZCapital) {
        // Ya hemos verificado formData.distrito arriba.
        // Si llegamos aquí, formData.distrito es válido y seleccionado para SCZ Capital.
        return String(rec.dist_code) === formData.distrito;
      }
      return true; // Para no SCZ Capital, el filtro de distrito no aplica aquí
    });

    if (filtered.length === 0 && formData.localidad) return [{ value: "", label: "No hay recintos para esta selección" }];
    return [
      { value: "", label: "Seleccione su recinto" },
      ...filtered.map(r => ({ value: String(r.code), label: r.name }))
    ];
  }, [areaData, formData.provincia, formData.municipio, formData.localidad, formData.distrito, isLoadingAreaData, distritosOptions]);


  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const validateForm = (data: FormDataInterface): Partial<Record<keyof FormDataInterface, string>> => {
    const errors: Partial<Record<keyof FormDataInterface, string>> = {};
    const genericRequiredMsg = "Este campo es requerido.";
    const selectionRequiredMsg = (field: string) => `Seleccione ${field}.`;

    if (!data.primer_nombre.trim()) errors.primer_nombre = genericRequiredMsg;
    if (!data.apellido_paterno.trim()) errors.apellido_paterno = genericRequiredMsg;
    if (!data.apellido_materno.trim()) errors.apellido_materno = genericRequiredMsg;
    if (!data.cedula.trim()) errors.cedula = genericRequiredMsg;
    if (!data.correo.trim()) errors.correo = genericRequiredMsg;
    else if (!/\S+@\S+\.\S+/.test(data.correo)) errors.correo = "Correo electrónico no es válido.";
    if (!data.whatsapp.trim()) errors.whatsapp = genericRequiredMsg;
    if (!data.address.trim()) errors.address = genericRequiredMsg;
    if (!data.fecha_nacimiento) errors.fecha_nacimiento = genericRequiredMsg;
    if (!data.genero) errors.genero = selectionRequiredMsg("su género");

    // Provincia
    const provinciaSelectIsEnabled = !isLoadingAreaData && !(provinciasOptions.length === 1 && (provinciasOptions[0].label === "Cargando provincias..." || provinciasOptions[0].label === "No hay datos de provincia"));
    if (provinciaSelectIsEnabled && hasActualOptions(provinciasOptions) && !data.provincia) {
        errors.provincia = selectionRequiredMsg("su provincia");
    }

    // Municipio
    const municipioSelectIsEnabled = !isLoadingAreaData && !!data.provincia && !(municipiosOptions.length === 1 && (municipiosOptions[0].label.includes("primero") || municipiosOptions[0].label.includes("Cargando") || municipiosOptions[0].label.includes("No hay") || municipiosOptions[0].label.includes("no disponibles")));
    if (municipioSelectIsEnabled && hasActualOptions(municipiosOptions) && !data.municipio) {
        errors.municipio = selectionRequiredMsg("su municipio");
    }

    // Distrito
    const distritoIsRelevantForSCZ = data.provincia === '1' && data.municipio === '1';
    const distritoSelectIsEnabled = !isLoadingAreaData && distritoIsRelevantForSCZ && !(distritosOptions.length === 1 && (distritosOptions[0].label.includes("N/A") || distritosOptions[0].label.includes("Cargando") || distritosOptions[0].label.includes("No hay") || distritosOptions[0].label.includes("no disponibles")|| distritosOptions[0].label.includes("primero")));
    if (distritoSelectIsEnabled && hasActualOptions(distritosOptions) && !data.distrito) {
        errors.distrito = selectionRequiredMsg("su distrito municipal");
    }
    
    // Localidad
    const localidadSelectIsEnabled = !isLoadingAreaData && !!data.municipio && !(localidadesOptions.length === 1 && (localidadesOptions[0].label.includes("primero") || localidadesOptions[0].label.includes("Cargando") || localidadesOptions[0].label.includes("No hay") || localidadesOptions[0].label.includes("no disponibles")));
    if (localidadSelectIsEnabled && hasActualOptions(localidadesOptions) && !data.localidad) {
        errors.localidad = selectionRequiredMsg("su localidad");
    }

    // Recinto
    const recintoCanBeSelectedBasedOnDistritoForSCZ = !(data.provincia === '1' && data.municipio === '1' && (!data.distrito || distritosOptions[0]?.label === "N/A para esta selección" || distritosOptions[0]?.label === "No hay distritos para esta selección" || distritosOptions[0]?.label.includes("primero")));
    const recintoSelectIsEnabled = !isLoadingAreaData && !!data.localidad && recintoCanBeSelectedBasedOnDistritoForSCZ && !(recintosOptions.length === 1 && (recintosOptions[0].label.includes("P., M. y L.") || recintosOptions[0].label.includes("Cargando") || recintosOptions[0].label.includes("No hay") || recintosOptions[0].label.includes("no disponibles") || recintosOptions[0].label.includes("distrito municipal primero")));
    if (recintoSelectIsEnabled && hasActualOptions(recintosOptions) && !data.recinto) {
        errors.recinto = selectionRequiredMsg("su recinto");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true); // Marcar que se intentó enviar
    setIsLoading(true); // Mantener isLoading para el botón, pero la validación es prioritaria

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("Por favor, corrija los campos marcados en rojo.", "error");
      setIsLoading(false);
      return;
    }
    // Si no hay errores de validación, limpiar submitError de intentos previos de API
    setSubmitError(null);


    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("Error: NEXT_PUBLIC_API_URL no está definido.");
      setSubmitError("Error de configuración: URL de API no disponible.");
      showToast("Error de configuración: URL de API no disponible.", "error");
      setIsLoading(false);
      return;
    }
    const fullUrl = `${apiUrl}/sup-create`;
    const payload = {
      name: formData.primer_nombre,
      middle_name: formData.segundo_nombre || null,
      last_name: formData.apellido_paterno,
      mother_last_name: formData.apellido_materno,
      ci: formData.cedula,
      email: formData.correo,
      phone: formData.whatsapp,
      prefix_phone: selectedPrefix,
      address: formData.address,
      type: "SUP",
      status: "A",
      birthdate: formData.fecha_nacimiento,
      prov_code: formData.provincia ? parseInt(formData.provincia, 10) : null,
      mun_code: formData.municipio ? parseInt(formData.municipio, 10) : null,
      dist_code: (formData.provincia === '1' && formData.municipio === '1' && formData.distrito) ? parseInt(formData.distrito, 10) : null,
      local_code: formData.localidad ? parseInt(formData.localidad, 10) : null,
      recint_code: formData.recinto ? parseInt(formData.recinto, 10) : null,
      gender: formData.genero,
      ...(user_id && { user_id: user_id })
    };

    try {
      const response = await axios.post(fullUrl, payload);
      console.log('Respuesta del servidor:', response.data);
      // Dentro de la función handleSubmit, modifica el bloque if de éxito del primer POST:

      if (response.data.status && response.data.data) {
        setQrData(response.data.data);
        setShowQrModal(true);
        showToast("Registro exitoso. Procesando tarjeta...", "success"); // Mensaje actualizado

        const ciParaTarjeta = formData.cedula; // 1. Guarda el CI

        
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (!apiUrl) {
            console.error("Error: NEXT_PUBLIC_API_URL no está definido para la segunda llamada.");
            showToast("Error de configuración para generar tarjeta.", "error");
            // Aunque falle la configuración para la 2da llamada, el primer registro fue exitoso.
            // Reseteamos el formulario aquí.
            setFormData(initialFormData);
            setFormSubmitted(false);
            setValidationErrors({});
            // setIsLoading(false) será llamado por el finally externo.
            return; // Salimos de esta lógica de segunda llamada.
          }

          const urlSegundaApi = `${apiUrl}/sup-card?ci=${ciParaTarjeta}`;
          // 2. Segunda llamada API (POST). Asumimos cuerpo vacío si no se especifica otro.
          const responseSegundaApi = await axios.post(urlSegundaApi, {});

          // 3. Procesa la Respuesta
          if (responseSegundaApi.data && responseSegundaApi.data.success && responseSegundaApi.data.data && responseSegundaApi.data.data.path) {
            const filePath = responseSegundaApi.data.data.path;
            // 4. Construye URL del PDF
            const urlDescarga = `${apiUrl}/storage/${filePath}`;

            // 5. Abre el PDF en una nueva pestaña
            window.open(urlDescarga, '_blank');
            showToast("Carnet generado y disponible.", "success");

          } else {
            console.error("Respuesta inesperada de la API de tarjeta:", responseSegundaApi.data);
            const message = responseSegundaApi.data?.message || "No se pudo procesar la solicitud de la tarjeta.";
            showToast(message, "error");
          }

        } catch (errorSegundaApi: any) { // 6. Manejo de Errores para la segunda llamada
          console.error('Error al llamar a la API de tarjeta:', errorSegundaApi);
          let errorMsgSegundaApi = "Error al generar la tarjeta.";
          if (axios.isAxiosError(errorSegundaApi)) {
            const axiosError = errorSegundaApi as AxiosError<any>;
            if (axiosError.response) {
              errorMsgSegundaApi = `Error del servidor (${axiosError.response.status}) al generar tarjeta: ${axiosError.response.data?.message || 'Error desconocido.'}`;
            } else if (axiosError.request) {
              errorMsgSegundaApi = 'No se pudo conectar al servidor para generar la tarjeta.';
            } else {
              errorMsgSegundaApi = `Error al preparar la petición de tarjeta: ${axiosError.message}`;
            }
          } else if (errorSegundaApi instanceof Error) {
            errorMsgSegundaApi = `Error inesperado al generar tarjeta: ${errorSegundaApi.message}`;
          }
          showToast(errorMsgSegundaApi, "error");
        } finally {
          // 6. (continuación) Reseteo del formulario después de intentar la segunda operación.
          // Esto asegura que el formulario se limpie independientemente del resultado de la segunda llamada,
          // pero solo si la primera fue exitosa.
          setFormData(initialFormData);
          setFormSubmitted(false);
          setValidationErrors({});
        }
    

      } else {
        // Si el primer POST no fue exitoso o status es false
        showToast(response.data.message || "El registro no fue completado exitosamente.", response.data.status ? "success" : "error");
        // Si hubo un status:true pero data:null (o similar), puede que quieras resetear.
        if (response.data.status) { // O alguna otra condición que determine un "éxito parcial" que merezca reseteo
            setFormData(initialFormData);
            setFormSubmitted(false);
            setValidationErrors({});
        }
      }
    } catch (err: any) {
      console.error('Error al enviar el formulario:', err);
      let errorMessage = 'Error desconocido al enviar el formulario.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response) {
          const status = axiosError.response.status;
          const responseData = axiosError.response.data;
          const backendMessage = responseData?.message || responseData?.error || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
          errorMessage = `Error del servidor (${status}): ${backendMessage || 'No se pudo procesar la solicitud.'}`;
        } else if (axiosError.request) {
          errorMessage = 'No se pudo conectar con el servidor.';
        } else {
          errorMessage = `Error al preparar la petición: ${axiosError.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = `Ocurrió un error inesperado: ${err.message}`;
      }
      setSubmitError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div id="ser-parte" className={styles.formularioSection}>
      <div className={styles.formularioContainer}>
        <span className={styles.titleDark}>Sé parte del cambio</span>
        {areaDataError && <p className={styles.errorMessage} style={{textAlign: 'center', marginBlock: '1rem'}}>{areaDataError}</p>}
        <form onSubmit={handleSubmit} className={styles.formOuterBox} noValidate> {/* noValidate para usar nuestra propia validación */}
          <div className={styles.formFieldsGrid}>
            <div className={styles.formFieldsGroup}>

              {/* Fila 1: Nombres */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.primer_nombre ? styles.fieldError : ''}`}>
                    <input type="text" name="primer_nombre" value={formData.primer_nombre} onChange={handleInputChange} placeholder="Primer nombre" required disabled={isLoading || isLoadingAreaData} />
                    {/* {formSubmitted && validationErrors.primer_nombre && <small className={styles.inlineErrorMsg}>{validationErrors.primer_nombre}</small>} */}
                </div>
                <div className={styles.fieldControl}> {/* segundo_nombre es opcional */}
                    <input type="text" name="segundo_nombre" value={formData.segundo_nombre} onChange={handleInputChange} placeholder="Segundo nombre (opcional)" disabled={isLoading || isLoadingAreaData} />
                </div>
              </div>
              {/* Fila 2: Apellidos */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.apellido_paterno ? styles.fieldError : ''}`}>
                    <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} placeholder="Apellido paterno" required disabled={isLoading || isLoadingAreaData} />
                </div>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.apellido_materno ? styles.fieldError : ''}`}>
                    <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} placeholder="Apellido materno" required disabled={isLoading || isLoadingAreaData} />
                </div>
              </div>
              {/* Fila 3: CI y Fecha de Nacimiento */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.cedula ? styles.fieldError : ''}`}>
                    <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="Cédula de identidad" required disabled={isLoading || isLoadingAreaData} />
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.fecha_nacimiento ? styles.fieldError : ''}`}>
                    <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} required disabled={isLoading || isLoadingAreaData} />
                </div>
              </div>
              {/* Fila 4: Correo y Género */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.correo ? styles.fieldError : ''}`}>
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo electrónico" required disabled={isLoading || isLoadingAreaData} />
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.genero ? styles.fieldError : ''}`}>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isLoadingAreaData}
                  >
                    <option value="">Seleccione su género</option>,
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>
              {/* Fila 5: WhatsApp y Dirección */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.phoneField} ${formSubmitted && validationErrors.whatsapp ? styles.fieldError : ''}`}>
                  <span className={styles.phoneLabelTop}>Número de WhatsApp</span>
                  <div className={styles.phoneInputRow}>
                    <div className={styles.phonePrefix}>
                      <select
                        value={selectedPrefix}
                        onChange={(e) => setSelectedPrefix(e.target.value)}
                        className={styles.phonePrefixSelect}
                        disabled={isLoading || isLoadingAreaData}
                      >
                        {PREFIX_COUNTRY.map((country) => (
                          <option key={country.id} value={country.id}>
                            +{country.id} {country.name}
                          </option>
                        ))}
                      </select>
                      <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                    </div>
                    <span className={styles.phoneSeparator}>|</span>
                    <input
                      type="tel"
                      className={styles.phoneNumberInput}
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="74837560"
                      required
                      disabled={isLoading || isLoadingAreaData}
                    />
                  </div>
                </div>
                <div className={`${styles.fieldControl} ${formSubmitted && validationErrors.address ? styles.fieldError : ''}`}>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                    required
                    disabled={isLoading || isLoadingAreaData}
                  />
                </div>
              </div>

              {/* Fila 6: Provincia y Municipio */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.provincia ? styles.fieldError : ''}`}>
                  <select
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    required={!isLoadingAreaData && hasActualOptions(provinciasOptions) && !(provinciasOptions.length === 1 && (provinciasOptions[0].label === "Cargando provincias..." || provinciasOptions[0].label === "No hay datos de provincia"))}
                    disabled={isLoadingAreaData || (provinciasOptions.length <= 1 && !hasActualOptions(provinciasOptions))}
                  >
                    {provinciasOptions.map(opt => (<option key={opt.value || 'prov_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su provincia"}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.municipio ? styles.fieldError : ''}`}>
                  <select
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleInputChange}
                    required={!isLoadingAreaData && !!formData.provincia && hasActualOptions(municipiosOptions) && !(municipiosOptions.length === 1 && (municipiosOptions[0].label.includes("primero") || municipiosOptions[0].label.includes("Cargando") || municipiosOptions[0].label.includes("No hay") || municipiosOptions[0].label.includes("no disponibles")))}
                    disabled={isLoadingAreaData || !formData.provincia || (municipiosOptions.length <=1 && !hasActualOptions(municipiosOptions))}
                  >
                    {municipiosOptions.map(opt => (<option key={opt.value || 'mun_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su municipio" }>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>
              
              {/* Fila 7: Distrito Municipal y Localidad */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.distrito ? styles.fieldError : ''}`}>
                  <select
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    required={!isLoadingAreaData && (formData.provincia === '1' && formData.municipio === '1') && hasActualOptions(distritosOptions) && !(distritosOptions.length === 1 && (distritosOptions[0].label.includes("N/A") || distritosOptions[0].label.includes("Cargando") || distritosOptions[0].label.includes("No hay") || distritosOptions[0].label.includes("no disponibles") || distritosOptions[0].label.includes("primero")))}
                    disabled={isLoadingAreaData || !(formData.provincia === '1' && formData.municipio === '1') || (distritosOptions.length <=1 && !hasActualOptions(distritosOptions)) || (distritosOptions.length === 1 && (distritosOptions[0].label.includes("N/A") || distritosOptions[0].label.includes("primero")))}
                  >
                    {distritosOptions.map(opt => (<option key={opt.value || 'dist_load_key'} value={opt.value} disabled={(opt.value === "" && opt.label !== "Seleccione su distrito municipal") || opt.label.startsWith("N/A") || opt.label.startsWith("Seleccione municipio primero")}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.localidad ? styles.fieldError : ''}`}>
                  <select
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleInputChange}
                    required={!isLoadingAreaData && !!formData.municipio && hasActualOptions(localidadesOptions) && !(localidadesOptions.length === 1 && (localidadesOptions[0].label.includes("primero") || localidadesOptions[0].label.includes("Cargando") || localidadesOptions[0].label.includes("No hay") || localidadesOptions[0].label.includes("no disponibles")))}
                    disabled={isLoadingAreaData || !formData.municipio || (localidadesOptions.length <= 1 && !hasActualOptions(localidadesOptions))}
                  >
                    {localidadesOptions.map(opt => (<option key={opt.value || 'loc_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su localidad"}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>

              {/* Fila 8: Recinto Electoral */}
              <div className={styles.fieldRowFull}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon} ${formSubmitted && validationErrors.recinto ? styles.fieldError : ''}`}>
                  <select
                    name="recinto"
                    value={formData.recinto}
                    onChange={handleInputChange}
                    required={
                        !isLoadingAreaData &&
                        !!formData.localidad &&
                        hasActualOptions(recintosOptions) &&
                        !(formData.provincia === '1' && formData.municipio === '1' && (!formData.distrito || distritosOptions[0]?.label === "N/A para esta selección" || distritosOptions[0]?.label === "No hay distritos para esta selección" || distritosOptions[0]?.label.includes("primero"))) &&
                        !(recintosOptions.length === 1 && (recintosOptions[0].label.includes("P., M. y L.") || recintosOptions[0].label.includes("Cargando") || recintosOptions[0].label.includes("No hay") || recintosOptions[0].label.includes("no disponibles") || recintosOptions[0].label.includes("distrito municipal primero")))
                    }
                    disabled={
                        isLoadingAreaData || 
                        !formData.localidad || 
                        (recintosOptions.length <= 1 && !hasActualOptions(recintosOptions)) || 
                        (formData.provincia === '1' && formData.municipio === '1' && (!formData.distrito || distritosOptions[0]?.label === "N/A para esta selección" || distritosOptions[0]?.label === "No hay distritos para esta selección" || distritosOptions[0]?.label.includes("primero"))) ||
                        (recintosOptions.length === 1 && recintosOptions[0].label.includes("distrito municipal primero"))
                    }
                  >
                    {recintosOptions.map(opt => (<option key={opt.value || 'rec_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su recinto"}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>
            </div>
          </div>

          {submitError && <p className={styles.errorMessage}>{submitError}</p>}
          <div className={styles.submitButtonWrapper}>
            <button type="submit" className={styles.submitButton} disabled={isLoading || isLoadingAreaData}>
              <span className={styles.submitButtonText}>
                {isLoading ? 'Registrando...' : (isLoadingAreaData ? 'Cargando datos...' : 'Registrarme')}
              </span>
            </button>
          </div>
        </form>
      </div>
      
      {toast && (
        <div className={`${styles.toast} ${styles[`toast${toast.type === 'success' ? 'Success' : 'Error'}`]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SerParteForm;