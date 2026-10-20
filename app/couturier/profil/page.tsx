"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilCouturierPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    // SÉCURITÉ : Si c'est un client, on le redirige vers son espace
    if (parsedUser.role === "client") {
      router.push("/profil");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  if (!user) return <div className="p-10 text-center">Vérification de l'accès...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Espace Couturier</h1>
        <p className="text-gray-600 mb-8">Bienvenue dans votre atelier, {user.prenom} !</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Mon Atelier</h2>
            <p className="text-gray-700">Rôle : Couturier</p>
            <a href="/couturier/dashboard" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Aller au Tableau de bord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}