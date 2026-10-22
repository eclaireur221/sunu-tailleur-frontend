"use client";

import { useEffect, useState } from "react";
import Carte from "./components/Carte";

export default function Home() {
  const [modeles, setModeles] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://sunu-tailleur-backend.onrender.com/api/modeles/tous")
      .then((res) => res.json())
      .then((data) => setModeles(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Barre de navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 md:h-20">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                Sunu<span className="text-blue-600">Tailleur</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Accueil</a>
              <a href="/mes-commandes" className="text-gray-600 hover:text-blue-600 font-medium transition">Mes Commandes</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Connexion</a>
              <a href="/inscription" className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-sm md:text-base">
                S'inscrire
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Section principale */}
      <main>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-12 md:pt-20 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Trouvez le tailleur parfait <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                près de chez vous
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10">
              Découvrez les meilleurs stylistes et couturiers du Sénégal. Choisissez votre modèle, donnez vos mesures et commandez en toute confiance.
            </p>
            
            <div className="max-w-2xl mx-auto bg-white rounded-full shadow-xl p-2 flex items-center border border-gray-100">
              <input 
                type="text" 
                placeholder="Rechercher un modèle, une ville..." 
                className="w-full px-4 py-2 md:py-3 rounded-full focus:outline-none text-gray-900 bg-transparent text-sm md:text-base"
              />
              <button className="bg-gray-900 text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-gray-800 transition text-sm md:text-base">
                Rechercher
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white py-12 md:py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="p-4 md:p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Choisissez</h3>
                <p className="text-gray-500">Trouvez le modèle de vos rêves dans notre catalogue.</p>
              </div>
              <div className="p-4 md:p-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Mesurez</h3>
                <p className="text-gray-500">Donnez vos mesures en quelques clics.</p>
              </div>
              <div className="p-4 md:p-6">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Discutez</h3>
                <p className="text-gray-500">Négociez le prix et le délai directement avec le couturier.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="mb-12 md:mb-20">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              Tailleurs autour de vous
            </h2>
            <Carte />
          </div>
          
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dernières créations</h2>
              <a href="#" className="text-blue-600 font-semibold hover:underline">Voir tout</a>
            </div>
            
            {modeles.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-dashed border-gray-300">
                <p className="text-gray-500">Aucun modèle disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {modeles.map((modele) => (
                  <div key={modele.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
                    <div className="relative overflow-hidden h-56 md:h-72">
                      <img 
                        src={modele.photos[0]} 
                        alt={modele.titre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold text-gray-900 shadow-sm">
                        {modele.prix_min} - {modele.prix_max} FCFA
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex-grow flex flex-col">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{modele.titre}</h3>
                      
                      <div className="flex items-center mt-1 mb-3 space-x-2">
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                          Par {modele.couturier_prenom} {modele.couturier_nom}
                        </p>
                        {modele.couturier_verifie && (
                          <span className="bg-green-100 text-green-700 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>✓</span> Vérifié
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 flex-grow line-clamp-2">{modele.description}</p>
                      
                      <a href={`/commander/${modele.id}`} className="block w-full text-center bg-gray-900 text-white py-2 md:py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300 text-sm md:text-base">
                        Commander ce modèle
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 md:py-12 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Sunu Tailleur</p>
          <p className="text-gray-400 text-xs md:text-sm">© 2026 Sunu Tailleur. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}