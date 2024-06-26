import { Bird } from 'lucide-react';

export const EmptyTemplateState = () => {
  return (
    <div className="text-muted-foreground/60 flex h-96 flex-col items-center justify-center gap-y-4">
      <Bird className="h-12 w-12" strokeWidth={1.5} />

      <div className="text-center">
        <h3 className="text-lg font-semibold">შაბლონები არ მოიძებნა</h3>

        <p className="mt-2 max-w-[50ch]">თქვენ ჯერ არ შეგიქმნიათ შაბლონები.</p>
      </div>
    </div>
  );
};
