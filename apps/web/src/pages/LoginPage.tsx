import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, register } from "../app/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await dispatch(login({ email, password })).unwrap();
        toast.success("Connecté !");
        navigate("/");
      } else {
        await dispatch(register({ email, password, firstName, lastName })).unwrap();
        toast.success("Inscrit !");
        navigate("/");
      }
    } catch {
      // error already in Redux slice
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <h2 className="mb-6 text-xl font-semibold text-slate-50">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-200">Prénom</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-200">Nom</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Mot de passe</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "S'inscrire"}
          </Button>
          <button
            type="button"
            className="text-xs text-slate-400 hover:text-slate-200"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </form>
      </Card>
    </div>
  );
}
