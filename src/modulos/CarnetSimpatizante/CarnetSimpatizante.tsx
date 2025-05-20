"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CarnetSimpatizante.module.css';
import axios, { AxiosError } from 'axios';
import { IconoFacebook, IconoInstagram, IconoTwitter, IconoYouTube } from '@/components/layout/icons/IconsBiblioteca';
import { IconoFlechaAtras } from '../Website/components/Icons';

const CarnetSimpatizante: React.FC = () => {
  const router = useRouter();
  const [ci, setCi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    if (!ci.trim()) {
      setSubmitError("Por favor, ingrese un número de Carnet de Identidad.");
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiUrl2 = process.env.NEXT_PUBLIC_URL;
    if (!apiUrl) {
      setSubmitError("Error de configuración: URL de API no disponible.");
      setIsLoading(false);
      return;
    }

    const urlSupCard = `${apiUrl}/sup-card?ci=${ci.trim()}`;

    try {
      const response = await axios.post(urlSupCard, {});

      if (response.data && response.data.success && response.data.data && response.data.data.path) {
        const filePath = response.data.data.path;
        const urlDescarga = `${apiUrl2}/storage/${filePath}`;
        window.open(urlDescarga, '_blank');
        setCi(''); 
      } else {
        const message = response.data?.message || "No se pudo obtener la ruta del carnet desde la respuesta.";
        setSubmitError(message);
      }
    } catch (err: any) {
      let errorMessage = 'Error desconocido al generar el carnet.';
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response) {
          const status = axiosError.response.status;
          const responseData = axiosError.response.data;
          const backendMessage = responseData?.message || responseData?.error || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
          errorMessage = `Error del servidor (${status}): ${backendMessage || 'No se pudo procesar la solicitud.'}`;
        } else if (axiosError.request) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        } else {
          errorMessage = `Error al preparar la petición: ${axiosError.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = `Ocurrió un error inesperado: ${err.message}`;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
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