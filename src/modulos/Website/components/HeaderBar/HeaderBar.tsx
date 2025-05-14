"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Si el logo debe enlazar a la home
import styles from './HeaderBar.module.css'; // CSS específico para este componente
import { 
  IconoFlechaAtras,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from '../Icons'; // Ajusta la ruta a tu archivo de iconos

interface HeaderBarProps {
  pageTitle: string;
  showBackButton?: boolean; // Para controlar si se muestra el botón de atrás
  backButtonAction?: () => void; // Acción personalizada para el botón de atrás
}

const HeaderBar: React.FC<HeaderBarProps> = ({ 
  pageTitle, 
  showBackButton = true, 
  backButtonAction 
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      router.back(); // Comportamiento por defecto
    }
  };

  return (
    <div className={styles.headerBar}>
      <div className={styles.headerContent}>
        {/* Logo Section */}
        <div className={styles.headerLogoAndSocial}>
          <Link href="/" passHref className={styles.headerLogoContainerLink}>
              <div className={styles.headerLogoContainer}>
                <img className={styles.headerLogo} src="/images/logo.png" alt="Logo Creemos" />
              </div>
          </Link>
          <div className={styles.headerSocialIcons}>
            <a href="https://www.facebook.com/creemosboliviaoficial" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleSmall}>
              <IconoFacebook />
            </a>
            <a href="https://twitter.com/CreemosBolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleSmall}>
              <IconoTwitter />
            </a>
            <a href="https://www.instagram.com/creemosbolivia" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleSmall}>
              <IconoInstagram />
            </a>
            <a href="https://www.youtube.com/channel/UClIsL03fW3HeAQnF8t-kZ_A" target="_blank" rel="noopener noreferrer" className={styles.socialIconCircleSmall}> {/* Asumiendo un enlace de YouTube genérico */}
              <IconoYouTube />
            </a>
          </div>
        </div>
        
        {/* Page Title Section (Centered on Desktop) */}
        <div className={styles.pageTitleBar}>
          {showBackButton && (
            <div className={styles.backIconCircle} onClick={handleBackClick}>
              <IconoFlechaAtras />
            </div>
          )}
          <span className={styles.pageTitle}>{pageTitle}</span>
        </div>

        {/* Placeholder para equilibrar el flexbox en desktop si es necesario, o se puede omitir */}
        <div className={styles.headerRightPlaceholder}></div>
      </div>
    </div>
  );
};

export default HeaderBar;