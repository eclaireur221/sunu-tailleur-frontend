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
      {/* Barre de navigation avec effet de verre */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl"></span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                Sunu<span className="text-blue-600">Tailleur</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Accueil</a>
              <a href="/mes-commandes" className="text-gray-600 hover:text-blue-600 font-medium transition">Mes Commandes</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Connexion</a>
              <a href="/inscription" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
                S'inscrire
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Héro avec dégradé */}
      <main>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Trouvez le tailleur parfait <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                près de chez vous
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Découvrez les meilleurs stylistes et couturiers du Sénégal. Choisissez votre modèle, donnez vos mesures et commandez en toute confiance.
            </p>
            
            {/* Barre de recherche plus moderne */}
            <div className="max-w-2xl mx-auto bg-white rounded-full shadow-xl p-2 flex items-center border border-gray-100">
              <span className="pl-4 text-gray-400 text-xl"></span>
              <input 
                type="text" 
                placeholder="Rechercher un modèle, une ville..." 
                className="w-full px-4 py-3 rounded-full focus:outline-none text-gray-900 bg-transparent"
              />
              <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Section "Comment ça marche" */}
        <div className="bg-white py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Choisissez</h3>
                <p className="text-gray-500">Trouvez le modèle de vos rêves dans notre catalogue.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Mesurez</h3>
                <p className="text-gray-500">Donnez vos mesures en quelques clics.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Discutez</h3>
                <p className="text-gray-500">Négociez le prix et le délai directement avec le couturier.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Affichage de la carte */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl"></span> Tailleurs autour de vous
            </h2>
            <Carte/>
          </div>
          
          {/* Liste des modèles */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Dernières créations</h2>
              <a href="#" className="text-blue-600 font-semibold hover:underline">Voir tout</a>
            </div>
            
            {modeles.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-dashed border-gray-300">
                <p className="text-gray-500">Aucun modèle disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {modeles.map((modele) => (
                  <div key={modele.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
                    <div className="relative overflow-hidden">
                      <img 
                        src={`https://sunu-tailleur-backend.onrender.com${modele.photos[0]}`} 
                        alt={modele.titre} 
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                        {modele.prix_min} - {modele.prix_max} FCFA
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{modele.titre}</h3>
                      
                      {/* Nom du couturier et badge Vérifié */}
                      <div className="flex items-center mt-1 mb-3 space-x-2">
                        <p className="text-sm text-gray-500 font-medium">
                          Par {modele.couturier_prenom} {modele.couturier_nom}
                        </p>
                        {modele.couturier_verifie && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>✓</span> Vérifié
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-2">{modele.description}</p>
                      
                      <a href={`/commander/${modele.id}`} className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300">
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

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold mb-4"> Sunu Tailleur</p>
          <p className="text-gray-400 text-sm">© 2026 DAS-TECH. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}