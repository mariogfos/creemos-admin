"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './News.module.css';

// --- Iconos SVG (Reutilizar/Definir como en las páginas anteriores) ---
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
// --- Fin Iconos ---

interface NewsCardProps {
  imageUrl: string;
  imageAlt: string;
  timeAgo: string;
  title: string;
  caption: string;
  imageHeight?: string; // para la imagen principal de la tarjeta
  customClass?: string; // Clase adicional para la tarjeta
  titleColor?: string; // Para títulos con color #000018
}

const NewsCard: React.FC<NewsCardProps> = ({
  imageUrl,
  imageAlt,
  timeAgo,
  title,
  caption,
  imageHeight,
  customClass = '',
  titleColor = styles.textDark // color por defecto
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
    imageUrl: "https://via.placeholder.com/1003x592/60ad2b/ffffff?Text=Noticia+Principal",
    imageAlt: "Marcha cívica",
    timeAgo: "Hace 1h",
    title: "El Comité pro Santa Cruz confirmó la marcha convocada para el lunes 24 de marzo en protesta contra la crisis de combustible y la situación económica del país. Stello Cochamanidis, presidente del ente cívico, pidió que el Gobierno actúe de inmediato y permita la importación de carburantes sin restricciones.",
    caption: "Stello cochamanidis en conferencia de presa",
  };

  const noticiasRecientesSecundarias = [
    {
      imageUrl: "https://via.placeholder.com/469x251/60ad2b/ffffff?Text=Entrega+Bombas",
      imageAlt: "Entrega de bombas de agua",
      timeAgo: "Hace 2h",
      title: "Esta tarde nuestro equipo visitó la comunidad de concepción e hicieron la entrega de las bombas de agua",
      caption: "Zvonko al frente de la entrega de bombas de agua en concepción",
      titleColor: styles.textDeepBlue,
    },
    {
      imageUrl: "https://via.placeholder.com/483x251/60ad2b/ffffff?Text=Encuentro+Creemos",
      imageAlt: "Encuentro Creemos",
      timeAgo: "Hace 1d",
      title: "El encuentro 'Creemos' tuvo finalización esta tarde, agradecidos por la participación de todos.",
      caption: "Cierre del encuentro en el plan 3000",
      titleColor: styles.textDeepBlue,
    },
  ];

  const noticiasPasadas = Array(7).fill({
    imageUrl: "https://via.placeholder.com/350x202/cccccc/ffffff?Text=Noticia+Pasada",
    imageAlt: "Vecinos de Saipina",
    timeAgo: "21 h",
    title: "Compartimos con los vecinos del Municipio de Saipina, fue gratificante escucharlos, conocer sus necesidades, preocupaciones, motivaciones y compartir experiencias.",
    caption: "Escuchando a nuestra gente",
  });


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
          <span className={styles.pageTitle}>Noticias</span>
        </div>
      </div>

      {/* Sección Recientes */}
      <div className={styles.newsSection}>
        <h2 className={styles.sectionTitle}>Recientes</h2>
        <div className={styles.recientesContent}>
          <div className={styles.recientesPrincipalCard}>
            <NewsCard
              {...noticiasRecientesPrincipal}
              imageHeight="592px" // Altura específica para la imagen en la tarjeta principal
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
              customClass={styles.pasadaCard} // Clase para estilizar tamaño de fuente diferente
              imageHeight="202px" // Altura de imagen para tarjetas pasadas
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