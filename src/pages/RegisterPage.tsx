import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Fraca', color: 'bg-[#ef4444]' };
    if (strength <= 50) return { strength, label: 'Média', color: 'bg-[#f59e0b]' };
    return { strength, label: 'Forte', color: 'bg-[#10b981]' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (!acceptTerms) {
      alert('Você precisa aceitar os Termos de Uso');
      return;
    }
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl">Máquina de Processos</span>
          </div>

          <div>
            <h1 className="text-4xl text-white mb-4">
              Comece grátis hoje
            </h1>
            <p className="text-white/80 text-lg">
              Crie até 3 POPs por mês sem custo. Faça upgrade quando precisar de mais.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Templates profissionais inclusos</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#f8fafc]">
        <Card className="w-full max-w-md p-8 bg-white">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#0ea5e9]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.5"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[#1e293b]">Máquina de Processos</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[#1e293b] mb-2">Criar conta grátis</h2>
            <p className="text-[#64748b]">Comece a documentar seus processos agora</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">Força da senha:</span>
                    <span className={`${passwordStrength.label === 'Fraca' ? 'text-[#ef4444]' : passwordStrength.label === 'Média' ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b]"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                Aceito os{' '}
                <a href="#" className="text-[#2563eb] hover:underline">Termos de Uso</a>
                {' '}e{' '}
                <a href="#" className="text-[#2563eb] hover:underline">Política de Privacidade</a>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
              Criar Conta Grátis
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#64748b]">ou</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Cadastrar com Google
            </Button>

            <p className="text-center text-sm text-[#64748b]">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-[#2563eb] hover:underline"
              >
                Faça login
              </button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
