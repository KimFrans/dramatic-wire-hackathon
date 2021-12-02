export default function OrigamiService(pool) {
  async function getInstructions(animal, stepID) {
    const queryStr = `SELECT instruction FROM ${animal}_steps WHERE id = ${stepID}`;
    const results = await pool.query(queryStr);
    return results.rows[0].instruction;
  }

  async function getAnimals() {
    const results = await pool.query('SELECT * FROM animals');
    return results.rows;
  }

  async function getTotalSteps(animal) {
    const queryStr = `SELECT COUNT(id) FROM ${animal}_steps`;
    const results = await pool.query(queryStr);
    return results.rows[0].count;
  }
  
  return {
    getInstructions,
    getAnimals,
    getTotalSteps
  }
}