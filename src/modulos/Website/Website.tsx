"use client";

import React, { useState, useEffect } from 'react'; // Agregado useState y useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Website.module.css';
import SerParteForm from './components/SerParteForm/SerParteForm';
import { 
  IconoFlechaAtras, // No se usa directamente aquí, pero puede estar en Icons.tsx
  IconoFlechaDerecha, // No se usa directamente aquí
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from './components/Icons'; // Asegúrate que la ruta es correcta

// Icono para el menú hamburguesa (puedes moverlo a tu archivo Icons.tsx)
const IconoMenuHamburguesa = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Icono para cerrar el menú (puedes moverlo a tu archivo Icons.tsx)
const IconoCerrarMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const IconoChevronAbajo = () => ( // Este ya lo tenías
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={styles.chevronSvgIcon}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const Website: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Efecto para cerrar el menú si la pantalla se agranda
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) { // El breakpoint donde aparece el menú hamburguesa
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Efecto para prevenir scroll en body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // Limpiar al desmontar
    };
  }, [isMobileMenuOpen]);


  const handleNavLinkClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false); // Cerrar menú al navegar
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Cerrar menú después de hacer scroll
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.navBar}>
        <div className={styles.navContent}>
          <div className={styles.navLogoContainer}>
            <Link href="/" passHref>
              <img className={styles.navLogo} src="/images/logo.png" alt="Logo" />
            </Link>
          </div>

          {/* Botón Hamburguesa para Móvil */}
          <button className={styles.navMenuToggle} onClick={toggleMobileMenu} aria-expanded={isMobileMenuOpen} aria-label="Toggle navigation">
            {isMobileMenuOpen ? <IconoCerrarMenu /> : <IconoMenuHamburguesa />}
          </button>

          {/* Contenedor de Enlaces y Acciones (Panel del Menú Móvil) */}
          <div className={`${styles.navLinksAndActions} ${isMobileMenuOpen ? styles.active : ''}`}>
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
                <span className={styles.navLink} onClick={() => handleNavLinkClick('/')}>Inicio</span>
                <span className={styles.navLink} onClick={() => handleNavLinkClick('/history')}>Historia</span>
                <span className={styles.navLink} onClick={() => handleNavLinkClick('/obras')}>Obras</span>
                <span className={styles.navLink} onClick={() => handleNavLinkClick('/carnet')}>Carnet Simpatizante</span>
              </div>
              <div className={styles.navButtons}>
                <div className={styles.navButtonOutline} onClick={() => scrollToSection('ser-parte')}>
                  <span className={styles.navButtonTextWhite}>Ser Parte</span>
                </div>
                <button className={styles.navButtonSolid} onClick={() => handleNavLinkClick('/login')}>
                  <span className={styles.navButtonTextPrimary}>Iniciar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <img className={styles.heroImage} src="/images/Portada-web.png" alt="Hero" />

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

      <div className={styles.simpatizanteSection}>
        <img className={styles.simpatizanteImage} src="/images/Simpatizante-1.png" alt="Conviértete en simpatizante" />
        <div className={styles.simpatizanteTextContainer}>
          <div className={styles.simpatizanteTextContent}>
            <span className={styles.titleDark}>Conviértete en simpatizante</span>
            <span className={styles.textGrayNormal}>Ser simpatizante es ser parte del cambio. Al unirte como simpatizante, no solo apoyas nuestra visión, sino que te conviertes en un agente activo de transformación.</span>
          </div>
          <div className={styles.simpatizanteIconContainer}>
            <img className={styles.simpatizanteIcon} src="/images/qr.png" alt="Icono QR" />
          </div>
        </div>
      </div>

      <div id="autoridades" className={styles.autoridadesSection}>
        <div className={styles.autoridadesText}>
          <span className={styles.titleDark}>Conoce nuestras autoridades</span>
          <span className={styles.textGrayNormal}>El equipo que guía nuestra organización. Son las mentes visionarias que han trazado el rumbo que seguimos, los estrategas que nos impulsan hacia nuestras metas y los líderes que inspiran nuestro compromiso.</span>
        </div>
        <div className={styles.autoridadesGridContainer}>
          <div className={styles.autoridadesGrid}>
            {[
              { name: "Luis Fernando Camacho", image: 1 },
              { name: "Zvonko Marincovich", image: 2 },
              { name: "Fernando Pareja", image: 3 },
              { name: "Efrain Suarez", image: 4 },
              { name: "Henry Montero", image: 5 },
              { name: "Asambleista", image: 6 }
            ].map((autoridad, i) => (
              <div key={i} className={styles.autoridadCard}>
                <img className={styles.autoridadImage} src={`/images/Autoridad-${autoridad.image}.png`} alt={autoridad.name} />
                <div className={styles.autoridadCaption}>
                  <span className={styles.autoridadName}>{autoridad.name}</span>
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

      <div className={styles.portadaFullWidth}>
        <img className={styles.portadaFullWidthImage} src="/images/Portada-donacion-1.png" alt="Portada" />
        <div className={styles.portadaColorBar}></div>
        <div className={styles.portadaTextOverlay}>
            <div className={styles.portadaTextContent}>
                <span className={styles.titleWhiteLarge}>¡Una nueva Bolivia!</span>
                <span className={styles.textLightGray}>Construyamos una Bolivia unida, próspera y libre de corrupción. Donde la libertad y democracia sean la base de nuestro futuro.</span>
                <div className={styles.nuevaBoliviaButton} onClick={() => scrollToSection('ser-parte')}>
                  <span className={styles.navButtonTextWhite}>Ser parte</span>
                </div>
            </div>
        </div>
      </div>

      {/* Sección ¡Una nueva Bolivia! está vacía en el HTML, la mantengo así */}
      <div className={styles.nuevaBoliviaSection}>
      </div>

      <div className={styles.tuVozSection}>
        <div className={styles.tuVozVideoContainer}>
          <iframe
            src="https://www.youtube.com/embed/cPYhh92npYQ?si=SNrA_MHvPeOeN38C" // Reemplaza con tu URL de video real
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Video Tu Voz al Poder" // Añadido title para accesibilidad
          ></iframe>
        </div>
        <div className={styles.tuVozText}>
          <span className={styles.titleDark}>¡Tu voz al poder!</span>
          <span className={styles.textGrayNormal}>Queremos que sean parte activa de la construcción de nuestro futuro. Sus propuestas son el motor que impulsa nuestro cambio, y nos comprometemos a darles el espacio y el reconocimiento que merecen.</span>
        </div>
      </div>

      {/* La sección se identifica por el id "ser-parte" para el scroll */}
      <div id="ser-parte">
        <SerParteForm />
      </div>

      <div className={styles.redesSection}>
        <span className={styles.titleWhiteMedium}>Seguinos en las redes</span>
        <div className={styles.redesIconsContainer}>
            <a href="https://www.facebook.com/creemosboliviaoficial" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleLarge}><IconoFacebook /></a>
            <a href="https://twitter.com/CreemosBolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleLarge}><IconoTwitter /></a>
            <a href="https://www.instagram.com/creemosbolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleLarge}><IconoInstagram /></a>
            <a href="https://www.youtube.com/@creemosbolivia2786" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleLarge}><IconoYouTube /></a>
        </div>
      </div>
    </div>
  );
};

export default Website;