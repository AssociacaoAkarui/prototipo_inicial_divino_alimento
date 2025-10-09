import { ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onClear: () => void;
  children: ReactNode;
  title?: string;
}

export function FiltersPanel({
  open,
  onOpenChange,
  onApply,
  onClear,
  children,
  title = 'Filtros',
}: FiltersPanelProps) {
  const handleApply = () => {
    onApply();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Configure os filtros e clique em "Aplicar filtros" para atualizar os resultados.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {children}
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              onClear();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Limpar filtros
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
