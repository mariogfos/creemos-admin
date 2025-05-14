"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './PlanGobierno.module.css';
import { 
  IconoFlechaAtras,
  IconoFacebook,
  IconoTwitter,
  IconoInstagram,
  IconoYouTube 
} from '../components/Icons';
import HeaderBar from '../components/HeaderBar/HeaderBar';
interface ContentSectionProps {
  title: string;
  paragraphs: {
    subtitle: string;
    content: string;
  }[];
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, paragraphs }) => {
  return (
    <div id={title.toLowerCase().replace(/\s+/g, '-')} className={styles.contentSection}>
      <div className={styles.contentBlock}>
        <span className={styles.contentTitle}>{title}</span>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className={styles.paragraphContainer}>
            <span className={styles.contentSubtitle}>{paragraph.subtitle}</span>
            <span className={styles.contentText}>{paragraph.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanDeGobierno: React.FC = () => {
  const router = useRouter();
  const sectionsData: ContentSectionProps[] = [
    { 
      title: "Introducción", 
      paragraphs: [
        {
          subtitle: "Visión General",
          content: "Creemos presenta un proyecto transformador para construir una Bolivia unida, próspera y con oportunidades para todos. Nuestro plan se sustenta en el diálogo constructivo y la búsqueda de consensos, superando las divisiones del pasado para enfocarnos en el desarrollo sostenible y la justicia social."
        },
        {
          subtitle: "Enfoque",
          content: "Proponemos una nueva forma de hacer política: técnica, eficiente y alejada de populismos. Nuestra hoja de ruta prioriza la reactivación económica, la modernización del Estado y la protección de nuestros recursos naturales para las futuras generaciones."
        }
      ]
    },
    { 
      title: "Presentación de la organización política", 
      paragraphs: [
        {
          subtitle: "Origen y Expansión",
          content: "Creemos es un movimiento ciudadano nacido en Santa Cruz que se ha expandido a nivel nacional, representando los valores de trabajo, progreso y libertad responsable. Desde nuestra fundación en 2019, nos consolidamos como alternativa seria ante la polarización tradicional."
        },
        {
          subtitle: "Liderazgo",
          content: "Liderados por profesionales con experiencia en gestión pública y sector privado, promovemos un modelo de desarrollo integral que combina crecimiento económico con protección social, respetando nuestra diversidad cultural y geográfica."
        }
      ]
    },
    { 
      title: "Principios ideológicos", 
      paragraphs: [
        {
          subtitle: "Fundamentos",
          content: "1. Democracia Participativa: Fortalecimiento de mecanismos de consulta ciudadana y rendición de cuentas\n2. Autonomías Responsables: Profundización del proceso autonómico con equilibrio regional\n3. Economía Social de Mercado: Fomento a la iniciativa privada con protección a sectores vulnerables\n4. Sustentabilidad Ambiental: Crecimiento compatible con la preservación de ecosistemas\n5. Transparencia Radical: Cero tolerancia a la corrupción con sistemas de control ciudadano"
        }
      ]
    },
    { 
      title: "Valores", 
      paragraphs: [
        {
          subtitle: "Pilares Fundamentales",
          content: "● Integridad: Ética como base de toda acción pública\n● Equidad: Oportunidades para todos los bolivianos\n● Solidaridad: Protección efectiva a los más necesitados\n● Innovación: Gobierno digital y modernización administrativa\n● Patriotismo: Defensa de la soberanía con integración global"
        }
      ]
    },
    { 
      title: "Programas y acciones", 
      paragraphs: [
        {
          subtitle: "Desarrollo Económico",
          content: "Reactivación Productiva: Plan Nacional de Infraestructura (5,000 km de caminos), créditos a MIPYMES y atracción de inversiones estratégicas"
        },
        {
          subtitle: "Educación",
          content: "Educación del Siglo XXI: Universalización de la educación digital, becas internacionales y modernización curricular"
        },
        {
          subtitle: "Salud",
          content: "Salud Preventiva: Red de 100 nuevos centros especializados y seguro universal gratuito"
        },
        {
          subtitle: "Seguridad",
          content: "Seguridad Ciudadana: Sistema unificado de emergencias, modernización policial y lucha contra el narcotráfico"
        },
        {
          subtitle: "Medio Ambiente",
          content: "Medio Ambiente: Transición energética progresiva y ley de economía circular"
        },
        {
          subtitle: "Tecnología",
          content: "Tecnología: Conectividad total a internet y transformación digital del Estado"
        }
      ]
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Cabecera */}
      <HeaderBar pageTitle="Plan de Gobierno" showBackButton={true} />


      {/* Título Principal del Plan */}
      <div className={styles.mainPlanTitleContainer}>
        <span className={styles.mainPlanTitleText}>
          Programa de Gobierno<br />Creemos - Una Nueva Bolivia
        </span>
      </div>

      {/* Tabla de Contenido */}
      <div className={styles.tableOfContentsContainer}>
        <span className={styles.tocTitle}>Tabla de contenido</span>
        <div className={styles.tocItems}>
          {sectionsData.map((section, index) => (
            <span 
              key={index} 
              className={styles.tocItem}
              onClick={() => scrollToSection(section.title.toLowerCase().replace(/\s+/g, '-'))}
              style={{ cursor: 'pointer' }}
            >
              {section.title}
            </span>
          ))}
        </div>
      </div>

      {/* Secciones de Contenido */}
      <div className={styles.allContentSectionsWrapper}>
        {sectionsData.map((section, index) => (
          <ContentSection 
            key={index}
            title={section.title}
            paragraphs={section.paragraphs}
          />
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

export default PlanDeGobierno;