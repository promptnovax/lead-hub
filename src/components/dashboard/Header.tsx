import { Bell, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';

export function Header() {
  const today = new Date();

  return (
    <header className="flex items-center justify-between py-6 px-8 border-b border-border bg-card/50 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </button>
      </div>
    </header>
  );
}
