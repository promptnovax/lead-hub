import { Lead } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface LeadsGridProps {
  leads: Lead[];
  title: string;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadsGrid({ leads, title, onEdit, onDelete }: LeadsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No leads found</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {searchQuery 
              ? 'Try adjusting your search query to find what you\'re looking for.'
              : 'No leads in this category yet. Add a new lead to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLeads.map((lead, index) => (
            <div key={lead.id} style={{ animationDelay: `${index * 50}ms` }}>
              <LeadCard lead={lead} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
