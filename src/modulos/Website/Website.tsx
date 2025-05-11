"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Website.module.css';

// Iconos SVG como componentes React para mayor limpieza
const IconoFlechaIzquierda = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.svgIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const IconoFlechaDerecha = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.svgIcon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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


const IconoChevronAbajo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.chevronSvgIcon}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);


const Website: React.FC = () => {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      

      {/* Barra de Navegación */}
      <div className={styles.navBar}>
        <div className={styles.navContent}>
          <div className={styles.navLogoContainer}>
            <img className={styles.navLogo} src="/images/logo.png" alt="Logo" />
          </div>
          <div className={styles.navLinksAndActions}>
            <div className={styles.socialIconsContainer}>
              <div className={styles.socialIconCircle}><IconoFacebook /></div>
              <div className={styles.socialIconCircle}><IconoTwitter /></div>
              <div className={styles.socialIconCircle}><IconoInstagram /></div>
              <div className={styles.socialIconCircle}><IconoYouTube /></div>
            </div>
            <div className={styles.navMenuAndButtons}>
              <div className={styles.navMenuItems}>
                <span className={styles.navLink} onClick={() => router.push('/')}>Inicio</span>
                <span className={styles.navLink} onClick={() => router.push('/history')}>Historia</span>
                <span className={styles.navLink} onClick={() => scrollToSection('autoridades')}>Autoridades</span>
              </div>
              <div className={styles.navButtons}>
                <div className={styles.navButtonOutline} onClick={() => scrollToSection('ser-parte')}>
                  <span className={styles.navButtonTextWhite}>Ser Parte</span>
                </div>
                <button className={styles.navButtonSolid} onClick={() => router.push('/login')}>
                  <span className={styles.navButtonTextPrimary}>Iniciar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className={styles.heroImage} src="/images/Portada-web.png" alt="Hero" />

      {/* Sección de Noticias/Obras/Plan */}
      <div className={styles.cardsSection}>
        <div className={styles.card}>
          <img className={styles.cardImage} src="/images/Noticia-1.png" alt="Últimas noticias" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Últimas noticias</span>
          </div>
        </div>
        <div className={styles.card}>
          <img className={styles.cardImage} src="/images/Obra-1.png" alt="Obras entregadas" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Obras entregadas</span>
          </div>
        </div>
        <div className={styles.card}>
          <img className={styles.cardImage} src="/images/Plan-1.png" alt="Plan de gobierno" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Plan de gobierno</span>
          </div>
        </div>
      </div>

      {/* Sección Conviértete en Simpatizante */}
      <div className={styles.simpatizanteSection}>
        <img className={styles.simpatizanteImage} src="/images/Simpatizante-1.png" alt="Conviértete en simpatizante" />
        <div className={styles.simpatizanteTextContainer}>
          <div className={styles.simpatizanteTextContent}>
            <span className={styles.titleDark}>Conviértete en simpatizante</span>
            <span className={styles.textGrayNormal}>Ser simpatizante es ser parte del cambio. Al unirte como simpatizante, no solo apoyas nuestra visión, sino que te conviertes en un agente activo de transformación.</span>
          </div>
          <div className={styles.simpatizanteIconContainer}>
            <img className={styles.simpatizanteIcon} src="/images/Qr-simpatizante.png" alt="Icono" />
          </div>
        </div>
      </div>

      {/* Sección Conoce Nuestras Autoridades */}
      <div id="autoridades" className={styles.autoridadesSection}>
        <div className={styles.autoridadesText}>
          <span className={styles.titleDark}>Conoce nuestras autoridades</span>
          <span className={styles.textGrayNormal}>El equipo que guía nuestra organización. Son las mentes visionarias que han trazado el rumbo que seguimos, los estrategas que nos impulsan hacia nuestras metas y los líderes que inspiran nuestro compromiso.</span>
        </div>
        <div className={styles.autoridadesGridContainer}>
          <div className={styles.autoridadesGrid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={styles.autoridadCard}>
                <img className={styles.autoridadImage} src={`/images/Autoridad-${i}.png`} alt={`Luis Fernando Camacho ${i}`} />
                <div className={styles.autoridadCaption}>
                  <span className={styles.autoridadName}>Luis Fernando Camacho</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.autoridadesNav}>
            <div className={styles.navArrowCircle}><IconoFlechaIzquierda /></div>
            <div className={styles.navArrowCircle}><IconoFlechaDerecha /></div>
          </div>
        </div>
      </div>

      {/* Sección Portada con Texto */}
      <div className={styles.portadaFullWidth}>
        <img className={styles.portadaFullWidthImage} src="/images/Portada-donacion-1.png" alt="Portada" />
        {/* Este div parece ser solo una barra de color, revisar si tiene contenido */}
        <div className={styles.portadaColorBar}></div>
        {/* Contenedor para el texto superpuesto (necesitaría posicionamiento absoluto) */}
        <div className={styles.portadaTextOverlay}>
            <div className={styles.portadaTextContent}>
                <span className={styles.titleWhiteLarge}>¡Una nueva Bolivia!</span>
                <span className={styles.textLightGray}>Construyamos una Bolivia unida, próspera y libre de corrupción. Donde la libertad y democracia sean la base de nuestro futuro.</span>
                <div className={styles.nuevaBoliviaButton}>
                  <span className={styles.navButtonTextWhite}>Ser parte</span>
                </div>
            </div>
        </div>
      </div>


      {/* Sección ¡Una nueva Bolivia! */}
      <div className={styles.nuevaBoliviaSection}>
        
      </div>


      {/* Sección ¡Tu voz al poder! */}
      <div className={styles.tuVozSection}>
        <div className={styles.tuVozVideoContainer}>
          <iframe
            src="https://www.youtube.com/embed/cPYhh92npYQ?si=SNrA_MHvPeOeN38C"
            width="720"
            height="410"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
        <div className={styles.tuVozText}>
          <span className={styles.titleDark}>¡Tu voz al poder!</span>
          <span className={styles.textGrayNormal}>Queremos que sean parte activa de la construcción de nuestro futuro. Sus propuestas son el motor que impulsa nuestro cambio, y nos comprometemos a darles el espacio y el reconocimiento que merecen.</span>
        </div>
      </div>
      {/* Sección Sé parte del cambio (Formulario) */}
      <div id="ser-parte" className={styles.formularioSection}>
        <div className={styles.formularioContainer}>
          <span className={styles.titleDark}>Sé parte del cambio</span>
          <div className={styles.formularioBox}>
            <div className={styles.formInputsContainer}>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Primer nombre</span>
                </div>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Segundo nombre</span>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Apellido paterno</span>
                </div>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Apellido materno</span>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Cedula de identidad</span>
                </div>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Fecha de nacimiento</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapper}>
                  <span className={styles.formLabel}>Correo electrónico</span>
                </div>
                <div className={styles.formInputWrapperNumero}>
                  <div className={styles.formLabelMultilineSmall}>Número de whatsApp</div>
                  <div className={styles.formNumeroContent}>
                    <div className={styles.formPrefijo}>
                      <span className={styles.formPrefijoText}>+591</span>
                      <div className={styles.formIconSmall}><IconoChevronAbajo/></div>
                    </div>
                    <span className={styles.formNumeroSeparador}>|</span>
                    <span className={styles.formNumeroText}>74837560</span>
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Provincia</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Municipio</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Distrito municipal</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Localidad</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
              </div>
              <div className={styles.formRowFull}>
                <div className={styles.formInputWrapperWithIcon}>
                  <div className={styles.formLabelMultiline}>Recinto electoral</div>
                  <div className={styles.formIcon}><IconoChevronAbajo/></div>
                </div>
              </div>
            </div>
            <div className={styles.formularioButton}>
              <span className={styles.navButtonTextWhite}>Registrarme</span>
            </div>
          </div>
        </div>
      </div>
       {/* Sección Seguinos en las redes */}
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

export default Website;