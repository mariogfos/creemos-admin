import { useEffect, useState } from "react";
import { Card } from "@/mk/components/ui/Card/Card";
import styles from "./WidgetPercentage.module.css";
import { getDateStrMes, getUTCNow } from "@/mk/utils/date";
import Table from "@/mk/components/ui/Table/Table";
import GraphBase from "@/mk/components/ui/Graphs/GraphBase";
import { COLORS20 } from "@/mk/components/ui/Graphs/GraphsTypes";

interface WidgetPercentageProps {
  data: any;
  // user:any,
  index: number;
  title?: string;
  subtitle?: string;
}

const WidgetPercentage = ({ data ,title,subtitle,index}: WidgetPercentageProps) => {
  // console.log(data,'data desde wid%')
  const [dataFormatted, setDataFormatted] = useState([]);
  const [graphData, setGraphData] = useState({ labels: [], values: [] });
  const allAnswersCountZero = data?.soptions?.every((item:any) => item.sanswers_count === 0);

  useEffect(() => {
    if (data?.soptions) {
      const { soptions } = data;
      const labels: any = [];
      const values: any = [];
      const formattedData: any = [];

      let totalResponses = 0;
      soptions.forEach((soption: any) => {
        totalResponses += soption.sanswers_count;
      });

      soptions.forEach((soption: any) => {
        const percentage = (soption.sanswers_count / totalResponses) * 100;
        const formattedPercentage = Number.isNaN(percentage)
          ? "0 %"
          : `${percentage.toFixed(2)} %`;
        labels.push(soption.name);
        values.push({
          name: soption.name,
          values: [percentage],
        });
        formattedData.push({
          ...soption,
          percentage: formattedPercentage,
        });
      });

      const newGraphData = {
        labels: labels,
        values: values,
      };

      setDataFormatted(formattedData);
      setGraphData(newGraphData);
    }
  }, [data]);
 
  const calcPercentage = (total: any, valor: any) => {
  
    if (total === 0) {
      return 0;
    }
    return (valor / total) * 100;
  };
  
  return (
    <div className={styles["widgetPercentage"]} key={index}>
        {data?.soptions && data.soptions.length > 0 ? (
        
      <div>
          <div className="tTitle" style={{marginBottom:16}}>{title}</div>
        <div className="tTitle" style={{marginBottom:16}}>{data?.data?.name}</div>
       { allAnswersCountZero ? (
            <div  style={{ padding: 16, textAlign: "center",minHeight:300 ,alignItems:'center',justifyContent:'center',display:'flex'}} className="tSubtitle">
             Ningún afiliado contestó esta encuesta
            </div>
          ) :(
        <div className={styles["widgetPercentageContent"]}>
          
          <div style={{justifyContent:data?.soptions?.length >=5 ?'':'center'}} className={styles["cardsInfoContainer"]}>
            {data?.soptions?.sort((a:any, b:any) => b.sanswers_count - a.sanswers_count) .map((item: any, index: any) => (
              <div className={styles["cardInfo"]} key={index}>             
                <div>{item.name}</div>
                <div>{item.sanswers_count}</div>
              </div>
            ))}
       
          </div>
          <div className={styles["percentagePie"]}>
            <GraphBase
              data={graphData}
              chartTypes={["donut"]}
              options={{
                height: 240,
                colors:COLORS20,
              }}
              // downloadPdf={true}
            />
          </div>
        </div>)}
      </div>):<div style={{padding:16,textAlign:"center"}} className="tSubtitle">No hay datos para mostrar</div>}
    </div>
  );
};

export default WidgetPercentage;
