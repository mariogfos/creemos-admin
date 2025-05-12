// RenderView.tsx
import React from 'react';
import { Avatar } from "@/mk/components/ui/Avatar/Avatar";
import { getFullName, getUrlImages } from "@/mk/utils/string";
import { getDateTimeStrMes } from "@/mk/utils/date";
import styles from './Users.module.css'; // Assuming these styles are appropriate or adjust as needed
import DataModal from '@/mk/components/ui/DataModal/DataModal';

interface RenderViewProps {
  item: any;           // The selected item's data
  open: boolean;       // Controls modal visibility, passed by useCrud
  onClose: () => void; // Function to close the modal, passed by useCrud
  // You can also accept other props useCrud passes if needed:
  // extraData?: any;
  // execute?: Function;
}

const RenderView: React.FC<RenderViewProps> = ({ item, open, onClose }) => {
  // If item is null or undefined (e.g., modal is closing or no item selected),
  // you might want to render nothing or a loader, though DataModal's open prop handles visibility.
  if (!item) {
    return null;
  }

  return (
    <DataModal
      open={open}          // Use the 'open' prop from useCrud
      onClose={onClose}      // Use the 'onClose' prop from useCrud
      title="Detalles del Usuario"
      buttonText=""          // View modals usually don't have a "Save" button
      buttonCancel="Cerrar"  // Label for the close button
    >
      <div className={styles.userDetailContainer}> {/* Ensure these styles exist and are correctly applied */}
        <div className={styles.userHeader}>
          <Avatar
            src={getUrlImages(
              // Use affiliate_id if present, otherwise fallback to id for the avatar
              "/AFF-" + (item?.affiliate_id || item?.id) + ".webp?d=" + item?.updated_at
            )}
            name={getFullName(item)}
            h={60} // Example height
            w={60} // Example width
          />
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{getFullName(item)}</h2>
            {/* You might want to get role from item if available: e.g., <p>{item?.role}</p> */}
            {/* <p className={styles.userRole}>Administrador</p> */}
          </div>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.detailSection}>
            <h3>Información Personal</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Cédula de Identidad:</span>
                <span className={styles.detailValue}>{item?.ci || 'No proporcionado'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Teléfono:</span>
                <span className={styles.detailValue}>
                  {item?.prefix_phone ? `+${item.prefix_phone} ` : ''}{item?.phone || 'No proporcionado'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Correo Electrónico:</span>
                <span className={styles.detailValue}>{item?.email || 'No proporcionado'}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Información de Registro</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Registro:</span>
                <span className={styles.detailValue}>{item?.created_at ? getDateTimeStrMes(item.created_at) : 'No proporcionado'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Última Actualización:</span>
                <span className={styles.detailValue}>{item?.updated_at ? getDateTimeStrMes(item.updated_at) : 'No proporcionado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataModal>
  );
};

export default RenderView;