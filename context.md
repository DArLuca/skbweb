Project Context: SKB Chess Club Web Prototype

1. The Goal:
Building a modern, professional prototype for the SKB Chess Club to replace an outdated Google Sites page. Deadline: February 20th.

2. Tech Stack:

    Frontend: React (Vite) + TypeScript.

    Styling: Tailwind CSS + shadcn/ui (based on the LeoRoese template).

    Routing: React Router DOM (Multi-page setup).

    Theme: ThemeProvider configured with Light Mode as default.

3. Current Architecture & Progress:

    Routing Logic: Successfully transitioned from a "Single Page Scroll" template to a "Multi-Page Application" (MPA) structure.

    App.tsx: Functions as a layout shell. It contains the persistent <Navbar /> and <Footer />, with a <Routes> block in the middle for page content.

    Page Structure:

        src/pages/Home.tsx: Contains the Hero section and main landing content.

        Stubs created: Meisterschaft.tsx, Verein.tsx, Jugend.tsx, Presse.tsx, Shop.tsx, and MitgliedWerden.tsx.

    Navbar: Updated to use React Router <Link> components instead of standard <a> tags. The links are mapped to the new routes.

    Cleanup: Stripped out SaaS-related template bloat (Pricing, Features, Testimonials) to focus on a clean, club-centric mental model.

4. Site Map:

    / (Home): Hero & Overview.

    /meisterschaft: Tournament results/tables.

    /verein: Club info & history.

    /jugend: Youth department details.

    /presse: News and articles.

    /shop: Club merchandise.

    /mitglied-werden: Join form/membership info.
