import React from 'react';
import WidgetBase from '@/components/ Widgets/WidgetBase/WidgetBase';
import styles from './WidgetStatusSummary.module.css'
// types.ts
export interface SummaryItem {
    id: string;          // identificador único para cada ítem
    label: string;       // nombre o descripción del ítem (e.g., "Activas")
    value: number;       // valor numérico del ítem (e.g., 12)
    color?: string;      // color opcional de fondo para cada ítem
    icon?: React.ReactNode; // ícono opcional para cada ítem
  }
  
  export interface StatusSummaryProps {
    title: string; 
    subtitle?: string;     
    items: SummaryItem[]; 
  }
// components/StatusSummaryWidget.tsx

const WidgetStatusSummary: React.FC<StatusSummaryProps> = ({ title, subtitle, items }) => {
  return (
   <WidgetBase title={title}  subtitle={subtitle}>   
      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.icon && <span className={styles.icon}  style={{ backgroundColor: item.color || '#f0f0f0' }} >{item.icon}</span>}
            <div>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      </WidgetBase>
  );
};

export default WidgetStatusSummary;
  