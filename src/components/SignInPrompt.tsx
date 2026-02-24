import { Link } from "react-router-dom";
import { X, LogIn } from "lucide-react";

interface SignInPromptProps {
  open: boolean;
  onClose: () => void;
}

const SignInPrompt = ({ open, onClose }: SignInPromptProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-nav rounded-2xl p-6 sm:p-8 max-w-md w-full animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <LogIn className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Sign In Required</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You need to be signed in in order to save movies or series in your watchlist.
          </p>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm text-muted-foreground border border-border hover:text-foreground transition-colors">
              Cancel
            </button>
            <Link to="/auth" onClick={onClose} className="btn-glow">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPrompt;
