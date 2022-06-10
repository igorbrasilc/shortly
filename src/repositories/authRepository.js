import db from '../database.js';

async function searchEmail(email) {
	return db.query('SELECT * FROM users WHERE email = $1', [email])
}

async function signUp(name, email, password) {
    const query = `
    INSERT INTO users
    (name, email, password) VALUES
    ($1, $2, $3)
    `;

    return db.query(query, [name, email, password])
}

export const authRepository = {
	searchEmail,
    signUp
}