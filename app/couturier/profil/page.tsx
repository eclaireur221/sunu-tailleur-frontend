"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilCouturier() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nomAtelier, setNomAtelier] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Charger le profil actuel depuis le backend
    fetch(`https://sunu-tailleur-backend.onrender.com/api/couturiers/profil/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setNomAtelier(data.nom_atelier || "");
        setDescription(data.description || "");
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sauvegarde en cours...");

    try {
      const response = await fetch(`https://sunu-tailleur-backend.onrender.com/api/couturiers/profil/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom_atelier: nomAtelier, description: description }),
      });

      if (response.ok) {
        setMessage("Profil mis à jour avec succès.");
      } else {
        setMessage("Erreur lors de la sauvegarde.");
      }
    } catch (error) {
      setMessage("Erreur de connexion.");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement du profil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* En-tête de la page */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-500">Ces informations seront visibles par les clients.</p>
          </div>
          <a href="/couturier/dashboard" className="text-blue-600 hover:underline font-medium">
            Retour au tableau de bord
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de l'atelier</label>
            <input 
              type="text" 
              value={nomAtelier} 
              onChange={(e) => setNomAtelier(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" 
              placeholder="Ex: Atelier Moussa" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description de l'atelier</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" 
              rows={4}
              placeholder="Ex: Spécialiste en boubou et costumes traditionnels."
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Enregistrer les modifications
          </button>
        </form>

        {message && <p className="mt-4 text-center font-medium text-gray-800 bg-gray-100 p-3 rounded">{message}</p>}
      </div>
    </div>
  );
}