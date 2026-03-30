// friet.js

/**
 * @type {import('./typedef.js').Friet[]}
 */
export const FRIET = [
  {
    id: 1,
    naam: 'Friet'
  },
  {
    id: 2,
    naam: 'Friet speciaal'
  },
  {
    id: 3,
    naam: 'Friet oorlog'
  },
  {
    id: 4,
    naam: 'Friet met mayonaise'
  }
];
/**
 * Returns true als de frietnaam bestaat
 *
 * @param {string} frietNaam
 * @returns {boolean} true als de friet naam bestaat
 */
export function frietNaamBestaat(frietNaam) {
  for (const { naam } of FRIET) {
    if (frietNaam === naam) {
      return true;
    }
  }
  return false;
}

/**
 * Geef een friet terug als deze bestaat
 *
 * @param {number} id
 * @returns {import('./typedef.js').Friet|null}
 */
export function findFrietById(id) {
  for (const friet of FRIET) {
    if (friet.id === id) {
      return friet;
    }
  }
  return null;
}

/**
 * Geef het id van een friet op basis van naam
 *
 * @param {{ naam: string }} friet
 * @returns {number} id van de friet of -1
 */
export function getFrietId(friet) {
  for (const { id, naam } of FRIET) {
    if (friet.naam === naam) {
    return /** @type {number} */ (id);
    }
  }
  return -1;
}

