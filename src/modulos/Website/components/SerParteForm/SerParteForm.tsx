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
  const [selectedPrefix, setSelectedPrefix] = useState('591'); // Default to Bolivia
  const [isLoading, setIsLoading] = useState(false); 
  const [submitError, setSubmitError] = useState<string | null>(null); 

  const [areaData, setAreaData] = useState<AreasData | null>(null);
  const [isLoadingAreaData, setIsLoadingAreaData] = useState(true);
  const [areaDataError, setAreaDataError] = useState<string | null>(null);

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
        // Especifica el tipo de la respuesta de Axios según la estructura de tu API
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
        newState.recinto = ""; // Si distrito cambia (incluso si es N/A), resetea recinto
      } else if (name === "localidad") {
        newState.recinto = "";
      }
      return newState;
    });
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
    // No mostrar "Seleccione..." si no es SCZ y no hay municipio, o si no hay datos.
    if (!formData.provincia || !formData.municipio) {
      // Para el caso SCZ, si no hay municipio, indicarlo. Para otros, podría ser N/A directamente.
      if (formData.provincia === '1' && !formData.municipio) {
        return [{ value: "", label: "Seleccione municipio primero" }];
      }
      // Si no es SCZ y falta municipio, este select estará deshabilitado de todas formas.
      // Devolver N/A si no se espera que el usuario interactúe hasta que municipio esté seleccionado.
      return [{ value: "", label: "N/A" }]; 
    }
    if (isLoadingAreaData) return [{ value: "", label: "Cargando distritos..." }];
    if (!areaData?.dists) return [{ value: "", label: "Datos de distrito no disponibles" }];

    // Lógica específica para Santa Cruz (prov_code '1' y mun_code '1')
    if (formData.provincia === '1' && formData.municipio === '1') {
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
    return [{ value: "", label: "N/A para esta selección" }]; // Para no SCZ o si no hay match
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
      ...filtered.map(l => ({ value: String(l.code), label: l.name })) // Asumiendo l.code puede ser numérico
    ];
  }, [areaData, formData.provincia, formData.municipio, isLoadingAreaData]);

  const recintosOptions = useMemo(() => {
    if (!formData.provincia || !formData.municipio || !formData.localidad) return [{ value: "", label: "Seleccione P., M. y L." }];
    if (isLoadingAreaData) return [{ value: "", label: "Cargando recintos..." }];
    if (!areaData?.recints) return [{ value: "", label: "Datos de recinto no disponibles" }];

    const isSCZMunicipality = formData.provincia === '1' && formData.municipio === '1';
    
    const filtered = areaData.recints.filter(rec => {
      let match = String(rec.prov_code) === formData.provincia &&
                  String(rec.mun_code) === formData.municipio &&
                  String(rec.local_code) === formData.localidad;

      if (!match) return false;

      if (isSCZMunicipality) {
        // Para SCZ, el distrito es obligatorio para filtrar recintos.
        // Si no hay distrito seleccionado en el form, no se puede filtrar.
        if (!formData.distrito || formData.distrito === "" || distritosOptions[0]?.label === "N/A para esta selección" || distritosOptions[0]?.label === "No hay distritos para esta selección") {
            return false; 
        }
        return String(rec.dist_code) === formData.distrito;
      }
      // Para municipios no SCZ, el distrito no es un criterio de filtro obligatorio aquí
      // (se asume que la API ya provee los recintos correctos para la localidad seleccionada,
      // o que los recintos no tienen un 'dist_code' que deba coincidir con un 'formData.distrito' vacío o "N/A").
      return true; 
    });
    if (filtered.length === 0 && formData.localidad) return [{ value: "", label: "No hay recintos para esta selección" }];
    return [
      { value: "", label: "Seleccione su recinto" },
      ...filtered.map(r => ({ value: String(r.code), label: r.name }))
    ];
  }, [areaData, formData.provincia, formData.municipio, formData.localidad, formData.distrito, isLoadingAreaData, distritosOptions]); // Añadido distritosOptions como dependencia

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

  // Función para verificar si hay opciones reales más allá del placeholder
  const hasActualOptions = (options: Array<{ value: string | number, label: string }>) => {
    return options.some(opt => opt.value !== "");
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
                <div className={styles.fieldControl}><input type="text" name="primer_nombre" value={formData.primer_nombre} onChange={handleInputChange} placeholder="Primer nombre" required disabled={isLoading || isLoadingAreaData} /></div>
                <div className={styles.fieldControl}><input type="text" name="segundo_nombre" value={formData.segundo_nombre} onChange={handleInputChange} placeholder="Segundo nombre (opcional)" disabled={isLoading || isLoadingAreaData} /></div>
              </div>
              {/* Fila 2: Apellidos */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} placeholder="Apellido paterno" required disabled={isLoading || isLoadingAreaData} /></div>
                <div className={styles.fieldControl}><input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} placeholder="Apellido materno" required disabled={isLoading || isLoadingAreaData} /></div>
              </div>
              {/* Fila 3: CI y Fecha de Nacimiento */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="Cédula de identidad" required disabled={isLoading || isLoadingAreaData} /></div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}><input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} required disabled={isLoading || isLoadingAreaData} /></div>
              </div>
              {/* Fila 4: Correo */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldControl}><input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo electrónico" required disabled={isLoading || isLoadingAreaData} /></div>
              </div>
              {/* Fila 5: WhatsApp y Dirección */}
              <div className={styles.fieldRow}>
                <div className={`${styles.fieldControl} ${styles.phoneField}`}>
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
                <div className={styles.fieldControl}>
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
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select 
                    name="provincia" 
                    value={formData.provincia} 
                    onChange={handleInputChange} 
                    required 
                    disabled={isLoadingAreaData || !hasActualOptions(provinciasOptions)}
                  >
                    {provinciasOptions.map(opt => (<option key={opt.value || 'prov_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su provincia"}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select 
                    name="municipio" 
                    value={formData.municipio} 
                    onChange={handleInputChange} 
                    required={!!formData.provincia && hasActualOptions(municipiosOptions)}
                    disabled={isLoadingAreaData || !formData.provincia || !hasActualOptions(municipiosOptions)}
                  >
                    {municipiosOptions.map(opt => (<option key={opt.value || 'mun_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su municipio" }>{opt.label}</option>))}
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
                    required={formData.provincia === '1' && formData.municipio === '1' && hasActualOptions(distritosOptions) && distritosOptions[0]?.label !== "N/A para esta selección"}
                    disabled={isLoadingAreaData || !(formData.provincia === '1' && formData.municipio === '1') || !hasActualOptions(distritosOptions) || distritosOptions[0]?.label === "N/A para esta selección"}
                  >
                    {distritosOptions.map(opt => (<option key={opt.value || 'dist_load_key'} value={opt.value} disabled={(opt.value === "" && opt.label !== "Seleccione su distrito municipal") || opt.label.startsWith("N/A")}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select 
                    name="localidad" 
                    value={formData.localidad} 
                    onChange={handleInputChange} 
                    required={!!formData.municipio && hasActualOptions(localidadesOptions)} 
                    disabled={isLoadingAreaData || !formData.municipio || !hasActualOptions(localidadesOptions)}
                  >
                    {localidadesOptions.map(opt => (<option key={opt.value || 'loc_load_key'} value={opt.value} disabled={opt.value === "" && opt.label !== "Seleccione su localidad"}>{opt.label}</option>))}
                  </select>
                  <div className={styles.iconWrapper}><IconoChevronAbajo /></div>
                </div>
              </div>

              {/* Fila 8: Recinto Electoral */}
              <div className={styles.fieldRowFull}>
                <div className={`${styles.fieldControl} ${styles.fieldControlWithIcon}`}>
                  <select 
                    name="recinto" 
                    value={formData.recinto} 
                    onChange={handleInputChange} 
                    required={!!formData.localidad && hasActualOptions(recintosOptions) && !(formData.provincia === '1' && formData.municipio === '1' && !formData.distrito)}
                    disabled={isLoadingAreaData || !formData.localidad || !hasActualOptions(recintosOptions) || (formData.provincia === '1' && formData.municipio === '1' && (!formData.distrito || distritosOptions[0]?.label === "N/A para esta selección" || distritosOptions[0]?.label === "No hay distritos para esta selección")) }
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
    </div>
  );
};

export default SerParteForm;