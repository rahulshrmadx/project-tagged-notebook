import { Head, useForm, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit, Trash2, X } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Tag {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    tags?: Tag[] | null | undefined;
}

export default function CreateTag({ tags }: Props) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    
    // Safely handle tags prop
    const safeTags: Tag[] = Array.isArray(tags) ? tags : [];
    
    const pageProps = usePage().props as any;
    const { auth } = pageProps;

    console.log('Component rendered with tags:', safeTags);
    console.log('Auth:', auth);

    // Access control check
    if (!auth?.user || auth.user.role !== 'admin') {
        return (
            <AppLayout breadcrumbs={[{ title: 'Access Denied', href: '/settings/tags' }]}>
                <Head title="Access Denied" />
                <SettingsLayout>
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
                        <p className="mt-2 text-gray-600">Admin access required to manage tags.</p>
                    </div>
                </SettingsLayout>
            </AppLayout>
        );
    }

    // Create form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    // Edit form
    const { 
        data: editData, 
        setData: setEditData, 
        put, 
        processing: editProcessing, 
        errors: editErrors,
        reset: resetEdit 
    } = useForm({
        name: '',
    });

    // Refresh page data using Inertia
    const refreshTags = () => {
        router.reload({ only: ['tags'] });
    };

    // Create tag submit using Inertia.js post
    const handleCreateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.name.trim()) {
            toast.error('Tag name is required');
            return;
        }

        post('/admin/tags', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tag created successfully!');
                reset();
                // Refresh will happen automatically via Inertia
            },
            onError: (errors: any) => {
                console.error('Create tag errors:', errors);
                if (errors.name) {
                    toast.error(errors.name);
                } else if (typeof errors === 'string') {
                    toast.error(errors);
                } else {
                    toast.error('Something went wrong');
                }
            }
        });
    };

    // Edit tag submit using Inertia.js put
    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!editingTag) {
            toast.error('No tag selected for editing');
            return;
        }

        if (!editData.name.trim()) {
            toast.error('Tag name is required');
            return;
        }

        put(`/admin/tags/${editingTag.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tag updated successfully!');
                setShowEditModal(false);
                setEditingTag(null);
                resetEdit();
                // Refresh will happen automatically via Inertia
            },
            onError: (errors: any) => {
                console.error('Edit tag errors:', errors);
                if (errors.name) {
                    toast.error('Tag name is required');
                } else if (errors.message) {
                    toast.error(errors.message);
                } else if (typeof errors === 'string') {
                    toast.error(errors);
                } else {
                    toast.error('Something went wrong');
                }
            },
        });
    };

    // Open edit modal
    const openEditModal = (tag: Tag) => {
        if (!tag || !tag.id || !tag.name) {
            toast.error('Invalid tag data');
            return;
        }
        setEditingTag(tag);
        setEditData('name', tag.name);
        setShowEditModal(true);
    };

    // Close edit modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingTag(null);
        resetEdit();
    };

    // Delete tag using Inertia.js router
    const handleDelete = (tag: Tag) => {
        if (!tag || !tag.id || !tag.name) {
            toast.error('Invalid tag data');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${tag.name}" tag?`)) {
            return;
        }

        router.delete(`/admin/tags/${tag.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tag deleted successfully!');
                // Refresh will happen automatically via Inertia
            },
            onError: (errors) => {
                console.error('Delete tag errors:', errors);
                toast.error('Failed to delete tag');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Create Tag', href: '/settings/tags' }]}>
            <Head title="Create Tag" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Create Tag Section */}
                    <HeadingSmall title="Create a new tag" description="Only admins can create tags." />

                    <form onSubmit={handleCreateSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tag Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name || ''}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Enter tag name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} type="submit">
                                {processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </form>

                    {/* Tags List Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <HeadingSmall title="All Tags" description="Manage existing tags below." />
                            <Button
                                variant="outline"
                                onClick={refreshTags}
                                size="sm"
                                type="button"
                            >
                                Refresh
                            </Button>
                        </div>
                        
                        <div className="bg-white rounded-lg border">
                            {safeTags.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No tags found</p>
                                    <Button
                                        variant="outline"
                                        onClick={refreshTags}
                                        className="mt-2"
                                        size="sm"
                                        type="button"
                                    >
                                        Load Tags
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {safeTags.map((tag) => {
                                        if (!tag || !tag.id) {
                                            return null; // Skip invalid tags
                                        }
                                        
                                        return (
                                            <div key={tag.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {tag.name || 'Untitled'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Created: {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : 'Unknown'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditModal(tag)}
                                                        className="flex items-center gap-2"
                                                        type="button"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(tag)}
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        type="button"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {showEditModal && editingTag && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Edit Tag</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeEditModal}
                                    className="p-1"
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Tag Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name || ''}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Enter tag name"
                                    />
                                    <InputError message={editErrors.name} />
                                </div>

                                <div className="flex items-center gap-3 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeEditModal}
                                    >
                                        Cancel
                                    </Button>
                                    <Button disabled={editProcessing} type="submit">
                                        {editProcessing ? 'Updating...' : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </SettingsLayout>
        </AppLayout>
    );
}