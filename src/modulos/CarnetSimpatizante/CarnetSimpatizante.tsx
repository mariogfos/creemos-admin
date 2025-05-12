"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Removido Link ya que no se usa en el snippet proporcionado
// import Link from 'next/link';
import styles from './CarnetSimpatizante.module.css';
import axios, { AxiosError } from 'axios'; // Importa axios y AxiosError
import { IconoFacebook, IconoInstagram, IconoTwitter, IconoYouTube } from '@/components/layout/icons/IconsBiblioteca';
import { IconoFlechaAtras } from '../Website/components/Icons';




const CarnetSimpatizante: React.FC = () => {
  const router = useRouter();
  const [ci, setCi] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para la carga
  const [submitError, setSubmitError] = useState<string | null>(null); // Estado para errores de envío

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

    const fullUrl = `${apiUrl}/generated-carnet`; // Endpoint para generar el carnet

    try {
      const response = await axios.post(fullUrl, { ci }); // Enviamos { ci } como datos
      
      // Manejar la respuesta exitosa
      console.log('Carnet generado:', response.data);
      // Aquí podrías, por ejemplo, redirigir al usuario, mostrar un mensaje de éxito,
      // o limpiar el campo de CI.
      // Ejemplo:
      // alert(`Carnet generado exitosamente para CI: ${ci}. Datos: ${JSON.stringify(response.data)}`);
      // setCi(''); // Limpiar campo después del éxito

      // Si la respuesta contiene una URL para el carnet generado o datos para mostrarlo:
      // router.push(`/carnet-generado/${response.data.id}`); // Ejemplo de redirección

    } catch (err: any) {
      console.error('Error al generar carnet:', err);
      let errorMessage = 'Error desconocido al generar el carnet.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>; // Tipado para errores de Axios
        if (axiosError.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const status = axiosError.response.status;
          const responseData = axiosError.response.data;
          // Intenta obtener un mensaje de error significativo del backend
          const backendMessage = responseData?.message || responseData?.error || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
          errorMessage = `Error del servidor (${status}): ${backendMessage || 'No se pudo procesar la solicitud.'}`;
        } else if (axiosError.request) {
          // La solicitud se hizo pero no se recibió respuesta
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        } else {
          // Algo sucedió al configurar la solicitud que provocó un error
          errorMessage = `Error al preparar la petición: ${axiosError.message}`;
        }
      } else if (err instanceof Error) {
        // Error genérico de JavaScript
        errorMessage = `Ocurrió un error inesperado: ${err.message}`;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Barra de Navegación (sin cambios) */}
      <div className={styles.headerBar}>
        <div className={styles.headerContent}>
          <div className={styles.headerLogoContainer}>
            <img className={styles.headerLogo} src="/images/logo.png" alt="Logo" />
          </div>
          <div className={styles.headerMainArea}>
            <div className={styles.headerSocialIcons}>
              <div className={styles.socialIconCircleSmall}><IconoFacebook /></div>
              <div className={styles.socialIconCircleSmall}><IconoTwitter /></div>
              <div className={styles.socialIconCircleSmall}><IconoInstagram /></div>
              <div className={styles.socialIconCircleSmall}><IconoYouTube /></div>
            </div>
          </div>
          <div className={styles.pageTitleBar}>
            <div className={styles.backIconContainer}>
              <div className={styles.backIconCircle} onClick={() => router.back()}>
                <IconoFlechaAtras />
              </div>
            </div>
            <span className={styles.pageTitle}>Carnet de Simpatizante</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <img className={styles.carnetImage} src="/images/carnet.png" alt="Carnet Simpatizante" />
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="ci" className={styles.formLabel}>Carnet de Identidad</label>
              <input
                type="text"
                id="ci"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className={styles.formInput}
                placeholder="Ingrese su CI"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Generando...' : 'Generar Carnet'}
            </button>
            {submitError && <p className={styles.errorMessage}>{submitError}</p>}
          </form>
        </div>
      </div>

      {/* Sección Seguinos en las redes (sin cambios) */}
      <div className={styles.redesSection}>
        <span className={styles.titleWhiteMedium}>Seguinos en las redes</span>
        <div className={styles.redesIconsContainer}>
          <div className={styles.socialIconCircleLarge}><IconoFacebook /></div>
          <div className={styles.socialIconCircleLarge}><IconoTwitter /></div>
          <div className={styles.socialIconCircleLarge}><IconoInstagram /></div>
          <div className={styles.socialIconCircleLarge}><IconoYouTube /></div>
        </div>
      </div>
    </div>
  );
};

export default CarnetSimpatizante;