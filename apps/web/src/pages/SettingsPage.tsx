import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../app/slices/authSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  const handleExport = () => {
    // Get data from Redux store
    const data = {
      user,
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-manager-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Données exportées avec succès");
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        toast.success("Données importées avec succès");
        // TODO: Process imported data
      } catch (error) {
        toast.error("Erreur lors de l'importation des données");
      }
    };
    reader.readAsText(file);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Déconnexion réussie");
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      // TODO: Implement account deletion
      toast.error("Fonctionnalité non encore implémentée");
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-400">Personnalisez votre expérience</p>
      </header>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-50">Profil</div>
            <div className="text-xs text-slate-400">Informations de votre compte</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-400">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-50">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-slate-400">{user?.email}</div>
                <div className="text-xs text-slate-500">Rôle: {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <Button variant="ghost" className="text-sm">
                Modifier le profil
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-50">Préférences</div>
            <div className="text-xs text-slate-400">Personnalisez l'application</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Thème</div>
                <div className="text-xs text-slate-400">Apparence de l'interface</div>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
              >
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Notifications</div>
                <div className="text-xs text-slate-400">Alertes dans l'application</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Notifications email</div>
                <div className="text-xs text-slate-400">Alertes par email</div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Sauvegarde automatique</div>
                <div className="text-xs text-slate-400">Enregistrement automatique des modifications</div>
              </div>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSave ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Management Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-50">Gestion des données</div>
            <div className="text-xs text-slate-400">Export et import de vos données</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Exporter les données</div>
                <div className="text-xs text-slate-400">Téléchargez toutes vos données</div>
              </div>
              <Button onClick={handleExport} variant="ghost" className="text-sm">
                Exporter
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-50">Importer les données</div>
                <div className="text-xs text-slate-400">Restaurez depuis une sauvegarde</div>
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 hover:bg-white/10 transition-colors cursor-pointer">
                  Importer
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Actions Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-50">Actions du compte</div>
            <div className="text-xs text-slate-400">Gérez votre compte</div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={handleLogout} variant="ghost" className="text-sm w-full justify-start">
              Se déconnecter
            </Button>
            
            <Button 
              onClick={handleDeleteAccount} 
              variant="ghost" 
              className="text-sm w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              Supprimer le compte
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
