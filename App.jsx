import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Smartphone,
  User,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// --- Helpers & Defaults ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

const defaultTemplates = [
  {
    id: '1',
    title: 'Editable',
    category: 'Correos',
    color: 'orange',
    content: `[Saludo]! ¿Cómo está? Soy [Nombre_Ejecutivo], de la corredora SANTAMARIA. Nos llegó un correo tuyo consultando por la siguiente propiedad:`
  },
  {
    id: '7',
    title: 'Presentación Ana Victoria',
    category: 'Correos',
    color: 'blue',
    content: `[Saludo], mi nombre es Ana Victoria Diaz, encargada del área de Arriendos de la Corredora SANTAMARÍA.\n\nA continuación, le enviaré el detalle de la propiedad por la que consulta.`
  },
  {
    id: '9',
    title: 'Presentación Fernanda',
    category: 'Correos',
    color: 'purple',
    content: `[Saludo]! ¿Cómo está? Soy Fernanda Yañez, encargada del área de Arriendos de la Corredora SANTAMARÍA. A continuación, le enviaré el detalle de la propiedad por la que consulta.`
  },
  {
    id: '2',
    title: 'Coordinación y Requisitos',
    category: 'Correos',
    color: 'orange',
    content: `Si realmente te interesa, me avisas para coordinar una visita! Recuerda que para arrendar debes tener un ingreso 3 veces mayor al valor de arriendo (Puedes complementar) y no debes estar en DICOM`
  },
  {
    id: '3',
    title: 'Llamadas no contestadas',
    category: 'Llamadas',
    color: 'green',
    content: `[Saludo]! Mi nombre es [Nombre_Ejecutivo], asistente de Arriendos de la corredora SANTAMARIA. Recibí una llamada y no la pude contestar, en que lo puedo ayudar?`
  },
  {
    id: '4',
    title: 'Llamadas fds',
    category: 'Llamadas',
    color: 'purple',
    content: `[Saludo]! Mi nombre es [Nombre_Ejecutivo], asistente de Arriendos de SANTAMARIA. Recibí una llamada durante el fin de semana y no la pude contestar, en que lo puedo ayudar?`
  },
  {
    id: '5',
    title: 'Propiedad no disponible',
    category: 'Otros',
    color: 'orange',
    content: `[Saludo]! Lamentablemente esa propiedad ya no se encuentra disponible. Sin embargo, en los siguientes enlaces puedes revisar otras opciones actuales. Para consultar disponibilidad, me puedes escribir por este mismo medio:\n\n*ARRIENDOS HASTA $350.000:*\nhttps://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Ubz_Id=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=350000&Pr_Piezas_Desde=0\n\n*MENORES A $450.000*\n▪️ *1 Dormitorio:*\nhttps://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=0&Pr_Piezas_Desde=1&Pr_Piezas_Hasta=1\n\n▪️ *2 Dormitorios:*\nhttps://www.santamaria.cl/PropiedadesListado.aspx?From=Search&Tipo=P&Pr_Privada=0&Ubz_Id=0&Po_R_Id=8&Pr_Tipo_Id=8&Pr_Tipo_Operacion=2&Pr_Valor_Desde=0&Pr_Valor_Hasta=0&Pr_Piezas_Desde=2`
  },
  {
    id: '6',
    title: 'Confirmación de Visita',
    category: 'Otros',
    color: 'blue',
    content: `*IMPORTANTE:*\n\nSu visita queda agendada únicamente cuando se le envía la dirección exacta y el nombre de la ejecutiva que lo atenderá. \n\nSin ese mensaje, la visita no se considera confirmada.`
  },
  {
    id: '8',
    title: 'Formulario Publicación',
    category: 'Otros',
    color: 'green',
    content: `¡[Saludo]! ¿Cómo está? Para poder publicar su departamento a la brevedad, le pedimos que por favor nos ayude completando este breve formulario con las características de la propiedad:\n\n👉 https://docs.google.com/forms/d/e/1FAIpQLSeV8WU3J6c2CczZritzVDmkYOK8SjSQeLF_9O9T9HUZLITo3A/viewform?usp=header\n\nEn cuanto lo responda, avanzamos con la publicación. ¡Quedo atento a cualquier duda!\nSaludos del equipo de Corredora SANTAMARÍA.`
  }
];

const themeStyles = {
  orange: { border: 'border-l-orange-500', bg: 'from-orange-50', text: 'text-orange-600', inputBg: 'bg-orange-50/20', focus: 'focus:border-orange-500', icon: 'text-orange-400', badge: 'bg-orange-100/50 border-orange-200/50' },
  blue: { border: 'border-l-blue-500', bg: 'from-blue-50', text: 'text-blue-600', inputBg: 'bg-blue-50/20', focus: 'focus:border-blue-500', icon: 'text-blue-400', badge: 'bg-blue-100/50 border-blue-200/50' },
  green: { border: 'border-l-emerald-500', bg: 'from-emerald-50', text: 'text-emerald-600', inputBg: 'bg-emerald-50/20', focus: 'focus:border-emerald-500', icon: 'text-emerald-400', badge: 'bg-emerald-100/50 border-emerald-200/50' },
  purple: { border: 'border-l-purple-500', bg: 'from-purple-50', text: 'text-purple-600', inputBg: 'bg-purple-50/20', focus: 'focus:border-purple-500', icon: 'text-purple-400', badge: 'bg-purple-100/50 border-purple-200/50' }
};

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
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-700 ease-out" style={{ opacity: opacity }}>
      <div className="text-center space-y-3 animate-in zoom-in-95 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-sm">
          SISTEMA DE ENVÍOS
        </h1>
        <p className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase">By: bnj</p>
      </div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border border-orange-400/20',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 border border-green-400/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30',
    whatsapp: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-400/20'
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', default: 'px-4 py-2.5', lg: 'px-6 py-3 text-lg' };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input 
    className={`flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15 focus-visible:border-orange-500 disabled:opacity-50 transition-all duration-300 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea 
    className={`flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15 focus-visible:border-orange-500 disabled:opacity-50 transition-all duration-300 resize-none ${className}`}
    {...props}
  />
);

const Label = ({ children, className = '' }) => (
  <label className={`text-xs font-bold uppercase tracking-wider text-gray-500 leading-none ${className}`}>
    {children}
  </label>
);

const TemplateCard = ({ template, executiveName, clientNumber, onEdit, onDelete, isFirst, isLast, onMoveUp, onMoveDown }) => {
  const [propertyLink, setPropertyLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const theme = themeStyles[template.color || 'orange'];

  const getFinalText = () => {
    let finalText = template.content.replace(/\[Nombre_Ejecutivo\]/g, executiveName || '[Nombre]').replace(/\[Saludo\]/g, getGreeting());
    if (template.content.includes('[Input_Para_Link_Propiedad]')) {
        finalText = finalText.replace(/\[Input_Para_Link_Propiedad\]/g, propertyLink || '[Link Propiedad]');
    }
    return finalText;
  };

  const handleSendWhatsApp = () => {
    if (!clientNumber) return toast.error('Por favor ingresa el número del cliente primero');
    const cleanDigits = clientNumber.trim().replace(/\D/g, ''); 
    const finalNumber = clientNumber.trim().startsWith('+') ? cleanDigits : '56' + cleanDigits;
    window.open(`https://wa.me/${finalNumber}?text=${encodeURIComponent(getFinalText())}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFinalText());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Mensaje copiado al portapapeles');
    } catch (err) { toast.error('Error al copiar'); }
  };

  return (
    <div className={`rounded-[1.5rem] border border-gray-100 bg-white shadow-md transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl flex flex-col h-full overflow-hidden group border-l-[6px] ${theme.border} relative`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${theme.bg} to-transparent opacity-50 rounded-bl-full pointer-events-none`}></div>
      
      <div className="p-7 flex-1 space-y-5 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-lg text-gray-800 line-clamp-2 leading-tight pr-20" title={template.title}>
            {template.title}
          </h3>
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-sm border border-gray-100 z-20">
            {!isFirst && (
              <button onClick={onMoveUp} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors" title="Subir">
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
            {!isLast && (
              <button onClick={onMoveDown} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors" title="Bajar">
                <ArrowDown className="h-4 w-4" />
              </button>
            )}
            {(!isFirst || !isLast) && <div className="w-px h-4 bg-gray-200 mx-1"></div>}
            <button onClick={() => onEdit(template)} className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Editar">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(template)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Borrar">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl text-sm text-gray-600 leading-relaxed min-h-[120px] whitespace-pre-wrap border border-gray-100 shadow-inner">
          {template.content.split(/(\[Input_Para_Link_Propiedad\])/g).map((part, i) => (
            part === '[Input_Para_Link_Propiedad]' ? (
              <span key={i} className={`${theme.text} font-bold ${theme.badge} px-1.5 py-0.5 rounded-md mx-1 break-all border shadow-sm`}>
                {propertyLink || '[Link Propiedad]'}
              </span>
            ) : (
              <span key={i}>{part.replace(/\[Nombre_Ejecutivo\]/g, executiveName || '[Nombre]').replace(/\[Saludo\]/g, getGreeting())}</span>
            )
          ))}
        </div>

        {template.content.includes('[Input_Para_Link_Propiedad]') && (
          <div className="space-y-2 pt-2">
            <Label>Link de la Propiedad</Label>
            <div className="relative group/input">
              <ExternalLink className={`absolute left-3.5 top-3 h-4 w-4 ${theme.icon} transition-colors`} />
              <Input 
                value={propertyLink} onChange={(e) => setPropertyLink(e.target.value)} placeholder="Pegar enlace aquí..."
                className={`pl-10 ${theme.inputBg} ${theme.focus} focus:bg-white shadow-sm`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-slate-50 border-t border-gray-100 grid grid-cols-1 gap-3 relative z-10">
        <Button variant="whatsapp" onClick={handleSendWhatsApp} className="w-full">
          <MessageCircle className="h-5 w-5 mr-2" /> Enviar por WhatsApp
        </Button>
        <Button variant={isCopied ? "success" : "secondary"} onClick={handleCopy} className="w-full">
          {isCopied ? <><Check className="h-4 w-4 mr-2" /> ¡Copiado!</> : <><Copy className="h-4 w-4 mr-2" /> Copiar texto</>}
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  const [executiveName, setExecutiveName] = useState(() => localStorage.getItem('executiveName') || '');
  const [clientNumber, setClientNumber] = useState(() => localStorage.getItem('clientNumber') || '');
  const [showContent, setShowContent] = useState(false);
  
  // Plantillas en memoria local
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('santamaria_templates');
    return saved ? JSON.parse(saved) : defaultTemplates;
  });

  // Modal y Formularios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', newCategory: '', content: '', color: 'orange' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    localStorage.setItem('executiveName', executiveName);
    localStorage.setItem('clientNumber', clientNumber);
    localStorage.setItem('santamaria_templates', JSON.stringify(templates));
  }, [executiveName, clientNumber, templates]);

  // Extraer categorías únicas
  const categories = [...new Set(templates.map(t => t.category))];

  const groupedTemplates = categories.reduce((acc, cat) => {
    acc[cat] = templates.filter(t => t.category === cat);
    return acc;
  }, {});

  const handleSaveTemplate = () => {
    if (!formData.title || !formData.content) return toast.error('El título y contenido son obligatorios');
    const finalCategory = formData.category === 'nueva' ? formData.newCategory : formData.category;
    if (!finalCategory) return toast.error('Debes elegir o crear una categoría');

    const newTemplate = {
      id: editingTemplate ? editingTemplate.id : Date.now().toString(),
      title: formData.title,
      category: finalCategory,
      content: formData.content,
      color: formData.color
    };

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? newTemplate : t));
      toast.success('Mensaje actualizado');
    } else {
      setTemplates([...templates, newTemplate]);
      toast.success('Nuevo mensaje creado');
    }
    setIsModalOpen(false);
  };

  const openModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({ title: template.title, category: template.category, newCategory: '', content: template.content, color: template.color || 'orange' });
    } else {
      setEditingTemplate(null);
      setFormData({ title: '', category: categories[0] || '', newCategory: '', content: '', color: 'orange' });
    }
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setTemplates(templates.filter(t => t.id !== deleteConfirm.id));
    setDeleteConfirm(null);
    toast.success('Mensaje eliminado');
  };

  const moveTemplate = (templateId, direction, category) => {
    setTemplates(prev => {
      const newTemplates = [...prev];
      const catItems = newTemplates.filter(t => t.category === category);
      const currentIndexInCat = catItems.findIndex(t => t.id === templateId);
      
      if (direction === 'up' && currentIndexInCat > 0) {
        const targetId = catItems[currentIndexInCat - 1].id;
        const idx1 = newTemplates.findIndex(t => t.id === templateId);
        const idx2 = newTemplates.findIndex(t => t.id === targetId);
        [newTemplates[idx1], newTemplates[idx2]] = [newTemplates[idx2], newTemplates[idx1]];
      } else if (direction === 'down' && currentIndexInCat < catItems.length - 1) {
        const targetId = catItems[currentIndexInCat + 1].id;
        const idx1 = newTemplates.findIndex(t => t.id === templateId);
        const idx2 = newTemplates.findIndex(t => t.id === targetId);
        [newTemplates[idx1], newTemplates[idx2]] = [newTemplates[idx2], newTemplates[idx1]];
      }
      return newTemplates;
    });
  };

  return (
    <>
      <SplashScreen onFinish={() => setShowContent(true)} />
      
      {showContent && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30 font-sans text-gray-900 flex flex-col animate-in fade-in duration-1000">
          <Toaster position="top-right" richColors />
          
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img src="https://customer-assets.emergentagent.com/job_real-estate-crm-app/artifacts/5k6bllh3_Captura%20de%20pantalla%202026-02-23%20a%20la%28s%29%2015.46.27.png" alt="Logo Santamaría" className="h-16 w-auto object-contain" />
                <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 tracking-tight hidden sm:block">
                  Sistema de Envíos
                </h1>
              </div>
              <Button onClick={() => openModal()} className="shadow-orange-500/20">
                <Plus className="h-5 w-5 mr-1" /> Nuevo Mensaje
              </Button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-grow">
            <section className="bg-white rounded-[2rem] shadow-xl shadow-orange-900/5 border border-white p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-orange-600"><User className="h-4 w-4" /> Nombre del Ejecutivo</Label>
                  <Input placeholder="Ej. Benjamín Llancapan" value={executiveName} onChange={(e) => setExecutiveName(e.target.value)} className="text-2xl py-7 border-0 border-b-2 border-gray-100 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 font-semibold" />
                </div>
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-orange-600"><Smartphone className="h-4 w-4" /> Celular del Cliente</Label>
                  <Input type="text" placeholder="Ej. +56 9 1234 5678" value={clientNumber} onChange={(e) => setClientNumber(e.target.value)} className="text-2xl py-7 border-0 border-b-2 border-gray-100 rounded-none px-0 focus:ring-0 focus:border-orange-500 bg-transparent placeholder:text-gray-300 font-mono font-semibold" />
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
                      {items.map((template, index) => (
                        <TemplateCard 
                          key={template.id} 
                          template={template} 
                          executiveName={executiveName} 
                          clientNumber={clientNumber} 
                          onEdit={openModal} 
                          onDelete={setDeleteConfirm} 
                          isFirst={index === 0}
                          isLast={index === items.length - 1}
                          onMoveUp={() => moveTemplate(template.id, 'up', category)}
                          onMoveDown={() => moveTemplate(template.id, 'down', category)}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
              {templates.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">No hay mensajes. ¡Crea uno nuevo!</div>
              )}
            </div>
            
            <div className="flex justify-center pt-10">
              <button 
                onClick={() => { if(window.confirm('¿Volver a los mensajes originales? Se borrarán tus creaciones.')) setTemplates(defaultTemplates); }}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Restaurar plantillas originales
              </button>
            </div>
          </main>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-xl text-gray-800">{editingTemplate ? 'Editar Mensaje' : 'Crear Nuevo Mensaje'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label>Título del Mensaje</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. Presentación Inicial" />
              </div>
              
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select 
                  className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="nueva">+ Crear nueva categoría...</option>
                </select>
              </div>

              {formData.category === 'nueva' && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label>Nombre de la nueva categoría</Label>
                  <Input value={formData.newCategory} onChange={e => setFormData({...formData, newCategory: e.target.value})} placeholder="Ej. Respuestas WhatsApp" autoFocus />
                </div>
              )}

              <div className="space-y-2">
                <Label>Color de la Tarjeta</Label>
                <div className="flex gap-3">
                  {[
                    {id: 'orange', class: 'bg-orange-500 ring-orange-200'},
                    {id: 'blue', class: 'bg-blue-500 ring-blue-200'},
                    {id: 'green', class: 'bg-emerald-500 ring-emerald-200'},
                    {id: 'purple', class: 'bg-purple-500 ring-purple-200'}
                  ].map(c => (
                    <button 
                      key={c.id} onClick={() => setFormData({...formData, color: c.id})}
                      className={`w-10 h-10 rounded-full ${c.class} transition-all ${formData.color === c.id ? 'ring-4 scale-110 shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Contenido del Mensaje</span>
                  <span className="text-orange-500 font-normal normal-case">Tip: Usa [Saludo]</span>
                </Label>
                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={5} placeholder="Escribe el mensaje aquí..." />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveTemplate}>Guardar Mensaje</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Borrado */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="font-extrabold text-xl text-gray-900 mb-2">¿Borrar Mensaje?</h3>
            <p className="text-gray-500 text-sm mb-8">Estás a punto de borrar "{deleteConfirm.title}". Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete}>Sí, borrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
