const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

/*************************************/
/*******   DB Connection  *************/
/**************************************/

let db;

(async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database,
  });
})();

/**
 * Fetch all games
 * http://localhost:3000/games
 */
async function fetchAllGames() {
  const query = 'SELECT * FROM games';
  const results = await db.all(query, []);
  return { games: results };
}
app.get('/games', async (req, res) => {
  try {
    const results = await fetchAllGames();
    if (results.games.length === 0) {
      return res.status(404).json({
        message: 'No game found.',
      });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/***** Excercise 2 ********/
/***
 * Find Game By ID
 * http://localhost:3000/games/details/1
 */

async function findGameById(id) {
  const query = 'SELECT * FROM games WHERE id = ?';
  const result = await db.get(query, [id]);
  //console.log('result from db:', result);
  return { game: result };
}
app.get('/games/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await findGameById(id);
    //console.log('result from findBygameId:', result);
    if (result && result.game !== undefined) {
      res.status(200).json(result);
    } else {
      return res.status(404).json({ message: 'Game not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/************** Exercise 3: Get Games by Genre ***********/
/*****
 * Objective: Fetch games based on their genre.

  URL: /games/genre/FPS
*/

async function findGamesByGenre(genre) {
  const query = 'SELECT * FROM games WHERE genre = ? COLLATE NOCASE';
  const results = await db.all(query, [genre]);
  return { games: results };
}
app.get('/games/genre/:genre', async (req, res) => {
  const genre = req.params.genre;
  try {
    const results = await findGamesByGenre(genre);
    if (results.games.length === 0) {
      return res.status(404).json({ message: 'Games not found.' });
    }
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/************* Exercise 4: Get Games by Platform **************/
/***
 * URL: games/platform/PC
 */
async function findGamesByPlatform(platform) {
  const query = 'SELECT * FROM games WHERE platform = ? COLLATE NOCASE';
  const results = await db.all(query, [platform]);
  return { games: results };
}
app.get('/games/platform/:platform', async (req, res) => {
  const platform = req.params.platform;
  try {
    const results = await findGamesByPlatform(platform);
    if (results.games.length === 0) {
      return res.status(404).json({ message: 'Games not found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/********* Exercise 5: Get Games Sorted by Rating ********/
/***
 * URL: /games/sort-by-rating
 */
async function fetchGamesSortByRating() {
  const query = 'SELECT * FROM games ORDER BY rating DESC';
  const results = await db.all(query, []);
  return { games: results };
}
app.get('/games/sort-by-rating', async (req, res) => {
  try {
    const results = await fetchGamesSortByRating();
    if (results.games.length === 0) {
      return res.status(404).json({ message: 'Games not found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/******************* Exercise 6: Get All Players **********/
/***
 * URL: /players
 */

async function fetchAllPlayers() {
  const query = 'SELECT * FROM players';
  const results = await db.all(query, []);

  return { players: results };
}
app.get('/players', async (req, res) => {
  try {
    const results = await fetchAllPlayers();
    if (results.players.length === 0) {
      return res.status(404).json({ message: 'No Players found.' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/********************** Exercise 7: Get Player by ID **********/
/****
 * URL: /palyers/details/:id
 */

async function fetchPlayerByid(id) {
  const query = 'SELECT * FROM players WHERE id = ?';
  const result = await db.get(query, [id]);
  return { player: result };
}

app.get('/players/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await fetchPlayerByid(id);
    if (result && result.player !== undefined) {
      return res.status(200).json({ result });
    } else {
      return res.status(400).json({ message: 'Player not exist.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*********************** Exercise 8: Get Players by Platform *********/
/*****
 * URL: /players/platform/:platform
 */
async function fetchPlayersByPlatform(platform) {
  const query = 'SELECT * FROM players WHERE platform = ? COLLATE NOCASE';
  const results = await db.all(query, [platform]);
  return { players: results };
}
app.get('/players/platform/:platform', async (req, res) => {
  const platform = req.params.platform;
  try {
    const results = await fetchPlayersByPlatform(platform);
    if (results.players.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/****************** Exercise 9: Get Players Sorted by Rating ********/
/***
 * URL: /players/sort-by-rating
 */
async function fetchPlayersSortByRating() {
  const query = 'SELECT * FROM players ORDER BY rating DESC';
  const results = await db.all(query, []);
  return { players: results };
}
app.get('/players/sort-by-rating', async (req, res) => {
  try {
    const response = await fetchPlayersSortByRating();
    if (response.players.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/********************** Exercise 10: Get All Tournaments ************/
/***
 * URL: /tournaments
 */
async function fetchAllTournamets() {
  const query = 'SELECT * FROM tournaments';
  const results = await db.all(query, []);
  return { tournaments: results };
}
app.get('/tournaments', async (req, res) => {
  try {
    const response = await fetchAllTournamets();
    if (response.tournaments.length === 0) {
      return res.status(404).json({ messgae: 'No tournaments found' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/****************** Exercise 11: Get Tournament by ID ******/
/****
 * URL: /tournaments/details/1
 */

async function fetchTournamentById(id) {
  const query = 'SELECT * FROM tournaments WHERE id = ?';
  const result = await db.get(query, [id]);
  return { player: result };
}
app.get('/tournaments/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await fetchTournamentById(id);
    if (response && response.player !== undefined) {
      res.status(200).json(response);
    } else {
      return res.status(404).json({ message: 'Tournament not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************** Exercise 12: Get Tournaments by Game ID **********/
/*****
 * URL : /tournaments/game/1
 */
async function fetchTournamentsByGameId(gameId) {
  const query = 'SELECT * FROM tournaments WHERE gameId = ?';
  const results = await db.all(query, [gameId]);

  return { tournaments: results };
}

app.get('/tournaments/game/:gameId', async (req, res) => {
  const gameId = parseInt(req.params.gameId);
  try {
    const response = await fetchTournamentsByGameId(gameId);
    if (response.tournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/********** Exercise 13: Get Tournaments Sorted by Prize Pool *********/
/*****
 * URL: /tournaments/sort-by-prize-pool
 */

async function tournamnetsSortByPrizePool() {
  const query = 'SELECT * FROM tournaments ORDER BY prizePool DESC';
  const results = await db.all(query, []);
  return { tournamnets: results };
}
app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  try {
    const response = await tournamnetsSortByPrizePool();
    if (response.tournamnets.length === 0) {
      return res.status(404).json({ message: 'No tournaments found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/', (req, res) => {
  res.send('Welcome to Gaming Community Platform Backend API!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
