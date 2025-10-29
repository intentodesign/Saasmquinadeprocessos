import { Eye, Edit, Download, MoreVertical, Trash, Copy, Archive, History } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Process } from '../lib/types';
import { getCategoryIcon, getCategoryLabel, formatDate, getStatusLabel } from '../lib/utils';

interface ProcessCardProps {
  process: Process;
  onView: () => void;
  onEdit: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export function ProcessCard({ process, onView, onEdit, onExport, onDelete }: ProcessCardProps) {
  const categoryIcon = getCategoryIcon(process.category);
  const categoryLabel = getCategoryLabel(process.category);
  const statusLabel = getStatusLabel(process.status);
  const formattedDate = formatDate(process.updatedAt);

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group">
      <div className="space-y-4">
        {/* Icon */}
        <div className="text-3xl">{categoryIcon}</div>

        {/* Title and Category */}
        <div className="space-y-1">
          <h3 className="text-[#1e293b] line-clamp-2 min-h-[2.5rem]">
            {process.name}
          </h3>
          <p className="text-sm text-[#64748b]">{categoryLabel}</p>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Stats */}
        <div className="space-y-1 text-sm text-[#64748b]">
          <p>{process.steps.length} etapas • Versão {process.version}</p>
          <p>Atualizado {formattedDate}</p>
        </div>

        {/* Status Badge */}
        <div>
          <Badge 
            variant={process.status === 'complete' ? 'default' : 'secondary'}
            className={process.status === 'complete' ? 'bg-[#10b981]' : ''}
          >
            {process.status === 'complete' && '✓ '}
            {statusLabel}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                Ver Histórico
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Arquivar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-[#ef4444]">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
