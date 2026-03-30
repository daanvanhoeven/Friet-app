/**
 * @typedef {{
 *   id?: number,
 *   naam?: string,
 *   beleg: string,
 *   hardOfZacht: 'hard'|'zacht',
 *   witOfBruin: 'wit'|'bruin',
 *   vega: boolean
 * }} Broodje
 */

/**
 * @typedef {{
 *   id?: number,
 *   naam: string
 * }} Friet
 */
    

/**
 * @typedef {{
 *   id?: number,
 *   naam: string
 * }} Snack
 */



/**
 * @typedef {{
 *   naam: string,
 *   friet?: Friet,
 *   snack?: Snack,
 *   broodje?: Broodje,
 * }} BestelItem
 */
export default {};
