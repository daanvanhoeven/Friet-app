<<<<<<< HEAD
# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.12.5 create --template library --types jsdoc --add prettier tailwindcss="plugins:typography,forms" --install npm Friet-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
=======
# Friet-app
Werken met svelte aan een friet-app
>>>>>>> 607c184f1d78406c440d9800193751e4731d520b


# Observatie
-in  de app kan je nu snacks (kan met saus), friet en een broodje bestellen.
-er is soms verwarring waarom ze niet kunnen bestellen(komt doordat ze geen naam ingevuld hebben)
-soms verwarring met de dropdown dat je iets gekozen hebt(als je op de dropdown klikt en toch iets anders wilt dan moet je er opnieuw op klikken)
-snacklijst onderaan is nogal lang als er veel mensen bestellen(nogal onoverzichtelijk)



# Wat kan er allemaal beter?
-  //AF//   er moet een  komen als je probeert te bestellen dat er op de knop of in het naamveld komt te staan dat je jouw naam moet invullen 

-dropwdowns kunnen anders dat ze beter zijn voor de telefoon 

-// AF// je moet kunnen zien hoeveel mensen hebben besteld bij samenvatting

-bij de bestelling lijst moet het meer leesbaarder worden, kan een uitklap lijst worden, er staan nu veel "-" overal kan anders.
    
- //deels af, je kan nu je broodje kiezen, sauzen is niet misschien nog nodig//
           bij de broodjes en misschien bij de snacks, dat je het broodje zelf samen kan stellen, bij de snacks dat je daar als je sauzen kan kiezen



- pas de opties voor broodjes voor wit of beleg laten zien als de optie daarvoor eerst is gekozen
- kan ook bij de saus bij de snack

- tailwind met skeletondev voor themes


-toeggangscode, kan in url, bestelcodem et QR(meerdere bestellingen.)
- kan met een admin panel

-mischien meerdere cafertaria's



# onderzoek
-waarom krijgt iedereen de bestelling op de pagina


