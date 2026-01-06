import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAddLead: () => void;
}

const menuItems = [
  { id: 'all', label: 'All Leads', icon: Users },
  { id: 'today', label: "Today's Leads", icon: LayoutDashboard },
  { id: 'pending', label: 'Pending Follow-ups', icon: Clock },
  { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
];

export function Sidebar({ activeView, onViewChange, onAddLead }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-foreground">Astraventa</h1>
              <p className="text-xs text-muted-foreground">Lead Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Button */}
      <div className="p-4">
        <button
          onClick={onAddLead}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]",
            "shadow-lg glow-primary"
          )}
        >
          <Plus className="w-5 h-5" />
          {!collapsed && <span>Add New Lead</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/30" 
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                item.id === 'overdue' && "hover:text-destructive"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                item.id === 'overdue' && isActive && "text-destructive"
              )} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-semibold">SP</span>
          </div>
          {!collapsed && (
            <div className="flex-1 animate-fade-in">
              <p className="font-medium text-sm">Sales Person</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          )}
          {!collapsed && (
            <button className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
