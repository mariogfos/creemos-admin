"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Obras.module.css';
import { 
  IconoFlechaAtras,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from '../components/Icons';

interface ObraItemProps {
  imageUrl: string;
  imageAlt: string;
  captionText: string;
}

const ObraCard: React.FC<ObraItemProps> = ({ imageUrl, imageAlt, captionText }) => {
  return (
    <div className={styles.obraCardContainer}>
      <img src={imageUrl} alt={imageAlt} className={styles.obraImage} />
      <div className={styles.obraCaption}>
        <span className={styles.obraCaptionText}>{captionText}</span>
      </div>
    </div>
  );
};


const ObrasEntregadas: React.FC = () => {
  const router = useRouter();
  const [activeGestion, setActiveGestion] = useState<string>("2025");
  const gestiones = ["2025", "2024", "2023", "2022"];

  const obrasData: ObraItemProps[][] = [
    [
      { imageUrl: "/images/Obras/Obra-1.png", imageAlt: "Hospital Trinidad", captionText: "Entrega del Hospital trinidad" },
      { imageUrl: "/images/Obras/Obra-2.png", imageAlt: "Módulo Educativo", captionText: "Módulo educativo Florinda Barba" },
      { imageUrl: "/images/Obras/Obra-3.png", imageAlt: "Maquinas Laboratorio", captionText: "Entrega maquinas de laboratorio de última generación" },
    ],
    [
      { imageUrl: "/images/Obras/Obra-4.png", imageAlt: "Mural a la mujer", captionText: "Entrega de mural a la mujer" },
      { imageUrl: "/images/Obras/Obra-5.png", imageAlt: "Hospital Pampa de la Isla", captionText: "Hospital de 1er nivel en la pampa de la Isla" },
      { imageUrl: "/images/Obras/Obra-6.png", imageAlt: "Módulo Univalle", captionText: "Módulo educativo Univalle Santa Cruz" },
    ],
    [
      { imageUrl: "/images/Obras/Obra-7.png", imageAlt: "Desayuno Escolar", captionText: "Entrega de insumos para el desayuno escolar" },
      { imageUrl: "/images/Obras/Obra-8.png", imageAlt: "Agua Moro Moro", captionText: "Entrega de agua potable en Moro Moro" },
      { imageUrl: "/images/Obras/Obra-9.png", imageAlt: "Electricidad Montero", captionText: "Electricidad para Montero Hoyos" },
    ]
  ];


  return (
    <div className={styles.pageContainer}>
      {/* Cabecera */}
      <div className={styles.headerBar}>
        <div className={styles.headerContent}>
          <div className={styles.headerLogoContainer}>
            <img className={styles.headerLogo} src="/images/logo.png" alt="Logo" />
          </div>
          <div className={styles.headerSocialIcons}>
            <div className={styles.socialIconCircleSmall}><IconoFacebook /></div>
            <div className={styles.socialIconCircleSmall}><IconoTwitter /></div>
            <div className={styles.socialIconCircleSmall}><IconoInstagram /></div>
            <div className={styles.socialIconCircleSmall}><IconoYouTube /></div>
          </div>
        </div>
        <div className={styles.pageTitleBar}>
          <div className={styles.backIconCircle} onClick={() => router.push('/')}><IconoFlechaAtras/></div>
          <span className={styles.pageTitle}>Obras entregadas</span>
        </div>
      </div>

      

      {/* Navegación por Gestión */}
      <div className={styles.gestionNavContainer}>
        <div className={styles.gestionNav}>
          {gestiones.map(gestion => (
            <div 
              key={gestion} 
              className={`${styles.gestionNavItem} ${activeGestion === gestion ? styles.activeGestion : ''}`}
              onClick={() => setActiveGestion(gestion)}
            >
              <span className={styles.gestionNavText}>Gestión {gestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Obras */}
      <div className={styles.obrasGridContainer}>
        {obrasData.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.obrasRow}>
            {row.map((obra, obraIndex) => (
              <ObraCard 
                key={`${rowIndex}-${obraIndex}`}
                imageUrl={obra.imageUrl}
                imageAlt={obra.imageAlt}
                captionText={obra.captionText}
              />
            ))}
          </div>
        ))}
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

export default ObrasEntregadas;