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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out"
      style={{ opacity: opacity }}
    >
      <div className="text-center space-y-2 animate-in zoom-in-95 duration-500">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-orange-500">
          SISTEMA DE ENVÍOS
        </h1>
        <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">
          By: bnj
        </p>
      </div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
    success: 'bg-green-500 text-white shadow-md hover:bg-green-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02]
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
      flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow
      ${className}
    `}
    {...props}
  />
);

const Label = ({ children, className = '', ...props }) => (
  <label 
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Card = ({ children, className = '' }) => (
  <div className={`
    rounded-2xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all duration-300 ease-out 
    hover:-translate-y-1 hover:shadow-xl
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
    <Card className="flex flex-col h-full overflow-hidden group border-l-4 border-l-orange-500">
      <div className="p-6 flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2" title={template.title}>
            {template.title}
          </h3>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed min-h-[100px] whitespace-pre-wrap border border-gray-100 shadow-inner">
          {template.content.split(/(\[Input_Para_Link_Propiedad\])/g).map((part, i) => (
            part === '[Input_Para_Link_Propiedad]' ? (
              <span key={i} className="text-orange-600 font-bold bg-orange-100/50 px-1 rounded mx-1 break-all">
                {propertyLink || '[Link Propiedad]'}
              </span>
            ) : (
              <span key={i}>{part.replace(/\[Nombre_Ejecutivo\]/g, executiveName || '[Nombre]')}</span>
            )
          ))}
        </div>

        {needsPropertyLink && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
            <Label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Link Propiedad</Label>
            <div className="relative group/input">
              <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within/input:text-orange-500 transition-colors" />
              <Input 
                value={propertyLink}
                onChange={(e) => setPropertyLink(e.target.value)}
                placeholder="Pegar enlace aquí..."
                className="pl-9 bg-orange-50/30 border-orange-100 focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 gap-3">
        <Button onClick={handleSendWhatsApp} className="w-full shadow-orange-200/50 hover:shadow-orange-300/50">
          <MessageCircle className="h-4 w-4 mr-2" />
          Enviar por WhatsApp
        </Button>
        <Button 
            variant={isCopied ? "success" : "secondary"} 
            onClick={handleCopy} 
            className="w-full transition-all duration-300"
        >
          {isCopied ? (
            <>
                <Check className="h-4 w-4 mr-2" />
                ¡Copiado!
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
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex flex-col animate-in fade-in duration-1000">
          <Toaster position="top-right" richColors />
          
          <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img 
                  src="https://raw.githubusercontent.com/bnj-1/Santamaria-envios/main/public/favicon.png" 
                  alt="Logo Santamaría" 
                  className="h-16 w-16 object-contain"
                />
                <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
                  Sistema de Envíos
                </h1>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-grow">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 relative overflow-hidden group hover:shadow-lg transition-shadow duration-500">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-4">
                  <Label className="text-gray-500 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-500" />
                    Nombre del Ejecutivo
                  </Label>
                  <Input 
                    placeholder="Ej. Benjamín Llancapan" 
                    value={executiveName}
                    onChange={(e) => setExecutiveName(e.target.value)}
                    className="text-xl py-6 border-0 border-b-2 border-gray-200 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 transition-colors font-medium"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label className="text-gray-500 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-orange-500" />
                    Celular del Cliente
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="Ej. +56 9 1234 5678" 
                    value={clientNumber}
                    onChange={(e) => setClientNumber(e.target.value)}
                    className="text-xl py-6 border-0 border-b-2 border-gray-200 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 transition-colors font-mono font-medium"
                  />
                </div>
              </div>
            </section>

            <div className="space-y-16">
              {Object.entries(groupedTemplates).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-1.5 bg-orange-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
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

          <footer className="py-8 text-center">
            <p className="text-xs text-gray-300 font-medium tracking-widest">
              by: Bnj
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
