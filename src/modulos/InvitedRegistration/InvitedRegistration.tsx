"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './InvitedRegistration.module.css';
import SerParteForm from '../Website/components/SerParteForm/SerParteForm';
import { IconoFacebook, IconoTwitter, IconoInstagram, IconoYouTube, IconoFlechaAtras } from '../Website/components/Icons';




interface CarnetSimpatizanteProps {
  id: string;
}


const InvitedRegistration: React.FC<CarnetSimpatizanteProps> = ({ id }) => {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      {/* Barra de Navegación */}
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
                <IconoFlechaAtras/>
              </div>
            </div>
            <span className={styles.pageTitle}>Invitación de Simpatizante</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className={styles.mainContent}>
        <SerParteForm />
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

export default InvitedRegistration;
