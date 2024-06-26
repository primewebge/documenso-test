'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { FilePlus, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { createDocumentData } from '@documenso/lib/server-only/document-data/create-document-data';
import { putPdfFile } from '@documenso/lib/universal/upload/put-file';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { DocumentDropzone } from '@documenso/ui/primitives/document-dropzone';
import { useToast } from '@documenso/ui/primitives/use-toast';

type NewTemplateDialogProps = {
  teamId?: number;
  templateRootPath: string;
};

export const NewTemplateDialog = ({ teamId, templateRootPath }: NewTemplateDialogProps) => {
  const router = useRouter();

  const { data: session } = useSession();
  const { toast } = useToast();

  const { mutateAsync: createTemplate } = trpc.template.createTemplate.useMutation();

  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const onFileDrop = async (file: File) => {
    if (isUploadingFile) {
      return;
    }

    setIsUploadingFile(true);

    try {
      const { type, data } = await putPdfFile(file);
      const { id: templateDocumentDataId } = await createDocumentData({
        type,
        data,
      });

      const { id } = await createTemplate({
        teamId,
        title: file.name,
        templateDocumentDataId,
      });

      toast({
        title: 'შაბლონის დოკუმენტი ატვირთულია',
        description:
          'თქვენი დოკუმენტი წარმატებით აიტვირთა. თქვენ გადამისამართდებით შაბლონების გვერდზე.',
        duration: 5000,
      });

      setShowNewTemplateDialog(false);

      router.push(`${templateRootPath}/${id}`);
    } catch {
      toast({
        title: 'დაფიქსირდა ხარვეზი',
        description: 'გთხოვთ სცადოთ თავიდან.',
        variant: 'destructive',
      });

      setIsUploadingFile(false);
    }
  };

  return (
    <Dialog
      open={showNewTemplateDialog}
      onOpenChange={(value) => !isUploadingFile && setShowNewTemplateDialog(value)}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer" disabled={!session?.user.emailVerified}>
          <FilePlus className="-ml-1 mr-2 h-4 w-4" />
          ახალი შაბლონი
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>ახალი შაბლონი</DialogTitle>
          <DialogDescription>
            შაბლონები საშუალებას გაძლევთ სწრაფად შექმნათ დოკუმენტები წინასწარ შევსებული მიმღებებითა
            და ველებით.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <DocumentDropzone className="h-[40vh]" onDrop={onFileDrop} type="template" />

          {isUploadingFile && (
            <div className="bg-background/50 absolute inset-0 flex items-center justify-center rounded-lg">
              <Loader className="text-muted-foreground h-12 w-12 animate-spin" />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isUploadingFile}>
              დახურვა
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
