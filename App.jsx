import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Smartphone,
  User,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// --- Components ---

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setOpacity(0), 800);
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-700 ease-out"
      style={{ opacity: opacity }}
    >
      <div className="text-center space-y-3 animate-in zoom-in-95 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-sm">
          SISTEMA DE ENVÍOS
        </h1>
        <p className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase">
          By: bnj
        </p>
      </div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border border-orange-400/20',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/20'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input 
    className={`
      flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300
      ${className}
    `}
    {...props}
  />
);

const Label = ({ children, className = '', ...props }) => (
  <label 
    className={`text-xs font-bold uppercase tracking-wider text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Card = ({ children, className = '' }) => (
  <div className={`
    rounded-[1.5rem] border border-gray-100 bg-white text-gray-950 shadow-md transition-all duration-400 ease-out 
    hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-100
    ${className}
  `}>
    {children}
  </div>
);

const TemplateCard = ({ template, executiveName, clientNumber }) => {
  const [propertyLink, setPropertyLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const getFinalText = () => {
    let finalText = template.content.replace(/\[Nombre_Ejecutivo\]/g, executiveName || '[Nombre]');
    if (template.content.includes('[Input_Para_Link_Propiedad]')) {
        finalText = finalText.replace(/\[Input_Para_Link_Propiedad\]/g, propertyLink || '[Link Propiedad]');
    }
    return finalText;
  };

  const handleSendWhatsApp = () => {
    if (!clientNumber) {
      toast.error('Por favor ingresa el número del cliente primero');
      return;
    }
    
    const rawNumber = clientNumber.trim();
    const startsWithPlus = rawNumber.startsWith('+');
    let cleanDigits = rawNumber.replace(/\D/g, ''); 
    let finalNumber = cleanDigits;
    
    if (!startsWithPlus) {
        finalNumber = '56' + cleanDigits;
    }
    
    const text = getFinalText();
    const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopy = async () => {
    const text = getFinalText();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Mensaje copiado al portapapeles');
    } catch (err) {
      toast.error('Error al copiar');
    }
  };

  const needsPropertyLink = template.content.includes('[Input_Para_Link_Propiedad]');

  return (
    <Card className="flex flex-col h-full overflow-hidden group border-l-[6px] border-l-orange-500 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
      
      <div className="p-7 flex-1 space-y-5 relative z-10">
        <div className="flex items-start justify-between">
          <h3 className="font-extrabold text-lg text-gray-800 line-clamp-2 leading-tight" title={template.title}>
            {template.title}
          </h3>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl text-sm text-gray-600 leading-relaxed min-h-[120px] whitespace-pre-wrap border border-gray-100 shadow-inner">
          {template.content.split(/(\[Input_Para_Link_Propiedad\])/g).map((part, i) => (
            part === '[Input_Para_Link_Propiedad]' ? (
              <span key={i} className="text-orange-600 font-bold bg-orange-100/50 px-1.5 py-0.5 rounded-md mx-1 break-all border border-orange-200/50 shadow-sm">
                {propertyLink || '[Link Propiedad]'}
              </span>
            ) : (
              <span key={i}>{part.replace(/\[Nombre_Ejecutivo\]/g, executiveName || '[Nombre]')}</span>
            )
          ))}
        </div>

        {needsPropertyLink && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
            <Label>Link de la Propiedad</Label>
            <div className="relative group/input">
              <ExternalLink className="absolute left-3.5 top-3 h-4 w-4 text-orange-400 group-focus-within/input:text-orange-600 transition-colors" />
              <Input 
                value={propertyLink}
                onChange={(e) => setPropertyLink(e.target.value)}
                placeholder="Pegar enlace aquí..."
                className="pl-10 bg-orange-50/20 border-orange-100 focus:border-orange-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-slate-50 border-t border-gray-100 grid grid-cols-1 gap-3 relative z-10">
        <Button onClick={handleSendWhatsApp} className="w-full">
          <MessageCircle className="h-5 w-5 mr-2" />
          Enviar por WhatsApp
        </Button>
        <Button 
            variant={isCopied ? "success" : "secondary"} 
            onClick={handleCopy} 
            className="w-full"
        >
          {isCopied ? (
            <>
                <Check className="h-4 w-4 mr-2" />
                ¡Copiado al portapapeles!
            </>
          ) : (
            <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar texto
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

function App() {
  const [executiveName, setExecutiveName] = useState(() => localStorage.getItem('executiveName') || '');
  const [clientNumber, setClientNumber] = useState(() => localStorage.getItem('clientNumber') || '');
  const [showContent, setShowContent] = useState(false);

  const templates = [
    {
      id: '1',
      title: 'Presentación',
      category: 'Correos',
      content: `Hola! ¿Cómo está? Soy [Nombre_Ejecutivo], de la corredora SANTAMARIA. Nos llegó un correo tuyo consultando por la siguiente propiedad:`
    },
    {
      id: '7',
      title: 'Presentación Ana Victoria',
      category: 'Correos',
      content: `Buenas tardes, mi nombre es Ana Victoria Diaz, encargada del área de Arriendos de la Corredora SANTAMARÍA.\n\nA continuación, le enviaré el detalle de la propiedad por la que consulta.`
    },
    {
      id: '2',
      title: 'Coordinación y Requisitos',
      category: 'Correos',
      content: `Si realmente te interesa, me avisas para coordinar una visita! Recuerda que para arrendar debes tener un ingreso 3 veces mayor al valor de arriendo (Puedes complementar) y no debes estar en DICOM`
    },
    {
      id: '3',
      title: 'Llamadas no contestadas',
      category: 'Llamadas',
      content: `Hola! mi nombre es [Nombre_Ejecutivo], asistente de Arriendos de la corredora SANTAMARIA. Recibí una llamada y no la pude contestar, en que lo puedo ayudar?`
    },
    {
      id: '4',
      title: 'Llamadas fds',
      category: 'Llamadas',
      content: `Hola! mi nombre es [Nombre_Ejecutivo], asistente de Arriendos de SANTAMARIA. Recibí una llamada durante el fin de semana y no la pude contestar, en que lo puedo ayudar?`
    },
    {
      id: '5',
      title: 'Propiedad no disponible',
      category: 'Otros',
      content: `Hola! Lamentablemente esa propiedad ya no se encuentra disponible. Sin embargo, en los siguientes enlaces puedes revisar otras opciones actuales. Para consultar disponibilidad, me puedes escribir por este mismo medio:

*ARRIENDOS HASTA $350.000:*
https://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Ubz_Id=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=350000&Pr_Piezas_Desde=0

*MENORES A $450.000*
▪️ *1 Dormitorio:*
https://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=0&Pr_Piezas_Desde=1&Pr_Piezas_Hasta=1

▪️ *2 Dormitorios:*
https://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Ubz_Id=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=0&Pr_Piezas_Desde=2`
    },
    {
      id: '6',
      title: 'Confirmación de Visita',
      category: 'Otros',
      content: `*IMPORTANTE:*

Su visita queda agendada únicamente cuando se le envía la dirección exacta y el nombre de la ejecutiva que lo atenderá. 

Sin ese mensaje, la visita no se considera confirmada.`
    }
  ];

  useEffect(() => {
    localStorage.setItem('executiveName', executiveName);
    localStorage.setItem('clientNumber', clientNumber);
  }, [executiveName, clientNumber]);

  const groupedTemplates = {
    'Respuesta Leads Correos': templates.filter(t => t.category === 'Correos'),
    'Llamadas que no Contestaron': templates.filter(t => t.category === 'Llamadas'),
    'Otros': templates.filter(t => !['Correos', 'Llamadas'].includes(t.category))
  };

  return (
    <>
      <SplashScreen onFinish={() => setShowContent(true)} />
      
      {showContent && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 font-sans text-gray-900 flex flex-col animate-in fade-in duration-1000">
          <Toaster position="top-right" richColors />
          
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_real-estate-crm-app/artifacts/5k6bllh3_Captura%20de%20pantalla%202026-02-23%20a%20la%28s%29%2015.46.27.png" 
                  alt="Logo Santamaría" 
                  className="h-16 w-auto object-contain"
                />
                <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 tracking-tight hidden sm:block">
                  Sistema de Envíos
                </h1>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-grow">
            <section className="bg-white rounded-[2rem] shadow-xl shadow-orange-900/5 border border-white p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-orange-600">
                    <User className="h-4 w-4" />
                    Nombre del Ejecutivo
                  </Label>
                  <Input 
                    placeholder="Ej. Benjamín Llancapan" 
                    value={executiveName}
                    onChange={(e) => setExecutiveName(e.target.value)}
                    className="text-2xl py-7 border-0 border-b-2 border-gray-100 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 transition-colors font-semibold"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-orange-600">
                    <Smartphone className="h-4 w-4" />
                    Celular del Cliente
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="Ej. +56 9 1234 5678" 
                    value={clientNumber}
                    onChange={(e) => setClientNumber(e.target.value)}
                    className="text-2xl py-7 border-0 border-b-2 border-gray-100 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 transition-colors font-mono font-semibold"
                  />
                </div>
              </div>
            </section>

            <div className="space-y-20">
              {Object.entries(groupedTemplates).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-2 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-sm"></div>
                      <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">{category}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {items.map(template => (
                        <TemplateCard 
                          key={template.id} 
                          template={template} 
                          executiveName={executiveName}
                          clientNumber={clientNumber}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </main>

          <footer className="py-10 text-center relative z-10">
            <p className="text-sm text-gray-400 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-gray-300"></span>
              Creado por Bnj
              <span className="w-8 h-px bg-gray-300"></span>
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
