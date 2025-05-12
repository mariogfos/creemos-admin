"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './News.module.css';
import { 
  IconoFlechaAtras,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from '../components/Icons';

interface NewsCardProps {
  imageUrl: string;
  imageAlt: string;
  timeAgo: string;
  title: string;
  caption: string;
  imageHeight?: string;
  customClass?: string;
  titleColor?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  imageUrl,
  imageAlt,
  timeAgo,
  title,
  caption,
  imageHeight,
  customClass = '',
  titleColor = styles.textDark
}) => {
  return (
    <div className={`${styles.newsCardBase} ${customClass}`}>
      <div className={styles.newsCardImageContainer} style={{ height: imageHeight || 'auto' }}>
        <img src={imageUrl} alt={imageAlt} className={styles.newsCardImage} />
      </div>
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardTextMain}>
          <span className={styles.newsTimeAgo}>{timeAgo}</span>
          <span className={`${styles.newsTitle} ${titleColor}`}>{title}</span>
        </div>
        <span className={styles.newsCaption}>{caption}</span>
      </div>
    </div>
  );
};

const UltimasNoticias: React.FC = () => {
  const router = useRouter();
  const noticiasRecientesPrincipal = {
    imageUrl: "https://via.placeholder.com/1003x592/60ad2b/ffffff?Text=AssureSoft+Development+Center",
    imageAlt: "AssureSoft Development Center en Green Tower",
    timeAgo: "Hace 2 semanas",
    title: "AssureSoft Expande Operaciones con Nuevo Centro de Desarrollo en Santa Cruz",
    caption: "El centro en Green Tower planea contratar a más de 200 desarrolladores, impulsando la industria tecnológica local.",
  };

  const noticiasRecientesSecundarias = [
    {
      imageUrl: "https://via.placeholder.com/469x251/60ad2b/ffffff?Text=Reforestation+Project",
      imageAlt: "Proyecto de reforestación en Santa Cruz",
      timeAgo: "Hace 1 mes",
      title: "Gran Iniciativa de Reforestación Lanzada en Santa Cruz",
      caption: "El proyecto involucra a comunidades locales en la reforestación de 1,250 ha anuales, promoviendo la sostenibilidad.",
      titleColor: styles.textDeepBlue,
    },
    {
      imageUrl: "https://via.placeholder.com/483x251/60ad2b/ffffff?Text=Creemos+Conference",
      imageAlt: "Conferencia de Creemos sobre crecimiento económico",
      timeAgo: "Hace 1 día",
      title: "Creemos Organiza Conferencia sobre Estrategias de Crecimiento Económico",
      caption: "Cientos asistieron al evento donde líderes discutieron planes para el futuro de Santa Cruz.",
      titleColor: styles.textDeepBlue,
    },
  ];

  const noticiasPasadas = Array(7).fill({
    imageUrl: "https://via.placeholder.com/350x202/cccccc/ffffff?Text=Health+Project",
    imageAlt: "Proyecto de salud en Santa Cruz",
    timeAgo: "Hace 3 meses",
    title: "Santa Cruz Lidera en Participación Social para la Salud Indígena",
    caption: "Iniciativa mejora el acceso a la salud para comunidades indígenas con apoyo de la OPS/OMS.",
  });

  return (
    <div className={styles.pageContainer}>
      {/* Cabecera */}
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
            <div className={styles.backIconCircle} onClick={() => router.push('/')}><IconoFlechaAtras/></div>
            <span className={styles.pageTitle}>Noticias</span>
          </div>
        </div>
      </div>

      {/* Sección Recientes */}
      <div className={styles.newsSection}>
        <h2 className={styles.sectionTitle}>Recientes</h2>
        <div className={styles.recientesContent}>
          <div className={styles.recientesPrincipalCard}>
            <NewsCard
              {...noticiasRecientesPrincipal}
              imageHeight="592px"
            />
          </div>
          <div className={styles.recientesSecundariasColumna}>
            {noticiasRecientesSecundarias.map((noticia, index) => (
              <NewsCard
                key={`reciente-sec-${index}`}
                {...noticia}
                imageHeight="251px"
                titleColor={noticia.titleColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección Pasadas */}
      <div className={styles.newsSectionPasadas}>
        <h2 className={styles.sectionTitle}>Pasadas</h2>
        <div className={styles.pasadasContent}>
          {noticiasPasadas.map((noticia, index) => (
            <NewsCard
              key={`pasada-${index}`}
              {...noticia}
              customClass={styles.pasadaCard}
              imageHeight="202px"
            />
          ))}
        </div>
      </div>

      {/* Imágenes del final (decorativas/laterales?) */}
      <div className={styles.decorativeImagesContainer}>
        <img className={styles.decorativeImageTall} src="https://via.placeholder.com/99x494/eeeeee/999999?Text=Ad" alt="Decoración lateral 1" />
        <img className={styles.decorativeImageTall} src="https://via.placeholder.com/99x496/eeeeee/999999?Text=Ad" alt="Decoración lateral 2" />
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

export default UltimasNoticias;