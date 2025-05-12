"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Website.module.css';
import SerParteForm from './components/SerParteForm/SerParteForm';
import { 
  IconoFlechaAtras,
  IconoFlechaDerecha,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from './components/Icons';


export const IconoChevronAbajo = () => (
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
              <a href="https://www.facebook.com/creemosboliviaoficial" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle}>
                <IconoFacebook />
              </a>
              <a href="https://twitter.com/CreemosBolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle}>
                <IconoTwitter />
              </a>
              <a href="https://www.instagram.com/creemosbolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle}>
                <IconoInstagram />
              </a>
              <a href="https://www.youtube.com/@creemosbolivia2786" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircle}>
                <IconoYouTube />
              </a>
            </div>
            <div className={styles.navMenuAndButtons}>
              <div className={styles.navMenuItems}>
                <span className={styles.navLink} onClick={() => router.push('/')}>Inicio</span>
                <span className={styles.navLink} onClick={() => router.push('/history')}>Historia</span>
                <span className={styles.navLink} onClick={() => router.push('/obras')}>Obras</span>
                <span className={styles.navLink} onClick={() => router.push('/carnet')}>Carnet Simpatizante</span>
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
        <Link href="/news" className={styles.card}>
          <img className={styles.cardImage} src="/images/Noticia-1.png" alt="Últimas noticias" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Últimas noticias</span>
          </div>
        </Link>
        <Link href="/obras" className={styles.card}>
          <img className={styles.cardImage} src="/images/Obra-1.png" alt="Obras entregadas" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Obras entregadas</span>
          </div>
        </Link>
        <Link href="/plan-gobierno" className={styles.card}>
          <img className={styles.cardImage} src="/images/Plan-1.png" alt="Plan de gobierno" />
          <div className={styles.cardCaption}>
            <span className={styles.cardCaptionText}>Plan de gobierno</span>
          </div>
        </Link>
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
            <img className={styles.simpatizanteIcon} src="/images/qr.png" alt="Icono" />
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
            <div className={styles.navArrowCircle}><IconoFlechaAtras /></div>
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
      <SerParteForm />

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