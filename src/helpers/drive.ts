/**
 * Convertit un lien Google Drive ou un FILE_ID en URL directe.
 * @param input Lien Drive ("https://drive.google.com/file/d/ID/view?...") ou directement l'ID.
 * @param opts  { mode: 'view' | 'download' }  (par défaut 'view')
 * @returns URL directe ou null si rien d'extractable.
 */
export function driveDirectUrl(
  input: string,
  opts: { mode?: "view" | "download" } = {}
): string | null {
  const mode = opts.mode === "download" ? "download" : "view";
  const id = extractDriveFileId(input);
  return id ? `https://drive.google.com/uc?export=${mode}&id=${id}` : null;
}

/** Extrait l'ID de fichier Google Drive depuis divers formats d'URL ou un ID brut. */
export function extractDriveFileId(input: string): string | null {
  if (!input) return null;
  // Nettoyage de l'entrée: retire espaces, quotes, chevrons et éventuel '@' en tête
  let s = input.trim();
  s = s.replace(/^[@\s"'<>]+/, "").replace(/[@\s"'<>]+$/, "");

  // 1) ID brut
  if (/^[-\w]{25,}$/.test(s)) return s;

  // 2) Tentative via URL
  try {
    // Ajoute un schéma si omis (ex: drive.google.com/...)
    const withScheme = /^(https?:)?\/\//i.test(s)
      ? s.startsWith("//")
        ? `https:${s}`
        : s
      : `https://${s}`;
    const u = new URL(withScheme);

    // ?id=FILE_ID (open?id=..., uc?id=..., thumbnail?id=...)
    const qid = u.searchParams.get("id");
    if (qid && /^[-\w]{25,}$/.test(qid)) return qid;

    // /file/d/FILE_ID/...
    const m1 = u.pathname.match(/\/file\/d\/([-\w]{25,})/);
    if (m1) return m1[1];

    // Fallback : n'importe quel /d/FILE_ID
    const m2 = u.pathname.match(/\/d\/([-\w]{25,})/);
    if (m2) return m2[1];
  } catch {
    // Ce n'est pas une URL — on retente en brut
  }

  // 3) Dernier recours : capture d'un ID plausible dans la chaîne
  const m3 = s.match(/[-\w]{25,}/);
  return m3 ? m3[0] : null;
}
