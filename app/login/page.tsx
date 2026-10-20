"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    //  VALIDATION DU NUMÉRO DE TÉLÉPHONE AVANT ENVOI
    const regexSenegal = /^(70|71|76|77|78)[0-9]{7}$/;
    if (!regexSenegal.test(telephone)) {
      setMessage("!! Numéro de téléphone invalide. Il doit commencer par 70, 71, 76, 77 ou 78.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telephone, mot_de_passe: motDePasse }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else {
          if (data.user.role === "admin") window.location.href = "/admin/dashboard";
          else if (data.user.role === "couturier") window.location.href = "/couturier/dashboard";
          else window.location.href = "/profil"; 
        }
      } else {
        setMessage(" ! " + data.error);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage("!! Erreur de connexion au serveur.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-green-600 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center text-white">
          <span className="text-8xl mb-6 block"></span>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Sunu Tailleur</h1>
          <p className="text-xl text-blue-100 max-w-md mx-auto">
            La mode sénégalaise à portée de main. Connectez-vous pour découvrir les meilleurs ateliers près de chez vous.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bon retour !</h2>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value.replace(/\D/g, ''))} // Empêche les lettres
                maxLength={9} // Limite à 9 chiffres
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50 focus:bg-white transition"
                placeholder="Ex: 770000000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50 focus:bg-white transition"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {message && (
            <div className="mt-6 text-center text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <a href="/inscription" className="text-blue-600 font-bold hover:underline">
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}