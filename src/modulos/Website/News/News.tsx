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
import HeaderBar from '../components/HeaderBar/HeaderBar';

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
    imageUrl: "https://www.assuresoft.com/sites/default/files/pic-santa.png.webp", // Imagen del edificio Green Tower en Santa Cruz
    imageAlt: "AssureSoft Development Center en Green Tower",
    timeAgo: "Hace 2 semanas",
    title: "AssureSoft Expande Operaciones con Nuevo Centro de Desarrollo en Santa Cruz",
    caption: "El centro en Green Tower planea contratar a más de 200 desarrolladores, impulsando la industria tecnológica local.",
  };
  
  const noticiasRecientesSecundarias = [
    {
      imageUrl: "https://pulsoempresarial.com.bo/wp-content/uploads/2022/11/Proyecto-nuevo-almacigos.jpg", // Imagen de la campaña de reforestación en Santa Cruz
      imageAlt: "Proyecto de reforestación en Santa Cruz",
      timeAgo: "Hace 1 mes",
      title: "Gran Iniciativa de Reforestación Lanzada en Santa Cruz",
      caption: "El proyecto involucra a comunidades locales en la reforestación de 1,250 ha anuales, promoviendo la sostenibilidad.",
      titleColor: styles.textDeepBlue,
    },
    {
      imageUrl: "https://vision360-s3.cdn.net.ar/s3i233/2024/11/vision360/images/01/21/24/1212421_8025996730cab995b69e4a06d1ed54bdea2566ecb822a650683c45f00779a885/md.webp", // Imagen del foro empresarial organizado por CAINCO
      imageAlt: "Conferencia de Creemos sobre crecimiento económico",
      timeAgo: "Hace 1 día",
      title: "Creemos Organiza Conferencia sobre Estrategias de Crecimiento Económico",
      caption: "Cientos asistieron al evento donde líderes discutieron planes para el futuro de Santa Cruz.",
      titleColor: styles.textDeepBlue,
    },
  ];
  
  const noticiasPasadas = Array(7).fill({
    imageUrl: "https://estaticos.unitel.bo/binrepository/498x281/45c0/420d280/none/246276540/RCEC/elon-musk_101-8428275_20240306202448.png", // Imagen representativa de proyectos de salud indígena en Santa Cruz
    imageAlt: "Proyecto de salud en Santa Cruz",
    timeAgo: "Hace 3 meses",
    title: "Santa Cruz Lidera en Participación Social para la Salud Indígena",
    caption: "Iniciativa mejora el acceso a la salud para comunidades indígenas con apoyo de la OPS/OMS.",
  });
  
  return (
    <div className={styles.pageContainer}>
      {/* Cabecera */}
      <HeaderBar pageTitle="Noticias" showBackButton={true} />

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

      {/* Video de Facebook */}
      <div className={styles.decorativeImagesContainer}>
        <iframe 
          src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D973786977952703&show_text=false"
          width="100%"
          height="495"
          style={{border: 'none', overflow: 'hidden'}}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
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