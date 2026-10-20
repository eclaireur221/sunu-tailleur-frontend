"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CatalogueCouturier() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [modeles, setModeles] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [delai, setDelai] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

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

    // On utilise le couturier_id (et non user.id) pour charger les modèles
    const cId = parsedUser.couturier_id || parsedUser.id;
    fetch(`http://localhost:4000/api/modeles/couturier/${cId}`)
      .then(res => res.json())
      .then(data => setModeles(data))
      .catch(err => console.log(err));
  }, [router]);

  const handleAjouter = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Ajout en cours...");

    const formData = new FormData();
    // On utilise le couturier_id
    const cId = user.couturier_id || user.id;
    formData.append("couturier_id", cId);
    
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("prix_min", prixMin);
    formData.append("prix_max", prixMax);
    formData.append("delai_jours", delai);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://localhost:4000/api/modeles/ajouter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(" Modèle ajouté avec succès !");
        window.location.reload();
      } else {
        setMessage(" ! " + (data.error || "Erreur lors de l'ajout."));
      }
    } catch (error) {
      setMessage("!! Erreur de connexion.");
    }
  };

  if (!user) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Catalogue</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Ajouter un nouveau modèle</h2>
          <form onSubmit={handleAjouter} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Titre du modèle" required value={titre} onChange={e => setTitre(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="file" required onChange={e => setPhoto(e.target.files?.[0] || null)} className="border p-2 rounded text-gray-900" />
            </div>
            <textarea placeholder="Description" required value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded w-full text-gray-900" />
            <div className="grid grid-cols-3 gap-4">
              <input type="number" placeholder="Prix Min (FCFA)" required value={prixMin} onChange={e => setPrixMin(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Prix Max (FCFA)" required value={prixMax} onChange={e => setPrixMax(e.target.value)} className="border p-2 rounded text-gray-900" />
              <input type="number" placeholder="Délai (jours)" required value={delai} onChange={e => setDelai(e.target.value)} className="border p-2 rounded text-gray-900" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Ajouter au catalogue</button>
          </form>
          {message && <p className="mt-4 text-center font-medium text-gray-700">{message}</p>}
        </div>

        <h2 className="text-2xl font-bold mb-4">Vos modèles en ligne</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modeles.map((modele) => (
            <div key={modele.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <img src={`http://localhost:4000${modele.photos[0]}`} alt={modele.titre} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">{modele.titre}</h3>
                <p className="text-gray-500 text-sm">{modele.prix_min} - {modele.prix_max} FCFA</p>
                <p className="text-gray-500 text-sm">Délai : {modele.delai_jours} jours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}