"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MesCommandesPage() {
  const router = useRouter();
  const [commandes, setCommandes] = useState<any[]>([]);
  const [commandeActive, setCommandeActive] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les commandes
  const chargerCommandes = (clientId: number) => {
    fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/client/${clientId}`)
      .then(res => res.json())
      .then(data => {
        setCommandes(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role === "couturier") {
      router.push("/couturier/dashboard");
      return;
    }
    if (parsedUser.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    setUser(parsedUser);
    chargerCommandes(parsedUser.id);

    // RAFRAÎCHISSEMENT AUTOMATIQUE TOUTES LES 5 SECONDES
    const interval = setInterval(() => {
      chargerCommandes(parsedUser.id);
    }, 5000);

    // On nettoie l'intervalle quand on quitte la page
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const ouvrirChat = (id: number) => {
    setCommandeActive(id);
    fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  const envoyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !commandeActive || !user) return;

    try {
      const response = await fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${commandeActive}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expediteur_id: user.id, contenu: nouveauMessage }),
      });

      if (response.ok) {
        setNouveauMessage("");
        fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${commandeActive}/messages`)
          .then(res => res.json())
          .then(data => setMessages(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-medium">Vérification de votre compte...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">Sunu Tailleur</a>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Bonjour, {user.prenom}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Commandes</h1>

        {commandes.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
            Vous n'avez pas encore passé de commande.
          </div>
        ) : (
          <div className="space-y-4">
            {commandes.map((cmd) => (
              <div key={cmd.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {cmd.modele_photos && cmd.modele_photos[0] && (
                      <img src={`https://sunu-tailleur-backend.onrender.com${cmd.modele_photos[0]}`} alt="Modèle" className="w-16 h-16 object-cover rounded-md" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{cmd.modele_titre}</p>
                      <p className="text-sm text-gray-600">Couturier : {cmd.couturier_prenom} {cmd.couturier_nom}</p>
                      
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">Ma proposition : {cmd.prix_propose} FCFA</p>
                        
                        {cmd.prix_final ? (
                          <p className="text-sm text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded mt-1">
                            Prix convenu : {cmd.prix_final} FCFA (Délai: {cmd.delai_final_jours}j)
                          </p>
                        ) : (
                          <p className="text-sm text-yellow-600 font-medium mt-1">En attente de l'accord du couturier...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Le statut se met à jour automatiquement grâce au setInterval */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium mr-2 ${
                      cmd.statut === 'livree' ? 'bg-green-100 text-green-800' : 
                      cmd.statut === 'prete' ? 'bg-purple-100 text-purple-800' :
                      cmd.statut === 'en_couture' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cmd.statut}
                    </span>
                    
                    {cmd.prix_final && cmd.statut === 'acceptee' && (
                      <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 mr-2">
                        Payer {cmd.prix_final} FCFA
                      </button>
                    )}

                    <button onClick={() => ouvrirChat(cmd.id)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 font-medium">
                      Discuter
                    </button>
                  </div>
                </div>

                {commandeActive === cmd.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="h-48 overflow-y-auto mb-4 space-y-2 p-2 bg-white rounded border">
                      {messages.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center mt-10">Aucun message pour le moment.</p>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className={`p-2 rounded-lg max-w-[80%] ${msg.expediteur_id === user?.id ? 'bg-blue-100 ml-auto' : 'bg-gray-200 mr-auto'}`}>
                            <p className="text-xs font-bold text-gray-600">{msg.prenom} {msg.nom}</p>
                            <p className="text-sm text-gray-900">{msg.contenu}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <form onSubmit={envoyerMessage} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Répondre au couturier..." 
                        value={nouveauMessage}
                        onChange={(e) => setNouveauMessage(e.target.value)}
                        className="flex-1 border p-2 rounded text-sm text-gray-900"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">Envoyer</button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}