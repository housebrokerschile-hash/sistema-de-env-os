import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MessageCircle, 
  Save,
  X,
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
    ghost: 'hover:bg-gray-100 text-gray-600',
    destructive: 'bg-red-50 text-red-600 hover:bg-red-100',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    success: 'bg-green-500 text-white shadow-md hover:bg-green-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
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

const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 hover:scale-110 transition-transform">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const TemplateCard = ({ template, executiveName, clientNumber, onEdit, onDelete }) => {
  const [propertyLink, setPropertyLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const getFinalText = () => {
    let finalText = template.content.replace(/\[Nombre_Ejecutivo\]/g, executiveName);
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
    if (template.content.includes('[Input_Para_Link_Propiedad]') && !propertyLink) {
        toast.error('Por favor ingresa el link de la propiedad');
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
    if (template.content.includes('[Input_Para_Link_Propiedad]') && !propertyLink) {
        toast.error('Por favor ingresa el link de la propiedad para copiar el mensaje completo');
        return;
    }
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
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1" title={template.title}>
            {template.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="ghost" size="icon" onClick={() => onEdit(template)} className="h-8 w-8 hover:bg-orange-100 hover:text-orange-600">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(template.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed min-h-[100px] whitespace-pre-wrap border border-gray-100 shadow-inner">
          {template.content.split(/(\[Input_Para_Link_Propiedad\])/g).map((part, i) => (
            part === '[Input_Para_Link_Propiedad]' ? (
              <span key={i} className="text-orange-600 font-bold bg-orange-100/50 px-1 rounded mx-1">
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
  // --- Estados con Memoria Local (Local Storage) ---
  const [executiveName, setExecutiveName] = useState(() => localStorage.getItem('executiveName') || 'Benjamín Llancapan');
  const [clientNumber, setClientNumber] = useState(() => localStorage.getItem('clientNumber') || '');
  
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('santamaria_templates');
    if (saved) return JSON.parse(saved);
    // Plantilla por defecto si es la primera vez que entra
    return [
      { 
        id: '1', 
        title: 'Ejemplo de Saludo Inicial', 
        category: 'Correos', 
        content: 'Hola, soy [Nombre_Ejecutivo] de la corredora Santamaría. Me pongo en contacto contigo por esta propiedad: [Input_Para_Link_Propiedad]. ¿Te gustaría que coordinemos una visita para que la conozcas?' 
      }
    ];
  });

  const [showContent, setShowContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null); 
  const [formData, setFormData] = useState({ title: '', category: 'Correos', content: '' });

  // Guardar automáticamente cada vez que haya un cambio
  useEffect(() => {
    localStorage.setItem('executiveName', executiveName);
    localStorage.setItem('clientNumber', clientNumber);
    localStorage.setItem('santamaria_templates', JSON.stringify(templates));
  }, [executiveName, clientNumber, templates]);

  // CRUD Handlers (Ahora 100% Locales)
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      setTemplates(templates.filter(t => t.id !== id));
      toast.success('Plantilla eliminada');
    }
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setFormData({ 
      title: template.title, 
      category: template.category, 
      content: template.content 
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentTemplate(null);
    setFormData({ title: '', category: 'Correos', content: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTemplate) {
      setTemplates(templates.map(t => t.id === currentTemplate.id ? { ...t, ...formData } : t));
      toast.success('Plantilla actualizada');
    } else {
      const newTemplate = { id: Date.now().toString(), ...formData };
      setTemplates([...templates, newTemplate]);
      toast.success('Plantilla creada');
    }
    setIsModalOpen(false);
  };

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
                  src="https://customer-assets.emergentagent.com/job_real-estate-crm-app/artifacts/5k6bllh3_Captura%20de%20pantalla%202026-02-23%20a%20la%28s%29%2015.46.27.png" 
                  alt="Logo Santamaría" 
                  className="h-16 w-auto object-contain"
                />
                <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
                  Sistema de Envíos
                </h1>
              </div>
              
              <Button onClick={handleCreate} size="sm" variant="outline" className="hidden sm:flex rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Plantilla
              </Button>
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
                  <p className="text-xs text-orange-600/80 font-medium">
                    * Si no comienza con "+", se antepondrá "56" automáticamente.
                  </p>
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
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            <button 
              onClick={handleCreate}
              className="fixed bottom-24 right-6 h-14 w-14 bg-orange-500 text-white rounded-full shadow-orange-500/30 shadow-2xl flex items-center justify-center sm:hidden active:scale-95 transition-transform z-40 hover:scale-110"
            >
              <Plus className="h-6 w-6" />
            </button>
          </main>

          <footer className="py-8 text-center">
            <p className="text-xs text-gray-300 font-medium tracking-widest">
              by: Bnj
            </p>
          </footer>

          <Dialog 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title={currentTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ej. Saludo Inicial"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-shadow"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Correos">Correos</option>
                  <option value="Llamadas">Llamadas</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Mensaje</Label>
                <div className="text-xs text-gray-500 mb-2 p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                  Variables: <span className="font-mono text-orange-600 font-bold">[Nombre_Ejecutivo]</span>, <span className="font-mono text-orange-600 font-bold">[Input_Para_Link_Propiedad]</span>
                </div>
                <textarea 
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-shadow resize-y"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </form>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default App;
