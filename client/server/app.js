const express = require('express');
const { Server } = require("socket.io");
const { hashPassword, comparePassword } = require('./helpers/auth');
const User = require('./models/user');
const GoogleUser = require('./models/googleUser');
const cors = require('cors');
const { mongoose } = require('mongoose');
const http = require("http");
const { isNil } = require("./utils/utils");
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(
	cors({
		origin: 'exp://192.168.1.213:8081'
	})
)
// app.use('/', require('./routes/authRoutes'));

const server = http.createServer(app);


mongoose.connect(process.env.MONGO_URL).then(console.log('connected')).catch((error) => console.log(error));

app.post('/changePassword', async (req, res) => {
	const { actualPassword, newPassword, email } = req.body;

	if (isNil(actualPassword) && isNil(newPassword) && isNil(email)) {
		return res.status(400).json({ messaggio: 'Tutti i campi sono obbligatori' });
	}

	const user = await User.findOne({ email: email });
	if (isNil(user)) {
		return res.status(404).json({ messaggio: 'Nessun utente trovato nel database per questa email' });
	}
	const match = await comparePassword(actualPassword, user.password);

	if (match) {
		try {
			const hashedPassword = await hashPassword(newPassword);
			if (!hashedPassword) {
				return res.status(500).json({ messaggio: 'Errore durante la generazione della password criptata' });
			}

			const userUpdated = await User.findOneAndUpdate(
				{ email: email },
				{ password: hashedPassword },
				{ new: true, useFindAndModify: false }
			);

			if (!userUpdated) {
				return res.status(404).json({ messaggio: 'Utente non trovato' });
			}

			return res.status(200).json({ messaggio: 'Password aggiornata con successo' });
		} catch (errore) {
			console.error('Errore durante l\'aggiornamento della password:', errore);
			return res.status(500).json({ messaggio: 'Errore interno del server durante l\'aggiornamento della password' });
		}
	}

	res.status(400).json('la password inserita non è la password corretta');
})

app.post('/getActualUser', async (req, res) => {
	try {
		const { email } = req.body;
		if (email) {
			const user = await User.find({ email: email });
			res.status(200).json(user);
		} else {
			res.status(400).json({ messaggio: 'L\'email è obbligatoria' });
		}
	} catch (errore) {
		console.error('Errore durante il recupero dell\'utente:', errore);
		res.status(500).json({ messaggio: 'Errore interno del server' });
	}
})

app.post('/updateImagePic', async (req, res) => {
	try {
		const { photoUrl, email } = req.body;
		if (photoUrl && email) {
			const userUpdated = await User.findOneAndUpdate({ email: email }, { photoUrl: photoUrl }, { new: true, useFindAndModify: false });
			res.status(200).json(userUpdated);
		} else {
			res.status(400).json({ messaggio: 'L\'email e la foto sono obbligatori' });
		}
	} catch (errore) {
		console.error('Errore durante l\'aggiornamento dell\'immagine:', errore);
		res.status(500).json({ messaggio: 'Errore interno del server' });
	}
})

app.post('/register', async (req, res) => {
	try {
		const { name, username, email, password, userKey } = req.body;

		// if (isNil(name) && isNil(email) && isNil(password)) {
		// 	return res.json({
		// 		error: 'name,email e password sono obbligatori'
		// 	})
		// }

		console.log(name, username, email, password, userKey);

		if (isNil(name) && isNil(email) && isNil(password) && isNil(userKey) && isNil(username)) {
			return res.status(400).json({ messaggio: 'Tutti i campi sono obbligatori' });
		}

		const exist = await User.findOne({ email: email })

		console.log(exist);

		if (exist) {
			return res.json({
				error: 'Email is taken already'
			})
		}

		const hashedPassword = await hashPassword(password);

		console.log(hashedPassword);

		if (!hashedPassword) {
			return res.status(500).json({ messaggio: 'Errore durante la generazione della password criptata' });
		}

		const user = await User.create({
			name,
			username,
			email,
			password: hashedPassword,
			userKey: userKey
		})

		console.log(user);

		return res.json(user);
	} catch (errore) {
		console.error('Errore durante la registrazione:', errore);
		res.status(500).json({ messaggio: 'Errore interno del server' });
	}
})

app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		console.log(email, password);

		if (isNil(email) && isNil(password)) {
			return res.status(400).json({ messaggio: 'Tutti i campi sono obbligatori' });
		}

		const user = await User.findOne({ email });

		console.log(user);

		if (!user) {
			return res.json({
				error: 'No user found'
			})
		}

		const match = await comparePassword(password, user.password);

		console.log(match);

		if (match) {
			res.json(user);
		}
	} catch (errore) {
		console.error('Errore durante il login:', errore);
		res.status(500).json({ messaggio: 'Errore interno del server' });
	}
})

app.post('/saveGoogleUser', async (req, res) => {
	try {
		const { name, email, photo, userKey } = req.body;

		if (isNil(name) && isNil(email) && isNil(photo) && isNil(userKey)) {
			return res.status(400).json({ messaggio: 'Tutti i campi sono obbligatori' });
		}

		const user = await GoogleUser.findOne({ email });

		if (user) {
			return res.status(409).json({ message: 'Google User already exists' });
		}


		res.status(201).json({ message: 'User registered successfully' });
	} catch (errore) {
		console.error('Errore durante la registrazione:', errore);
		res.status(500).json({ messaggio: 'Errore interno del server' });
	}
})

server.listen(3000, () => {
	console.log("Listening on port 3000");
});



