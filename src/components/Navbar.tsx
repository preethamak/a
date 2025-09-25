import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code, TerminalSquare, Trophy, BarChart3, BookOpenCheck, Users, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`text-sm px-3 py-2 rounded-md transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
      {label}
    </Link>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="w-full border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-semibold">CodeLab</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" label="Home" />
          <NavLink to="/features" label="Features" />
          <NavLink to="/about" label="About" />
          <NavLink to="/practice" label="Practice" />
          <NavLink to="/exam" label="Examination" />
          <NavLink to="/analysis" label="Analysis" />
          <NavLink to="/leaderboard" label="Leaderboard" />
          <NavLink to="/developers" label="Developers" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/developers')} title="Developer Terminal">
            <TerminalSquare className="h-5 w-5" />
          </Button>
          <Button onClick={() => navigate('/login')} className="hidden sm:inline-flex">
            <LogIn className="h-4 w-4 mr-2" /> Login
          </Button>
        </div>
      </div>
    </nav>
  );
}


