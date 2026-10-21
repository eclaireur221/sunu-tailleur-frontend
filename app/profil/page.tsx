"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [commandes, setCommandes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    //  SÉCURITÉ : Si c'est un couturier, on le redirige vers son tableau de bord
    if (parsedUser.role === "couturier") {
      router.push("/couturier/dashboard");
      return;
    }

    setUser(parsedUser);

    // Charger les commandes du client connecté
    fetch(`https://sunu-tailleur-backend.onrender.com/api/commandes/client/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => setCommandes(data))
      .catch(err => console.error(err));

  }, [router]);

  if (!user) return <div className="p-10 text-center">Vérification de l'accès...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Espace Client</h1>
        <p className="text-gray-600 mb-8">Bienvenue, {user.prenom} {user.nom} !</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte de résumé */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Résumé</h2>
            <p className="text-gray-700">Nombre de commandes : <span className="font-bold text-blue-600">{commandes.length}</span></p>
            <a href="/mes-commandes" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Voir mes commandes
            </a>
          </div>

          {/* Carte d'informations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Mes informations</h2>
            <p className="text-gray-700">Téléphone : {user.telephone}</p>
            <p className="text-gray-700">Rôle : Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}