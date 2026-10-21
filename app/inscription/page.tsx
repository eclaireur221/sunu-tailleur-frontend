"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. On crée un composant interne pour le formulaire
function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClientOnly = searchParams.get("role") === "client";

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    mot_de_passe: "",
    role: "client",
    nom_atelier: "",
  });
  
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isClientOnly) setFormData(prev => ({ ...prev, role: "client" }));
  }, [isClientOnly]);

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://sunu-tailleur-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(" Compte créé avec succès ! Redirection...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(" ! " + data.error);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage("!! Erreur de connexion.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {isClientOnly ? "Créez votre compte" : "Inscription"}
        </h2>
        <p className="text-gray-500 mt-2">
          {isClientOnly ? "Finalisez votre commande en créant un compte." : "Rejoignez la communauté Sunu Tailleur."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleInscription}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
            <input type="text" required value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
            <input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
          <input type="text" required value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" placeholder="Ex: 77 000 00 00" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optionnel)</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input type="password" required value={formData.mot_de_passe} onChange={(e) => setFormData({...formData, mot_de_passe: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" />
        </div>

        {!isClientOnly && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Je suis :</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition">
                <option value="client">Un Client</option>
                <option value="couturier">Un Couturier</option>
              </select>
            </div>
            {formData.role === "couturier" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de votre Atelier</label>
                <input type="text" required value={formData.nom_atelier} onChange={(e) => setFormData({...formData, nom_atelier: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition" placeholder="Ex: Atelier Moussa" />
              </div>
            )}
          </>
        )}

        <button type="submit" disabled={isLoading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-600 transition duration-300 shadow-md hover:shadow-lg mt-4 disabled:opacity-70">
          {isLoading ? "Création..." : "S'inscrire"}
        </button>
      </form>

      {message && <div className="mt-6 text-center text-sm font-medium text-gray-800 bg-gray-100 p-3 rounded-lg">{message}</div>}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}

// 2. Le composant principal exporté par défaut
export default function InscriptionPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-green-600 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center text-white">
          <span className="text-8xl mb-6 block"></span>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Rejoignez-nous</h1>
          <p className="text-xl text-blue-100 max-w-md mx-auto">
            Que vous soyez un styliste de talent ou un client à la recherche de la pièce parfaite, votre place est ici.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-12">
        {/* 3. On enveloppe le formulaire dans Suspense */}
        <Suspense fallback={<div className="text-gray-500 font-medium">Chargement du formulaire...</div>}>
          <InscriptionForm />
        </Suspense>
      </div>
    </div>
  );
}