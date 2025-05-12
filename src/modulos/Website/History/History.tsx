"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './History.module.css';
import { 
  IconoFlechaAtras,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from '../components/Icons';

// --- Iconos SVG como componentes React (Reutilizar/Adaptar de la vez anterior) ---
const IconoFlechaIzquierdaNav = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.navArrowSvgIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const IconoFlechaDerechaNav = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.navArrowSvgIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);
// --- Fin Iconos ---


const History: React.FC = () => {
  const router = useRouter();
  const placeholderText = "nisi volutpat placerat placerat amet, urna. elit nec convallis. faucibus elit tincidunt Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in\n\nnisi volutpat placerat placerat amet, urna. elit nec convallis. faucibus elit tincidunt Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in\n\nnisi volutpat placerat placerat amet, urna. elit nec convallis. faucibus elit tincidunt Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in cidunt Vestibuluolutpat placerat placerat amet, urna. elit nec convallis. faucibus elit tincidunt Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in Vestibulum ultrice.";
  const shortPlaceholderText = "nisi volutpat placerat placerat amet, urna. elit nec convallis. faucibus elit tincidunt Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in Vestibulum ultrices tempor Cras maximus gravida tincidunt tincidunt in";


  return (
    <div className={styles.pageContainer}>
      {/* Barra de Navegación Superior Simplificada */}
      <div className={styles.headerBar}>
        <div className={styles.headerContent}>
          <div className={styles.headerLogoContainer}>
            <img className={styles.headerLogo} src="/images/Logo.png" alt="Logo" />
          </div>
          <div className={styles.headerMainArea}>
            {/* Iconos Sociales a la Izquierda del Título (según estructura) */}
            <div className={styles.headerSocialIcons}>
              <div className={styles.socialIconCircleSmall}><IconoFacebook /></div>
              <div className={styles.socialIconCircleSmall}><IconoTwitter /></div>
              <div className={styles.socialIconCircleSmall}><IconoInstagram /></div>
              <div className={styles.socialIconCircleSmall}><IconoYouTube /></div>
            </div>
          </div>
        </div>
        <div className={styles.pageTitleBar}>
          <div className={styles.backIconContainer}>
            <div className={styles.backIconCircle} onClick={() => router.push('/')}><IconoFlechaAtras/></div>
          </div>
          <span className={styles.pageTitle}>Historia</span>
        </div>
      </div>

      {/* Imagen Principal Grande */}
      <img className={styles.mainImage} src="/images/History/Portada-history.png" alt="Historia Principal" />

      {/* Sección Línea de Tiempo */}
      <div className={styles.timelineSectionWrapper}>
      <div className={styles.timelineSectionContainer}>
      <h2 className={styles.timelineTitle}>Línea de tiempo</h2>
      <div className={styles.timelineContent}>
        <div className={styles.timelineImageWrapper}>
          <img 
            src="/images/History/Linea-de-tiempo.png" 
            alt="Evento de línea de tiempo" 
            className={styles.timelineImage}
          />
        </div>
        <div className={styles.timelineTextWrapper}>
          <p className={styles.timelineTextContent}>
            {placeholderText}
          </p>
        </div>
      </div>
      <div className={styles.timelineNavigation}>
        <div className={styles.arrowButton}>
          <IconoFlechaIzquierdaNav />
        </div>
        <div className={styles.arrowButton}>
          <IconoFlechaDerechaNav />
        </div>
      </div>
    </div>
  );
      </div>


      {/* Sección "El secuestro" y contenido relacionado */}
      <div className={styles.secuestroSection}>
        <div className={styles.secuestroContentRow}>
          <div className={styles.secuestroTextColumn}>
            <span className={styles.sectionTitleDarkLarge}>El secuestro</span>
            <span className={styles.textGrayNormal}>{placeholderText}</span>
          </div>
          <img className={styles.secuestroImageLarge} src="/images/History/Secuestro-1.png" alt="El secuestro" />
        </div>
        <div className={styles.secuestroContentRowReverse}>
          <img className={styles.secuestroImageMedium} src="/images/History/Secuestro-2.png" alt="Detalle secuestro" />
          {/* El span con texto ahora ocupa todo el ancho disponible */}
          <span className={`${styles.textGrayNormal} ${styles.fullWidthText}`}>{placeholderText}</span>
        </div>
      </div>

      {/* Sección con Imagen y Texto (similar a Tu Voz al Poder) */}
      <div className={styles.imageTextSection}>
        <iframe 
          className={styles.imageTextSectionImage}
          src="https://www.youtube.com/embed/0bLx7Lp3vR0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* El span con texto ahora ocupa el espacio asignado */}
        <span className={`${styles.textGrayNormal} ${styles.imageTextSectionText}`}>{shortPlaceholderText}</span>
      </div>

      {/* Sección Seguinos en las redes (Reutilizada) */}
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

export default History;