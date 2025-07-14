import React, { useEffect, useState } from 'react';

interface HeroData {
    title: string;
    subtitle: string;
    description: string;
}

export const HeroEditor: React.FC = () => {
    const [hero, setHero] = useState<HeroData | null>(null);

    useEffect(() => {
        window.electronAPI.getHero().then((data) => {
            if (data) {
                setHero(data);
            }
        });
    }, []);

    if (!hero) return <div>Cargando...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Editor de Hero</h2>
            <div className="space-y-2">
                <div>
                    <label>Título:</label>
                    <input className="border px-2 py-1 w-full" value={hero.title} readOnly />
                </div>
                <div>
                    <label>Subtítulo:</label>
                    <input className="border px-2 py-1 w-full" value={hero.subtitle} readOnly />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea className="border px-2 py-1 w-full" value={hero.description} readOnly />
                </div>
            </div>
        </div>
    );
};
