import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { LeadSource, ClientType, ServicePitch } from '@/types/database';
import { Loader2, Plus } from 'lucide-react';

const leadSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    salesperson_name: z.string().min(2, { message: "Salesperson name is required." }),
    lead_source: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    country: z.string().optional(),
    city: z.string().optional(),
    client_type: z.string(),
    service_pitch: z.string(),
});

interface AddLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddLead: (data: any) => Promise<any>;
}

export function AddLeadDialog({ open, onOpenChange, onAddLead }: AddLeadDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof leadSchema>>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: '',
            salesperson_name: '',
            lead_source: 'instagram',
            phone: '',
            email: '',
            country: '',
            city: '',
            client_type: 'individual_agent',
            service_pitch: 'ai_automation',
        },
    });

    async function onSubmit(values: z.infer<typeof leadSchema>) {
        setIsSubmitting(true);
        const result = await onAddLead(values);
        setIsSubmitting(false);
        if (result) {
            form.reset();
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Add New Sales Lead
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details of the new lead to track them in your dashboard.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lead Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="salesperson_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salesperson</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Sarah Smith" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="lead_source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="google_maps">📍 Google Maps</SelectItem>
                                                <SelectItem value="instagram">📸 Instagram</SelectItem>
                                                <SelectItem value="facebook">👤 Facebook</SelectItem>
                                                <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                                                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                                                <SelectItem value="other">🔗 Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="client_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="individual_agent">👤 Individual Agent</SelectItem>
                                                <SelectItem value="brokerage">🏢 Brokerage</SelectItem>
                                                <SelectItem value="developer">🏗️ Developer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="service_pitch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Pitch</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ai_automation">🤖 AI Automation</SelectItem>
                                                <SelectItem value="website">🌐 Website</SelectItem>
                                                <SelectItem value="full_package">📦 Full Package</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="USA" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="NY" {...field} className="bg-slate-50 dark:bg-slate-800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="gap-2 shadow-lg px-8" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                Create Lead
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
