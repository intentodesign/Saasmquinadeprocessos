import { motion } from 'motion/react';
import { GripVertical, Move, Sparkles } from 'lucide-react';
import { Card } from './ui/card';

export function DragDropDemo() {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-900">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Nova Interface de Arraste e Solte</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          Experimente a nova interface modernizada do fluxograma! Agora com:
        </p>

        <div className="grid gap-3">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <GripVertical className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Design Moderno com Gradientes</p>
              <p className="text-xs text-blue-700 mt-1">
                Blocos com cores vibrantes e gradientes suaves
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Move className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Feedback Visual Aprimorado</p>
              <p className="text-xs text-blue-700 mt-1">
                Efeitos de hover, handles visíveis e animações suaves
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white">
              💡
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Tooltips Informativos</p>
              <p className="text-xs text-blue-700 mt-1">
                Passe o mouse sobre os blocos para ver informações detalhadas
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white">
              🎨
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Badges e Numeração</p>
              <p className="text-xs text-blue-700 mt-1">
                Cada etapa tem um número identificador e ícone apropriado
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm">
          <p className="font-medium mb-1">✨ Dica Pro:</p>
          <p className="text-blue-100 text-xs">
            Arraste verticalmente para reorganizar a sequência dos passos. 
            O processo escrito será atualizado automaticamente!
          </p>
        </div>
      </div>
    </Card>
  );
}
