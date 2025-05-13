// RenderView.tsx (para Supporters)
import React from 'react';
import DataModal from '@/mk/components/ui/DataModal/DataModal'; // Importa DataModal
import styles from './Supporters.module.css'; // Asegúrate que este path es correcto
import { Avatar } from '@/mk/components/ui/Avatar/Avatar';
import { getUrlImages, getFullName } from '@/mk/utils/string'; // getFullName también
import { getDateTimeStrMes } from "@/mk/utils/date"; // Para consistencia con otros lados

interface RenderViewSupporterProps {
  item: any;
  open: boolean;
  onClose: () => void;
  extraData?: any; // Para resolver IDs a nombres, si es necesario
}

const RenderView: React.FC<RenderViewSupporterProps> = ({ item, open, onClose, extraData }) => {
  if (!item) {
    return null; // No renderizar nada si no hay item
  }

  const getGenderText = (gender: string) => {
    if (gender === 'M') return 'Masculino';
    if (gender === 'F') return 'Femenino';
    return 'No especificado';
  };

  const getMilitantType = (typeKey: string | number) => {
    // Intenta buscar en extraData si los tipos de militancia vienen de ahí
    if (extraData?.militanses) {
        const foundType = extraData.militanses.find((m: any) => String(m.id) === String(typeKey));
        if (foundType) return foundType.name;
    }
    // Fallback a tu lógica original si no se encuentra en extraData o extraData.militanses no existe
    const types: { [key: string]: string } = {
      '1': 'Militancia Activa',
      '2': 'Presidente de Barrio',
      '3': 'Encargado de Recinto',
      '4': 'Simpatizante',
      '5': 'Adherente'
    };
    return types[String(typeKey)] || 'No especificado';
  };

  // Funciones para obtener nombres de provincia, municipio, etc., usando extraData
  // Estas son ejemplos, ajusta 'idField' y 'nameField' según la estructura de tu extraData
  const getNameFromExtraData = (id: any, dataKey: string, idField = 'id', nameField = 'name') => {
    if (!extraData || !extraData[dataKey] || !id) return id || 'No especificado';
    const found = extraData[dataKey].find((d: any) => String(d[idField]) === String(id));
    return found?.[nameField] || id;
  };


  return (
    <DataModal
      open={open}
      onClose={onClose}
      title={`Detalle de: ${getFullName(item)}`}
      buttonText="" // No botón de guardar
      buttonCancel="Cerrar" // Texto para el botón de cerrar
    >
      <div className={styles.userDetailContainer}>
        <div className={styles.userHeader}>
          <Avatar 
            src={getUrlImages(
              "/AFF-" + (item?.affiliate_id || item?.id) + ".webp?d=" + item?.updated_at
            )}
            name={getFullName(item)}
            h={60}
            w={60}
            // className={styles.avatar} // Si tienes estilos específicos
          />
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>
              {getFullName(item)} {/* Usar getFullName es más robusto */}
            </h2>
            <p className={styles.userRole}>
              {getMilitantType(item.militancy_id)}
            </p>
          </div>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.detailSection}>
            <h3>Información Personal</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Cédula de Identidad:</span>
                <span className={styles.detailValue}>{item.ci || 'No especificado'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Género:</span>
                <span className={styles.detailValue}>{getGenderText(item.gender)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Nacimiento:</span>
                <span className={styles.detailValue}>{item.birthdate ? getDateTimeStrMes(item.birthdate) : 'No especificada'}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Información de Contacto</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Teléfono:</span>
                <span className={styles.detailValue}>
                  {item.prefix_phone ? `+${item.prefix_phone} ` : ''}{item.phone || 'No especificado'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Correo Electrónico:</span>
                <span className={styles.detailValue}>{item.email || 'No especificado'}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Ubicación</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Provincia:</span>
                <span className={styles.detailValue}>{getNameFromExtraData(item.prov_code, 'provs', 'code')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Municipio:</span>
                <span className={styles.detailValue}>{getNameFromExtraData(item.mun_code, 'muns', 'code')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Distrito Municipal:</span>
                <span className={styles.detailValue}>{getNameFromExtraData(item.dist_code, 'dists', 'code')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Localidad:</span>
                <span className={styles.detailValue}>{getNameFromExtraData(item.local_code, 'locals', 'code')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Recinto:</span>
                <span className={styles.detailValue}>{getNameFromExtraData(item.recint_code, 'recints', 'code')}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Información de Registro</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Registro:</span>
                <span className={styles.detailValue}>
                  {item.created_at ? getDateTimeStrMes(item.created_at) : 'No especificado'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Última Actualización:</span>
                <span className={styles.detailValue}>
                  {item.updated_at ? getDateTimeStrMes(item.updated_at) : 'No especificado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataModal>
  );
};

export default RenderView;