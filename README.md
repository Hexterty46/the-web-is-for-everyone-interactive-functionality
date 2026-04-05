# Buurtcampuskrant - Sprint 9: Data posten & Progressive Enhancement

Tijdens deze sprint is ons de opdracht gegeven, om een POST interactie te maken, en deze functionerend in onze website toepessen. Ook heb ik ook op sommige plekken Progressive Enhancement toegepast om als een component te gebruiken.

De instructie vind je in: [INSTRUCTIONS.md](https://github.com/fdnd-task/the-web-is-for-everyone-interactive-functionality/blob/main/docs/INSTRUCTIONS.md)


## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- Bij Beschrijving staat kort beschreven wat voor project het is en wat je hebt gemaakt -->
<!-- Voeg een mooie poster visual of video toe 📸 -->
<!-- Voeg een link toe naar GitHub Pages 🌐-->
Tijdens deze sprint, heb ik me gefocust op het maken van de detail pagina van de artikelen die gelezen kunnen worden op de website, met een POST interactie op de detailpagina. Hierbij heb ik verschillende states gemaakt, zoals een empty state, error staten, en een success state.

Live URL van de website: https://the-web-is-for-everyone-interactive-58hv.onrender.com/

<img width="386" height="818" alt="image" src="https://github.com/user-attachments/assets/9561306e-5a35-47ed-9877-a13a8b5682eb" />
<img width="383" height="662" alt="image" src="https://github.com/user-attachments/assets/f6e07f12-0358-41c4-b9a9-9f7daf20e49f" />


## Gebruik
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->
Voor mijn POST interactie is eerst een user story gemaakt. Hierin beschrijf ik een kleine documentatie, hoe de POST interactie eruit komt te zien. Later maak ik een scenario voor de testers, de testresultaten, en tot slot mijn commits met de verwerkte feedback. Mijn user story is te vinden in de volgende issue: [Issue](https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/issues/13?issue=Hexterty46%7Cthe-web-is-for-everyone-interactive-functionality%7C23).

Ik heb ervoor gekozen, dat ik bij elke artikel binnen de detail-pagina een comment kan toevoegen. Hiermee kunnen gebruikers van de website een comment achterlaten, en hun mening doorgeven over de artikel. Ook kunnen de gebruikers de comment die ze hebben achtergelaten terug lezen. Na het invullen van je naam, en je reactie, word je comment gePOST naar de detailpagina. Na het opslaan van de comment kan je onderaan de website je comment terug lezen. Tijdens het commenten kan je 3 verschillende states zien: als er nog geen comments zijn, zie je een empty state bij de comments. Als er tijdens het commenten iets fout gaat krijg je een error state te zien, en natuurlijk als er niks fout gaat krijg je een success state te zien.

## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framework of library gebruikt? -->

Ook heb ik tijdens deze sprint de focus gelegd op Progressive Enhancement. Deze heb ik toegepast op de openen, sluiten van mijn MENU animatie. Als de gebruiker ervoor kiest om geen animaties te zien, dan worden er geen animaties toegevoegd. Ook word ervoor gezorgd dat de MENU geopend kan worden zonder javascript om Progressive Enhancement zo goed mogelijk toe te passen op mijn website.
https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/views/partials/menu.liquid#L10-L17

Dit was stap 1 van Progressive Enhancement, stap 2 bestaat uit het stylen met CSS. Dat heb ik gedaan door toegangkelijk CSS properties te gebruken om een styling te geven aan de dropdown. De laatste stap bestaat uit het verbeteren van deze functionaliteit, zodat het toegangkelijk is voor (bijna) iedereen. Het probleem die ik ondervond tijdens mijn TAB test, was dat als ik de MENU niet had geopend, de tab test alsnog op deze elementen ging door TABBEN. Dit heb ik opgelost door `interactivity: none` te gebruiken, als de menu niet zichtbaar is. Als de menu opent word de interactivity op `interactivity: auto` gezet.
https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/public/style.css#L146

https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/public/style.css#L244-L247

Deze techniek is nu nog Limited Available. Dit betekent dat het nog niet door alle major browsers word ondersteund. Ook heb ik `@media (prefers-reduced-motion: no preference)` gebruikt voor de gebruikers die wel een animatie willen zien. De mensen die een preference hebben krijgen dit te zien zonder een animatie.

Het mooie aan Progressive Enhancement is, dat als er iets fout gaat op de website, dat de website altijd nog te gerbuiken is. Dit is goed te zien op mijn MENU. Normaal word er  een class toegevoegd op de menu op deze te kunnen openen en sluiten. Maar als de client javascript niet werkt, hoe zou de MENU dan moeten openen? Dit word opgelost door de `nav` een id te geven. Deze id zorgt ervoor, dat ik naar mijn nav kan navigeren als ik op de MENU button druk in mijn header.

https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/views/partials/head.liquid#L17

https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/public/style.css#L243-L247

https://github.com/Hexterty46/the-web-is-for-everyone-interactive-functionality/blob/be64068af48064d0f280779eed93e6db4c63b2dc/public/script.js#L1-L13

Als laatste zorg ik ervoor dat dit alleen word toegepast, als javascript niet beschikbaar is. dit doe ik door een `event.preventdefault()` toe te voegen in mijn js bestand.

## Installatie
<!-- Bij Installatie staat hoe een andere developer aan jouw repo kan werken -->
Om de development omgeving in te richten om aan deze repository te kunnen werken moet je deze stappen volgen:

Stap 1) Installeer de [NodeJS ontwikkelomgeving](https://nodejs.org/en/download). Kies voor NodeJS 24.13.0 (LTS, long-term support), download het installatiebestand en doorloop het installatieproces.

Stap 2) Fork deze repository, clone deze op jouw computer en open het in VSCodium/ een code editor.

Stap 3) Open de Terminal in VSCodium, Voer in de terminal het commando npm install uit door het in te typen en op enter te drukken.

Stap 4 ) Na de installatie is de map node_modules aangemaakt, en gevuld met allerlei packages. Start de website door in de terminal het comando npm start uit te voeren. Als het goed is, komt hier een melding te staan over het opstarten van de server: Application started on http://localhost:8000 — Open deze URL in je browser.




## Bronnen
- [Interactivity](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interactivity)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
