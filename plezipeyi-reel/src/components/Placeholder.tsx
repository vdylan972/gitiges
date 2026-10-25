import React from 'react';
import { AbsoluteFill } from 'remotion';
import { bodyFont } from '../lib/fonts';

/**
 * Remplace un asset manquant : fond gris foncé, nom et description du plan.
 * Le texte est placé en haut de la zone utile (sous les 250 px réservés) pour ne
 * pas se superposer aux textes du film.
 */
export const Placeholder: React.FC<{
  label: string;
  description?: string;
  src?: string;
  /** 'lower' : haut de la zone utile (plans plein cadre) ; 'center' : centré (éléments plus petits). */
  position?: 'lower' | 'center';
  scale?: number;
}> = ({ label, description, src, position = 'lower', scale = 1 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#2A2A2A',
        justifyContent: position === 'lower' ? 'flex-start' : 'center',
        alignItems: 'center',
        paddingTop: position === 'lower' ? 400 : 0,
        paddingLeft: 90 * scale,
        paddingRight: 90 * scale,
        fontFamily: bodyFont(),
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 40 * scale, fontWeight: 500, lineHeight: 1.25 }}>
        {label}
        {description ? ` — ${description}` : null}
      </div>
      {src ? (
        <div style={{ marginTop: 18 * scale, fontSize: 22 * scale, opacity: 0.55, fontFamily: 'monospace' }}>
          fichier attendu : public/{src}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
