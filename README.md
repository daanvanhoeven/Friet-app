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
- bij bijvoorbeeld een broodje frikandel is het alleen mogelijk voor zacht en wit, laat daardoor de optie voor dat broodje de optie voor hard en bruin niet zien.
- nieuw uiterlijk
- 
# onderzoek
-waarom krijgt iedereen de bestelling op de pagina



# wat kan er mooier
- laat de snacks en friet etz pas na invullen van de naam zien

# bugs


-   9 bestellingen klopt niet, wel 9 personen, je wilt hoeveelheid dingen zien als bestellingen
- je kan alleen een broodje kiezen zonder de opties te doen



- via endpoint bestelling toevoegen bij nieuwe bestellijst maken zodat je nieuwe bestellijst kan aanmaken zonder dat er iets in zit.




