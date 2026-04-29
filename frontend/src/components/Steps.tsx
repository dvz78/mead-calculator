import React, { useState } from 'react';
import './Steps.css';

interface Step {
  id: number;
  title: string;
  description: string;
  duration?: string;
  tips?: string[];
}

interface StepsProps {
  tipo: 'hidromiel' | 'vino';
}

const Steps: React.FC<StepsProps> = ({ tipo }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleStepCompletion = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const toggleStepExpansion = (stepId: number) => {
    if (expandedSteps.includes(stepId)) {
      setExpandedSteps(expandedSteps.filter(id => id !== stepId));
    } else {
      setExpandedSteps([...expandedSteps, stepId]);
    }
  };

  const stepsHidromiel: Step[] = [
    {
      id: 1,
      title: "Preparación del Mosto",
      description: "Calienta 3/4 partes del agua total hasta 40-50°C. Agrega la miel poco a poco mientras agitas para disolverla completamente. No hierves la miel.",
      duration: "30-45 minutos",
      tips: [
        "Usa agua filtrada o hervida y enfriada",
        "No hiervas la miel ya que puede alterar su sabor",
        "Mezcla suavemente para evitar formar espuma"
      ]
    },
    {
      id: 2,
      title: "Ajuste de pH y Nutrientes",
      description: "Mide el pH del mosto y ajústalo a 4.0-4.5 si es necesario. Añade nutrientes para levaduras según las instrucciones del fabricante.",
      duration: "15 minutos",
      tips: [
        "El pH ideal es entre 4.0-4.5",
        "Añade nutrientes DAP o Fermaid K en esta etapa"
      ]
    },
    {
      id: 3,
      title: "Enfriamiento",
      description: "Enfría el mosto a 20-24°C usando un mosto enfriador o bañera de hielo. Este paso es crucial para evitar matar la levadura.",
      duration: "30-60 minutos",
      tips: [
        "Nunca agregues levadura en mosto caliente",
        "La temperatura ideal es 20-24°C"
      ]
    },
    {
      id: 4,
      title: "Inoculación de Levadura",
      description: "Espolvorea la levadura directamente sobre el mosto o hidrátala según las instrucciones. Mezcla suavemente.",
      duration: "5 minutos",
      tips: [
        "Para mejor resultado, hidrata la levadura en agua tibia (35-38°C)",
        "Espolvorea uniformemente sobre la superficie del mosto"
      ]
    },
    {
      id: 5,
      title: "Fermentación Primaria",
      description: "Transfiere a un fermentador con tapa hermética y burbujeador. Guarda en lugar oscuro a 18-24°C por 1-3 semanas.",
      duration: "1-3 semanas",
      tips: [
        "Mantén temperatura constante",
        "Evita la luz directa",
        "No destapes el fermentador innecesariamente"
      ]
    },
    {
      id: 6,
      title: "Trasiego",
      description: "Trasiega a un fermentador limpio cuando la actividad disminuya. Repite cada 2-3 semanas hasta que el hidromiel esté claro.",
      duration: "Cada 2-3 semanas",
      tips: [
        "Deja sedimentar durante 24-48 horas antes de trasiegar",
        "Utiliza sifón para evitar transferir sedimento"
      ]
    },
    {
      id: 7,
      title: "Estabilización y Clarificación",
      description: "Añade clarificantes si es necesario. Para detener fermentación, usa metabisulfito de potasio y sorbato de potasio.",
      duration: "1-2 semanas",
      tips: [
        "Clarificantes comunes: bentonita, gelatina",
        "Solo estabiliza si deseas detener la fermentación"
      ]
    },
    {
      id: 8,
      title: "Embotellado",
      description: "Trasiega cuidadosamente a botellas esterilizadas, dejando 2-3cm de espacio. Sella herméticamente.",
      duration: "1 día",
      tips: [
        "Esteriliza botellas con solución de metabisulfito",
        "Deja espacio para expansión del líquido"
      ]
    },
    {
      id: 9,
      title: "Maduración",
      description: "Guarda las botellas en lugar fresco y oscuro. El hidromiel mejora con el tiempo, idealmente 6 meses a 2 años.",
      duration: "6 meses - 2 años",
      tips: [
        "Más tiempo = mejor sabor",
        "Mantén temperatura constante y fresca"
      ]
    }
  ];

  const stepsVino: Step[] = [
    {
      id: 1,
      title: "Preparación del Mosto",
      description: "Extrae el jugo de las uvas o usa jugo concentrado. Calienta a 20-25°C y ajusta azúcar si es necesario para alcanzar la densidad deseada.",
      duration: "1-2 horas",
      tips: [
        "Si usas uvas frescas, machácalas suavemente",
        "Ajusta azúcar para alcanzar 1.090-1.110 de densidad"
      ]
    },
    {
      id: 2,
      title: "Ajuste de pH y Nutrientes",
      description: "Mide el pH (ideal 3.3-3.6) y corrige con ácido cítrico si es necesario. Añade nutrientes para levaduras.",
      duration: "15 minutos",
      tips: [
        "El pH ideal para vino es 3.3-3.6",
        "Añade nutrientes DAP o Fermaid K"
      ]
    },
    {
      id: 3,
      title: "Inoculación de Levadura",
      description: "Hidrata la levadura en agua tibia (35-38°C) por 15 minutos. Añade al mosto y mezcla suavemente.",
      duration: "20 minutos",
      tips: [
        "Hidratar mejora la fermentación",
        "Usa levaduras específicas para vino"
      ]
    },
    {
      id: 4,
      title: "Fermentación Primaria",
      description: "Fermenta con tapa y burbujeador a 20-25°C. Durante los primeros días, haz 'punch downs' para mantener las pieles sumergidas.",
      duration: "5-14 días",
      tips: [
        "Mantén temperatura constante",
        "Para vinos tintos, presiona las pieles diariamente"
      ]
    },
    {
      id: 5,
      title: "Prensado y Trasiego",
      description: "Separa el líquido de las pieles y semillas. Trasiega a fermentador secundario para fermentación maloláctica si deseas.",
      duration: "1 día",
      tips: [
        "Presiona suavemente para evitar amargor",
        "Fermentación maloláctica suaviza el vino"
      ]
    },
    {
      id: 6,
      title: "Fermentación Secundaria",
      description: "Deja reposar en fermentador secundario a 15-18°C. Esta etapa puede durar meses para vinos complejos.",
      duration: "1-6 meses",
      tips: [
        "Más tiempo = vino más complejo",
        "Mantén temperatura fresca y constante"
      ]
    },
    {
      id: 7,
      title: "Trasiegos Sucesivos",
      description: "Trasiega cada 2-3 meses para separar sedimentos. Repite hasta que el vino esté claro y brillante.",
      duration: "Cada 2-3 meses",
      tips: [
        "Usa sifón para evitar sedimentos",
        "Esteriliza equipos entre trasiegos"
      ]
    },
    {
      id: 8,
      title: "Estabilización",
      description: "Añade metabisulfito para prevenir oxidación y refermentación. Filtra si es necesario para claridad.",
      duration: "1 semana",
      tips: [
        "Cantidad típica: 50-100 mg/L",
        "Filtra con cartuchos de 0.45 micras"
      ]
    },
    {
      id: 9,
      title: "Embotellado",
      description: "Trasiega cuidadosamente a botellas esterilizadas. Sella con corchos y guarda en posición horizontal.",
      duration: "1 día",
      tips: [
        "Esteriliza botellas con solución de metabisulfito",
        "Guarda en posición horizontal para mantener corchos húmedos"
      ]
    },
    {
      id: 10,
      title: "Añejado",
      description: "Guarda en bodega fresca (12-15°C) con humedad del 70%. El vino mejora con el tiempo, mínimo 6 meses.",
      duration: "6 meses - varios años",
      tips: [
        "Más tiempo = vino más refinado",
        "Controla temperatura y humedad"
      ]
    }
  ];

  const steps = tipo === 'hidromiel' ? stepsHidromiel : stepsVino;

  return (
    <div className="steps-container">
      <div className="steps-header">
        <h3>
          <i className={`fas ${tipo === 'hidromiel' ? 'fa-beer' : 'fa-wine-glass-alt'}`}></i>
          Guía de Pasos para {tipo === 'hidromiel' ? 'Hidromiel' : 'Vino'}
        </h3>
        <p>Sigue estos pasos detallados para elaborar tu bebida fermentada</p>
      </div>
      
      <div className="steps-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {completedSteps.length} de {steps.length} pasos completados
        </div>
      </div>
      
      <div className="steps-list">
        {steps.map(step => (
          <div 
            key={step.id} 
            className={`step-item ${completedSteps.includes(step.id) ? 'completed' : ''}`}
          >
            <div className="step-header">
              <div className="step-indicator">
                <div className="step-number">
                  {completedSteps.includes(step.id) ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    step.id
                  )}
                </div>
                <button 
                  className="step-checkbox"
                  onClick={() => toggleStepCompletion(step.id)}
                  title={completedSteps.includes(step.id) ? "Marcar como incompleto" : "Marcar como completo"}
                >
                  {completedSteps.includes(step.id) ? (
                    <i className="fas fa-check-square"></i>
                  ) : (
                    <i className="far fa-square"></i>
                  )}
                </button>
              </div>
              
              <div className="step-title">
                <h4>{step.title}</h4>
                <div className="step-meta">
                  {step.duration && (
                    <span className="step-duration">
                      <i className="fas fa-clock"></i> {step.duration}
                    </span>
                  )}
                  <button 
                    className="step-expand"
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <i className={`fas fa-chevron-${expandedSteps.includes(step.id) ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`step-content ${expandedSteps.includes(step.id) ? 'expanded' : ''}`}>
              <p className="step-description">{step.description}</p>
              
              {step.tips && step.tips.length > 0 && (
                <div className="step-tips">
                  <h5><i className="fas fa-lightbulb"></i> Consejos:</h5>
                  <ul>
                    {step.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="steps-footer">
        <button className="btn-primary">
          <i className="fas fa-download"></i> Descargar Guía Completa
        </button>
        <button className="btn-secondary">
          <i className="fas fa-print"></i> Imprimir Guía
        </button>
      </div>
    </div>
  );
};

export default Steps;