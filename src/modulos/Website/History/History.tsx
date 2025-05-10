import React from 'react';
import styles from './History.module.css';

// --- Iconos SVG como componentes React (Reutilizar/Adaptar de la vez anterior) ---
const IconoFlechaAtras = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.svgIconSmall}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const IconoFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvgIcon}>
    <path d="M9.198 21.5h4v-8.01h2.669l.399-2.969h-3.068V8.435c0-.86.238-1.446 1.474-1.446h1.565V4.349c-.27-.036-1.2-.117-2.279-.117-2.251 0-3.793 1.348-3.793 3.896v2.197H6.396v2.969h2.802v8.01Z" />
  </svg>
);

const IconoTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvgIcon}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const IconoInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvgIcon}>
    <path fillRule="evenodd" d="M12.315 2.5a9.815 9.815 0 0 0-9.815 9.815c0 5.424 4.391 9.815 9.815 9.815s9.815-4.391 9.815-9.815S17.739 2.5 12.315 2.5Zm0 1.636a8.179 8.179 0 1 0 0 16.358 8.179 8.179 0 0 0 0-16.358Z" clipRule="evenodd" />
    <path d="M12.315 6.545a5.77 5.77 0 1 0 0 11.54 5.77 5.77 0 0 0 0-11.54Zm0 1.636a4.134 4.134 0 1 0 0 8.268 4.134 4.134 0 0 0 0-8.268Z" />
    <path d="M18.301 7.182a1.227 1.227 0 1 1-2.454 0 1.227 1.227 0 0 1 2.454 0Z" />
  </svg>
);

const IconoYouTube = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvgIcon}>
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.411 0 5.923 0 12.001c0 6.079.488 8.59 3.383 8.818 3.6.245 11.626.246 15.23 0C21.513 20.59 22 18.08 22 12.001c0-6.078-.487-8.59-3.385-8.817ZM9.597 17.002V7.002l6.803 5.001-6.803 4.999Z" />
    </svg>
);

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
            <div className={styles.backIconCircle}><IconoFlechaAtras/></div>
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