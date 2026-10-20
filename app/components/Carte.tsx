"use client";

import dynamic from "next/dynamic";

// On force le chargement uniquement côté client (ssr: false)
const CarteClient = dynamic(() => import("./CarteClient"), { 
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">Chargement de la carte...</div>
});

export default function Carte() {
  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
      <CarteClient />
    </div>
  );
}