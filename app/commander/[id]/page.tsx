"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommanderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const modeleId = resolvedParams.id;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [epaules, setEpaules] = useState("");
  const [poitrine, setPoitrine] = useState("");
  const [taille, setTaille] = useState("");
  const [hanches, setHanches] = useState("");
  const [longueur, setLongueur] = useState("");
  const [adresse, setAdresse] = useState("");
  const [prix, setPrix] = useState("");
  const [delai, setDelai] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleCommander = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setMessage("Envoi de la commande...");
    const couturier_id = 1; 

    const commandeData = {
      client_id: user.id,
      couturier_id,
      modele_id: parseInt(modeleId),
      mesures: { epaules, poitrine, taille, hanches, longueur_totale: longueur },
      prix_propose: parseInt(prix),
      delai_propose_jours: parseInt(delai),
      adresse_livraison: adresse
    };

    try {
      const response = await fetch("http://localhost:4000/api/commandes/creer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commandeData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(" Commande envoyée avec succès ! Le couturier va vous répondre.");
        setTimeout(() => router.push("/mes-commandes"), 3000); 
      } else {
        setMessage("! " + data.error);
      }
    } catch (error) {
      setMessage("!! Erreur de connexion au serveur.");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vous y êtes presque !</h1>
          <p className="text-gray-600 mb-8">
            Pour passer commande et pouvoir discuter avec le tailleur, veuillez vous connecter ou créer un compte.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", window.location.pathname); // On sauvegarde l'URL
                router.push("/login");
              }} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Se connecter
            </button>
            <button 
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", window.location.pathname); // On sauvegarde l'URL
                router.push("/inscription?role=client");
              }} 
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
            >
              Créer un compte Client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Passer la commande</h1>
        <p className="text-gray-600 mb-6">Connecté en tant que <strong>{user.prenom} {user.nom}</strong></p>
        
        <form onSubmit={handleCommander} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2"> Vos mesures (en cm)</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Épaules" required value={epaules} onChange={e => setEpaules(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Poitrine" required value={poitrine} onChange={e => setPoitrine(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Taille" required value={taille} onChange={e => setTaille(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Hanches" required value={hanches} onChange={e => setHanches(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Longueur totale" required value={longueur} onChange={e => setLongueur(e.target.value)} className="border p-2 rounded text-gray-900 col-span-2" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2"> Livraison</h2>
            <input type="text" placeholder="Votre adresse complète" required value={adresse} onChange={e => setAdresse(e.target.value)} className="border p-2 rounded w-full text-gray-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2"> Votre proposition</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Prix proposé (FCFA)" required value={prix} onChange={e => setPrix(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Délai souhaité (jours)" required value={delai} onChange={e => setDelai(e.target.value)} className="border p-2 rounded text-gray-900" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Envoyer la commande</button>
        </form>
        {message && <p className="mt-4 text-center font-medium text-gray-800 bg-gray-100 p-3 rounded">{message}</p>}
      </div>
    </div>
  );
}