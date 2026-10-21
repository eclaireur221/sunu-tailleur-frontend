"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CouturierDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [commandes, setCommandes] = useState<any[]>([]);
  
  // États pour le chat
  const [commandeActive, setCommandeActive] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState("");

  // États pour la négociation
  const [prixFinal, setPrixFinal] = useState("");
  const [delaiFinal, setDelaiFinal] = useState("");

  // Référence pour savoir quelle commande est ouverte dans le chat
  const commandeActiveRef = useRef<number | null>(null);
  commandeActiveRef.current = commandeActive;

  const chargerCommandes = (couturierId: number) => {
    fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/couturier/${couturierId}`)
      .then(res => res.json())
      .then(data => setCommandes(data))
      .catch(err => console.error(err));
  };

  const chargerMessages = (commandeId: number) => {
    fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${commandeId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (parsedUser.role === "client") {
      router.push("/profil");
      return;
    }

    setUser(parsedUser);
    const cId = parsedUser.couturier_id || parsedUser.id;

    if (parsedUser.verifie) {
      chargerCommandes(cId); 
    }

    // RAFRAÎCHISSEMENT AUTOMATIQUE TOUTES LES 5 SECONDES
    const interval = setInterval(() => {
      if (parsedUser.verifie) {
        chargerCommandes(cId);
      }
      // Si un chat est ouvert, on recharge aussi les messages
      if (commandeActiveRef.current) {
        chargerMessages(commandeActiveRef.current);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const ouvrirChat = (id: number) => {
    setCommandeActive(id);
    const cmd = commandes.find(c => c.id === id);
    if (cmd) {
      setPrixFinal(cmd.prix_propose.toString());
      setDelaiFinal(cmd.delai_propose_jours.toString());
    }
    chargerMessages(id);
  };

  const envoyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !commandeActive) return;
    try {
      const response = await fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${commandeActive}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expediteur_id: user.id, contenu: nouveauMessage }),
      });
      if (response.ok) {
        setNouveauMessage("");
        chargerMessages(commandeActive);
      }
    } catch (error) { console.error(error); }
  };

  const validerPrix = async (id: number) => {
    try {
      const response = await fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${id}/fixer-prix`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prix_final: parseInt(prixFinal), 
          delai_final_jours: parseInt(delaiFinal) 
        }),
      });
      if (response.ok) {
        alert("Accord validé avec succès !");
        chargerCommandes(user.couturier_id || user.id);
      }
    } catch (error) { console.error(error); }
  };

  const handleChangerStatut = async (id: number, nouveauStatut: string) => {
    try {
      const response = await fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/${id}/statut`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      if (response.ok) {
        chargerCommandes(user.couturier_id || user.id);
      }
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return <div className="p-10 text-center">Vérification de l'accès...</div>;

  if (user.role === 'couturier' && !user.verifie) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Compte en attente de validation</h1>
          <p className="text-gray-600 mb-6">L'administrateur doit vérifier votre profil avant de vous donner accès aux commandes.</p>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300">Se déconnecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-bold text-blue-600">Espace Couturier</span>
            <div className="flex items-center space-x-4">
              <a href="/couturier/profil" className="text-gray-700 hover:text-blue-600 font-medium">Mon Profil</a>
              <span className="text-gray-700 font-medium">Bonjour, {user.prenom} !</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">Déconnexion</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>

        <div className="mb-8">
          <a href="/couturier/dashboard/catalogue" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">+ Gérer mon Catalogue</a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vos commandes récentes</h2>
          
          {commandes.length === 0 ? (
            <p className="text-gray-500">Aucune commande pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {commandes.map((cmd) => (
                <div key={cmd.id} className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {cmd.modele_photos && cmd.modele_photos[0] && (
                        <img src={`https://sunu-tailleur-backend.onrender.com${cmd.modele_photos[0]}`} alt="Modèle" className="w-16 h-16 object-cover rounded-md" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{cmd.modele_titre}</p>
                        <p className="text-sm text-gray-600">Client : {cmd.client_prenom} {cmd.client_nom}</p>
                        <p className="text-sm text-blue-600 font-semibold">
                          Proposition client : {cmd.prix_propose} FCFA (Délai: {cmd.delai_propose_jours}j)
                        </p>
                        {cmd.prix_final && (
                          <p className="text-sm text-green-600 font-bold mt-1">
                            Prix convenu : {cmd.prix_final} FCFA (Délai: {cmd.delai_final_jours}j)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cmd.statut === 'livree' ? 'bg-green-100 text-green-800' : 
                        cmd.statut === 'prete' ? 'bg-purple-100 text-purple-800' :
                        cmd.statut === 'en_couture' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cmd.statut}
                      </span>
                      
                      <div className="flex space-x-2">
                        {cmd.statut === 'acceptee' && (
                          <button onClick={() => handleChangerStatut(cmd.id, 'en_couture')} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Commencer</button>
                        )}
                        {cmd.statut === 'en_couture' && (
                          <button onClick={() => handleChangerStatut(cmd.id, 'prete')} className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">Prêt</button>
                        )}
                        {cmd.statut === 'prete' && (
                          <button onClick={() => handleChangerStatut(cmd.id, 'livree')} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900">Livrée</button>
                        )}
                        
                        <button onClick={() => ouvrirChat(cmd.id)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300 font-medium">Discuter</button>
                      </div>
                    </div>
                  </div>

                  {commandeActive === cmd.id && (
                    <div className="border-t border-gray-200 p-4 bg-white">
                      <div className="h-48 overflow-y-auto mb-4 space-y-2 p-2 bg-gray-50 rounded border">
                        {messages.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center mt-10">Aucun message.</p>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className={`p-2 rounded-lg max-w-[80%] ${msg.expediteur_id === user.id ? 'bg-blue-100 ml-auto' : 'bg-gray-200 mr-auto'}`}>
                              <p className="text-xs font-bold text-gray-600">{msg.prenom} {msg.nom}</p>
                              <p className="text-sm text-gray-900">{msg.contenu}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {cmd.statut === 'en_attente' && (
                        <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-sm font-bold text-blue-800 mb-2">Fixer le prix et le délai final :</p>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="number" 
                              placeholder="Prix final (FCFA)" 
                              value={prixFinal} 
                              onChange={e => setPrixFinal(e.target.value)} 
                              className="border p-2 rounded text-sm w-1/3 text-gray-900" 
                            />
                            <input 
                              type="number" 
                              placeholder="Délai final (jours)" 
                              value={delaiFinal} 
                              onChange={e => setDelaiFinal(e.target.value)} 
                              className="border p-2 rounded text-sm w-1/3 text-gray-900" 
                            />
                            <button 
                              onClick={() => validerPrix(cmd.id)} 
                              className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 w-1/3"
                            >
                              Valider l'accord
                            </button>
                          </div>
                        </div>
                      )}

                      <form onSubmit={envoyerMessage} className="flex gap-2">
                        <input type="text" placeholder="Répondre..." value={nouveauMessage} onChange={(e) => setNouveauMessage(e.target.value)} className="flex-1 border p-2 rounded text-sm text-gray-900" />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">Envoyer</button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}