import { useState } from 'react';
import { Upload, X, Palette, Building2, Lock, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BrandingSettings, User } from '../lib/types';
import { getPlanLabel } from '../lib/utils';

interface BrandingSettingsPageProps {
  branding: BrandingSettings;
  user: User;
  onUpdateBranding: (branding: BrandingSettings) => void;
  onNavigate: (path: string) => void;
}

export function BrandingSettingsPage({ branding, user, onUpdateBranding, onNavigate }: BrandingSettingsPageProps) {
  const [editedBranding, setEditedBranding] = useState<BrandingSettings>(branding);
  const [logoPreview, setLogoPreview] = useState<string | null>(branding.logo || null);

  const hasBasicPlan = user.plan !== 'free';
  const hasProfessionalPlan = user.plan === 'professional' || user.plan === 'enterprise';

  const handleSave = () => {
    onUpdateBranding(editedBranding);
    alert('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    setEditedBranding(branding);
    setLogoPreview(branding.logo || null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setEditedBranding(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setEditedBranding(prev => ({ ...prev, logo: undefined }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#1e293b] mb-2">Configurações</h1>
        <p className="text-[#64748b]">
          Personalize a identidade visual dos seus documentos
        </p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">
            <Palette className="mr-2 h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="mr-2 h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          {/* Plano Atual */}
          <Card className="p-6 bg-[#f8fafc]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Plano Atual</p>
                <p className="text-lg text-[#1e293b]">{getPlanLabel(user.plan)}</p>
              </div>
              <Button variant="outline" onClick={() => onNavigate('/pricing')}>
                Fazer Upgrade
              </Button>
            </div>
          </Card>

          {/* Logo Upload */}
          <Card className={`p-6 ${!hasProfessionalPlan ? 'opacity-60' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#1e293b]">Logo da Empresa</Label>
                  <p className="text-sm text-[#64748b]">
                    PNG ou SVG, máx 2MB, fundo transparente recomendado
                  </p>
                </div>
                {!hasProfessionalPlan && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#f59e0b]/10 rounded-full">
                    <Lock className="h-4 w-4 text-[#f59e0b]" />
                    <span className="text-sm text-[#f59e0b]">Profissional</span>
                  </div>
                )}
              </div>

              {hasProfessionalPlan ? (
                <>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <div className="w-48 h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-white">
                        <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      </div>
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#ef4444] text-white rounded-full flex items-center justify-center hover:bg-[#dc2626]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="w-48 h-48 border-2 border-dashed rounded-lg hover:border-[#2563eb] transition-colors flex flex-col items-center justify-center gap-2 bg-[#f8fafc] hover:bg-[#2563eb]/5">
                        <Upload className="h-8 w-8 text-[#64748b]" />
                        <span className="text-sm text-[#64748b]">Clique para fazer upload</span>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-[#f8fafc]">
                  <Lock className="h-8 w-8 text-[#64748b]" />
                  <span className="text-sm text-[#64748b] text-center px-4">
                    Disponível no plano Profissional
                  </span>
                </div>
              )}

              {/* CTA para criar marca */}
              <div className="pt-4 border-t">
                <a 
                  href="https://intentomarcas.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all"
                    type="button"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ainda não tem marca? Crie agora
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Cores da Marca */}
          <Card className={`p-6 ${!hasBasicPlan ? 'opacity-60' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#1e293b]">Cores da Marca</Label>
                  <p className="text-sm text-[#64748b]">
                    Personalize as cores dos seus documentos PDF
                  </p>
                </div>
                {!hasBasicPlan && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#f59e0b]/10 rounded-full">
                    <Lock className="h-4 w-4 text-[#f59e0b]" />
                    <span className="text-sm text-[#f59e0b]">Básico</span>
                  </div>
                )}
              </div>

              {hasBasicPlan ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={editedBranding.primaryColor}
                        onChange={(e) => setEditedBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-20 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={editedBranding.primaryColor}
                        onChange={(e) => setEditedBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#2563eb"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={editedBranding.secondaryColor}
                        onChange={(e) => setEditedBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-20 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={editedBranding.secondaryColor}
                        onChange={(e) => setEditedBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#0ea5e9"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#f8fafc] rounded-lg border-2 border-dashed">
                  <Lock className="h-12 w-12 mx-auto mb-3 text-[#64748b]" />
                  <p className="text-[#64748b] mb-4">
                    Personalize as cores no plano Básico ou superior
                  </p>
                  <Button onClick={() => onNavigate('/pricing')} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                    Ver Planos
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Nome da Empresa */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <p className="text-sm text-[#64748b]">
                  Aparecerá no cabeçalho dos seus PDFs
                </p>
              </div>
              <Input
                id="companyName"
                value={editedBranding.companyName}
                onChange={(e) => setEditedBranding(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Auto Center Premium"
              />
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <div className="space-y-4">
              <Label className="text-[#1e293b]">Preview</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-6" style={{ backgroundColor: `${editedBranding.primaryColor}10` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] flex items-center justify-center">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-[#64748b]">{editedBranding.companyName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: editedBranding.primaryColor }}>
                    <h3 style={{ color: editedBranding.primaryColor }}>PROCEDIMENTO OPERACIONAL PADRÃO</h3>
                    <p className="text-sm text-[#64748b] mt-1">Troca de Óleo Completa</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-[#64748b]">Conteúdo do documento...</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              Salvar Alterações
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              Redefinir para Padrão
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <Card className="p-6">
            <p className="text-[#64748b]">Configurações da empresa em breve...</p>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <p className="text-[#64748b]">Configurações de segurança em breve...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
