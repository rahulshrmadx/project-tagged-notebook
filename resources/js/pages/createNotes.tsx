import { Head, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, forwardRef, TextareaHTMLAttributes } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

// ✅ Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ' +
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ' +
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
          (className || '')
        }
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// ✅ Main component
type NoteForm = {
  title: string;
  description: string;
  cover: File | null;
};

export default function CreateNote() {
  const [data, setData] = useState<NoteForm>({
    title: '',
    description: '',
    cover: null,
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NoteForm, string>>>({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    if (data.cover && data.cover.size > 1024 * 1024) {
      setErrors({ cover: 'Image size must be under 1MB' });
      setProcessing(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.cover) formData.append('cover', data.cover);

    router.post('/api/note/create', formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Note created successfully!');
        setTimeout(() => {
          router.visit('/notes');
        }, 1000);
      },
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to create note');
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AuthLayout title="Create Note" description="Fill the details to create a new note">
      <Head title="Create Note" />
      <Toaster position="top-right" />

      <form className="flex flex-col gap-6" onSubmit={submit} encType="multipart/form-data">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              required
              autoFocus
              placeholder="e.g. Aaj ka din"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              disabled={processing}
            />
            <InputError message={errors.title} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              rows={4}
              placeholder="e.g. Aaj office mein meeting thi..."
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              disabled={processing}
            />
            <InputError message={errors.description} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover">Cover Photo (9:16 ratio, max 1MB)</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setData({ ...data, cover: e.target.files?.[0] || null })}
              disabled={processing}
            />
            <InputError message={errors.cover} />
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={processing}>
            {processing ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Note'
            )}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

