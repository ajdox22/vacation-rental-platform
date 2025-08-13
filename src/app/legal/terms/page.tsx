import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — iznajmivikendicu.ba',
  description: 'Uslovi korištenja platforme iznajmivikendicu.ba',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 prose prose-slate">
      <h1>Uslovi korištenja</h1>
      <p>
        Korištenjem ove stranice prihvatate sljedeće uslove. Ovaj tekst je
        privremeni i služi kao placeholder dok ne dodamo finalni TOS.
      </p>
      <h2>1. Opseg usluge</h2>
      <p>
        Mi objavljujemo oglase i promocije vikendica. Ne posredujemo u
        naplati rezervacija niti uzimamo proviziju za boravke.
      </p>
      <h2>2. Sadržaj i kontakt</h2>
      <p>
        Kontakt telefon i e-mail vlasnika su javno prikazani na stranici
        oglasa. Za tačnost podataka odgovoran je vlasnik oglasa.
      </p>
      <h2>3. Odgovornost</h2>
      <p>
        Platforma ne garantuje raspoloživost smještaja niti učestvuje u
        naplati. Sve dogovore gost zaključuje direktno s vlasnikom.
      </p>
      <h2>4. Zabranjeni sadržaji</h2>
      <p>
        Oglasi koji krše pravila mogu biti moderirani, suspendovani ili
        uklonjeni bez najave.
      </p>
      <p className="text-sm text-slate-500">
        Zadnje ažuriranje: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
