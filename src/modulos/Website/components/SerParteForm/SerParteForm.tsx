import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import styles from './SerParteForm.module.css';
import { IconoChevronAbajo } from '../../Website';

// Interfaz para los datos de las áreas geográficas (ajusta según tu API)
interface AreaItem {
  code: string; // O number, si tus códigos son numéricos y así los quieres manejar
  name: string;
  prov_code?: string;
  mun_code?: string;
  local_code?: string;
  dist_code?: string;
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
  provincia: string; // Almacenará el 'code' de la provincia
  municipio: string; // Almacenará el 'code' del municipio
  distrito: string;  // Almacenará el 'code' del distrito
  localidad: string; // Almacenará el 'code' de la localidad
  recinto: string;   // Almacenará el 'code' del recinto
}

const SerParteForm: React.FC = () => {
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
    recinto: ''
  };

  const [formData, setFormData] = useState<FormDataInterface>(initialFormData);
  const [isLoading, setIsLoading] = useState(false); // Para el submit del formulario
  const [submitError, setSubmitError] = useState<string | null>(null); // Para errores del submit

  const [areaData, setAreaData] = useState<AreasData | null>(null);
  const [isLoadingAreaData, setIsLoadingAreaData] = useState(true);
  const [areaDataError, setAreaDataError] = useState<string | null>(null);

  // Cargar datos geográficos al montar el componente
  useEffect(() => {
    const fetchAreaData = async () => {
      setIsLoadingAreaData(true);
      setAreaDataError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("API URL (NEXT_PUBLIC_API_URL) no está configurada.");
        setAreaDataError("Error de configuración: No se pudo determinar la URL de la API para cargar datos geográficos.");
        setIsLoadingAreaData(false);
        return;
      }
      try {
        const response = await axios.get(`${apiUrl}/map-metrics-public`);
        // Ajusta esta línea según la estructura real de tu respuesta:
        // Si la API devuelve { data: { areas: { provs: [], ... } } } -> response.data.data.areas
        // Si la API devuelve { areas: { provs: [], ... } } -> response.data.areas
        // Si la API devuelve { provs: [], ... } directamente -> response.data
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
      } else if (name === "distrito") { // Relevante para SCZ
        newState.recinto = "";
      } else if (name === "localidad") {
        newState.recinto = "";
      }
      return newState;
    });
  };

  // Opciones para los selects (memoizadas para rendimiento)
  const provinciasOptions = useMemo(() => {
    if (isLoadingAreaData) return [{ value: "", label: "Cargando provincias..." }];
    if (!areaData?.provs) return [{ value: "", label: "No hay datos de provincia" }];
    return [
      { value: "", label: "Seleccione su provincia" },
      ...areaData.provs.map(p => ({ value: p.code, label: p.name }))
    ];
  }, [areaData, isLoadingAreaData]);

  const municipiosOptions = useMemo(() => {
    if (!formData.provincia) return [{ value: "", label: "Seleccione provincia" }];
    if (isLoadingAreaData || !areaData?.muns) return [{ value: "", label: "Cargando municipios..." }];
    const filtered = areaData.muns.filter(m => m.prov_code === formData.provincia);
    return [
      { value: "", label: "Seleccione su municipio" },
      ...filtered.map(m => ({ value: m.code, label: m.name }))
    ];
  }, [areaData, formData.provincia, isLoadingAreaData]);

  const distritosOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio) return [{ value: "", label: "Seleccione provincia y municipio" }];
    if (isLoadingAreaData || !areaData?.dists) return [{ value: "", label: "Cargando distritos..." }];
    // Lógica específica para Santa Cruz (prov_code '1' y mun_code '1')
    if (formData.provincia === '1' && formData.municipio === '1') {
      const filtered = areaData.dists.filter(d => d.prov_code === formData.provincia && d.mun_code === formData.municipio);
      return [
        { value: "", label: "Seleccione su distrito municipal" },
        ...filtered.map(d => ({ value: d.code, label: d.name }))
      ];
    }
    return [{ value: "", label: "N/A para esta selección" }];
  }, [areaData, formData.provincia, formData.municipio, isLoadingAreaData]);

  const localidadesOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio) return [{ value: "", label: "Seleccione provincia y municipio" }];
    if (isLoadingAreaData || !areaData?.locals) return [{ value: "", label: "Cargando localidades..." }];
    const filtered = areaData.locals.filter(l => l.prov_code === formData.provincia && l.mun_code === formData.municipio);
    return [
      { value: "", label: "Seleccione su localidad" },
      ...filtered.map(l => ({ value: l.code, label: l.name }))
    ];
  }, [areaData, formData.provincia, formData.municipio, isLoadingAreaData]);

  const recintosOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio || !formData.localidad) return [{ value: "", label: "Seleccione P., M. y L." }];
    if (isLoadingAreaData || !areaData?.recints) return [{ value: "", label: "Cargando recintos..." }];

    const isSCZMunicipality = formData.provincia === '1' && formData.municipio === '1';
    const filtered = areaData.recints.filter(rec => {
      if (rec.prov_code !== formData.provincia || rec.mun_code !== formData.municipio || rec.local_code !== formData.localidad) {
        return false;
      }
      if (isSCZMunicipality) {
        if (!formData.distrito || formData.distrito === "") return false; // Requiere distrito para SCZ
        return rec.dist_code === formData.distrito;
      }
      return true; // Para no SCZ, no filtra por distrito en frontend
    });
    return [
      { value: "", label: "Seleccione su recinto" },
      ...filtered.map(r => ({ value: r.code, label: r.name }))
    ];
  }, [areaData, formData.provincia, formData.municipio, formData.localidad, formData.distrito, isLoadingAreaData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("Error: NEXT_PUBLIC_API_URL no está definido.");
      setSubmitError("Error de configuración: URL de API no disponible.");
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
      address: formData.address,
      type: "SUP",
      status: "A",
      birthdate: formData.fecha_nacimiento,
      country_code: "BOL",
      prov_id: formData.provincia ? parseInt(formData.provincia, 10) : null,
      muni_id: formData.municipio ? parseInt(formData.municipio, 10) : null,
      dist_id: formData.distrito ? parseInt(formData.distrito, 10) : null,
      local_id: formData.localidad ? parseInt(formData.localidad, 10) : null,
      recint_id: formData.recinto ? parseInt(formData.recinto, 10) : null,
    };

    try {
      const response = await axios.post(fullUrl, payload);
      console.log('Respuesta del servidor:', response.data);
      alert('Registro exitoso');
      setFormData(initialFormData);
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
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ser-parte" className={styles.formularioSection}>
      <div className={styles.formularioContainer}>
        <span className={styles.titleDark}>Sé parte del cambio</span>
        {areaDataError && <p className={styles.errorMessage} style={{textAlign: 'center', marginBlock: '1rem'}}>{areaDataError}</p>}
        <form onSubmit={handleSubmit} className={styles.formOuterBox}>
          <div className={styles.formFieldsGrid}>
            <div className={styles.formFieldsGroup}>

              {/* Fila 1: Nombres */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="text" name="primer_nombre" value={formData.primer_nombre} onChange={handleInputChange} placeholder="Primer nombre" required disabled={isLoading} /></div>
                <div className={styles.fieldControl}><input type="text" name="segundo_nombre" value={formData.segundo_nombre} onChange={handleInputChange} placeholder="Segundo nombre (opcional)" disabled={isLoading} /></div>
              </div>
              {/* Fila 2: Apellidos */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} placeholder="Apellido paterno" required disabled={isLoading} /></div>
                <div className={styles.fieldControl}><input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} placeholder="Apellido materno" required disabled={isLoading} /></div>
              </div>
              {/* Fila 3: CI y Fecha de Nacimiento */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="Cédula de identidad" required disabled={isLoading} /></div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}><input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} required disabled={isLoading} /></div>
              </div>
              {/* Fila 4: Correo y Contraseña */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo electrónico" required disabled={isLoading} /></div>
              </div>
              {/* Fila 5: WhatsApp y Dirección */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.phoneField}`}>
                  <span className={styles.phoneLabelTop}>Número de WhatsApp</span>
                  <div className={styles.phoneInputRow}>
                    <div className={styles.phonePrefix}><span className={styles.phonePrefixText}>+591</span><div className={styles.iconWrapper}><IconoChevronAbajo /></div></div>
                    <span className={styles.phoneSeparator}>|</span>
                    <input type="tel" className={styles.phoneNumberInput} name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="74837560" required disabled={isLoading} />
                  </div>
                </div>
                <div className={styles.fieldControl}><input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Dirección" required disabled={isLoading} /></div>
              </div>

              {/* Fila 6: Provincia y Municipio */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select name="provincia" value={formData.provincia} onChange={handleInputChange} required disabled={isLoading || isLoadingAreaData}>
                    {provinciasOptions.map(opt => (<option key={opt.value || 'prov_load'} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select name="municipio" value={formData.municipio} onChange={handleInputChange} required disabled={isLoading || isLoadingAreaData || !formData.provincia}>
                    {municipiosOptions.map(opt => (<option key={opt.value || 'mun_load'} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>
              
              {/* Fila 7: Distrito Municipal y Localidad */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select 
                    name="distrito" 
                    value={formData.distrito} 
                    onChange={handleInputChange} 
                    // El 'required' aquí es condicional. Si no es SCZ, puede que no haya opciones o no sea necesario.
                    // Por ahora, lo dejamos required si hay opciones disponibles.
                    // Si es SCZ y no hay municipio, o no es SCZ, este select estará deshabilitado o con "N/A"
                    required={formData.provincia === '1' && formData.municipio === '1'}
                    disabled={isLoading || isLoadingAreaData || !(formData.provincia === '1' && formData.municipio === '1')}>
                    {distritosOptions.map(opt => (<option key={opt.value || 'dist_load'} value={opt.value} disabled={opt.value === "" || opt.label.startsWith("N/A")}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select name="localidad" value={formData.localidad} onChange={handleInputChange} required disabled={isLoading || isLoadingAreaData || !formData.municipio}>
                    {localidadesOptions.map(opt => (<option key={opt.value || 'loc_load'} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>

              {/* Fila 8: Recinto Electoral */}
              <div className={styles.fieldRowFull}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select name="recinto" value={formData.recinto} onChange={handleInputChange} required disabled={isLoading || isLoadingAreaData || !formData.localidad}>
                    {recintosOptions.map(opt => (<option key={opt.value || 'rec_load'} value={opt.value} disabled={opt.value === ""}>{opt.label}</option>))}
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
    </div>
  );
};

export default SerParteForm;