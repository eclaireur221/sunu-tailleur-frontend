"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [commandes, setCommandes] = useState<any[]>([]);
  const [onglet, setOnglet] = useState("utilisateurs");

  const chargerDonnees = () => {
    fetch("http://localhost:4000/api/admin/utilisateurs").then(res => res.json()).then(data => setUtilisateurs(data));
    fetch("http://localhost:4000/api/admin/commandes").then(res => res.json()).then(data => setCommandes(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) { router.push("/login"); return; }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") { router.push("/"); return; }
    setUser(parsedUser);
    chargerDonnees();
  }, [router]);

  const validerCouturier = async (id: number) => {
    await fetch(`http://localhost:4000/api/admin/verifier-couturier/${id}`, { method: "PUT" });
    chargerDonnees();
  };

  const supprimerUtilisateur = async (id: number) => {
    if (window.confirm("Supprimer définitivement ce compte ?")) {
      await fetch(`http://localhost:4000/api/admin/utilisateur/${id}`, { method: "DELETE" });
      chargerDonnees();
    }
  };

  const suspendreUtilisateur = async (id: number, suspenduActuel: boolean) => {
    await fetch(`http://localhost:4000/api/admin/suspendre/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspendu: !suspenduActuel }),
    });
    chargerDonnees();
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login");
  };

  if (!user) return <div className="p-10 text-center">Vérification...</div>;

  // Séparation des utilisateurs
  const demandesEnAttente = utilisateurs.filter(u => u.role === 'couturier' && !u.verifie && !u.suspendu);
  const membresActifs = utilisateurs.filter(u => u.role !== 'admin' && (u.verifie || u.role === 'client'));

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-gray-900 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <span className="text-2xl font-bold"> Espace Admin</span>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-700">Déconnexion</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setOnglet("utilisateurs")} className={`px-4 py-2 rounded font-bold ${onglet === "utilisateurs" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>Utilisateurs</button>
          <button onClick={() => setOnglet("commandes")} className={`px-4 py-2 rounded font-bold ${onglet === "commandes" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>Commandes</button>
        </div>

        {onglet === "utilisateurs" && (
          <div className="space-y-8">
            
            {/* SECTION 1 : DEMANDES EN ATTENTE */}
            {demandesEnAttente.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <h2 className="text-xl font-bold mb-4 text-yellow-700"> Nouvelles demandes de couturiers</h2>
                <div className="space-y-4">
                  {demandesEnAttente.map(u => (
                    <div key={u.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                      <div>
                        <p className="font-bold">{u.prenom} {u.nom} <span className="text-sm text-gray-500 font-normal">({u.nom_atelier})</span></p>
                        <p className="text-sm text-gray-500">{u.telephone}</p>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => validerCouturier(u.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 font-bold"> Valider</button>
                        <button onClick={() => supprimerUtilisateur(u.id)} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 font-bold"> Refuser</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2 : MEMBRES ACTIFS (SUSPENDRE) */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Membres de la plateforme</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {membresActifs.map((u) => (
                    <tr key={u.id} className={u.suspendu ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 font-medium">{u.prenom} {u.nom}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'couturier' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {u.suspendu ? <span className="text-red-600">Suspendu</span> : <span className="text-green-600"> Actif</span>}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => suspendreUtilisateur(u.id, u.suspendu)} className={`${u.suspendu ? 'bg-blue-600' : 'bg-orange-500'} text-white px-4 py-2 rounded text-sm font-bold`}>
                          {u.suspendu ? 'Réactiver' : 'Suspendre'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {onglet === "commandes" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Toutes les commandes</h2>
            <div className="space-y-4">
              {commandes.map((cmd) => (
                <div key={cmd.id} className="border p-4 rounded-lg flex justify-between">
                  <div>
                    <p className="font-bold">{cmd.modele_titre}</p>
                    <p className="text-sm">Client : {cmd.client_prenom} ➔ Couturier : {cmd.couturier_prenom}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{cmd.statut}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}