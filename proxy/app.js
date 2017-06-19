const io = require('socket.io-client');
const fetch = require('node-fetch');
const _ = require('lodash/fp');

const apiPath = 'https://online-go.com:443';
const gameId = process.argv[2];
const clientId = process.env.ogsClientId;
const clientSecret = process.env.ogsClientSecret;
const username = process.env.ogsUsername;
const password = process.env.ogsPassword;

const toChar = (coord) => String.fromCharCode(97 + coord);
const coordToSgf = ([x, y, _]) => toChar(x) + toChar(y);

let boardHistory = [];

const currentBoard = () => boardHistory[boardHistory.length - 1];

const newBoard = (move, oldBoard) => _.defaults(oldBoard)({
  moves: _.concat(oldBoard.moves, [move])
});

const updateBoardHistory = (move) => {
  boardHistory.push(newBoard(move, currentBoard()))
};

const initBoardHistory = (playerColor, handicap, moves) => boardHistory = [{playerColor, handicap, moves}];

const needMove = () => {
  const {playerColor, handicap, moves} = currentBoard();
  return playerColor === 'white' ^ (moves.length < handicap || (moves.length - handicap) % 2 === 1)
};

const generateMove = (board) => 'bb';  // <--- generate move, call rest, etc.

const playGame = (accessToken, playerId, socket) => {
  const sendMove = (sgfMove) => {
    console.log(`### Sending new move: ${sgfMove}`);
    socket.emit('game/move', {
      "auth": accessToken,
      "game_id": gameId,
      "player_id": playerId,
      "move": sgfMove
    });
  };
  const conditionalPlay = () => needMove() && sendMove(generateMove(currentBoard()));
  socket.on(`game/${gameId}/gamedata`, ({handicap, phase, black_player_id, clock: {current_player}, moves}) => {
    if (phase === 'play') {
      const playerColor = black_player_id === playerId ? 'black' : 'white';
      console.log(`### Connected to Game: ${gameId} as Player ${playerId} (${playerColor})`);
      const translatedMoves = moves.map(coordToSgf);
      initBoardHistory(playerColor, handicap, translatedMoves);
      console.log(boardHistory);
      conditionalPlay()
    } else {
      console.log(`### Game: ${gameId} has ended`)
    }
  });
  socket.on(`game/${gameId}/move`, ({move}) => {
    const translatedMove = coordToSgf(move);
    console.log('### Received Move', translatedMove, "=>", currentBoard().moves);
    updateBoardHistory(translatedMove);
    conditionalPlay()
  });
};

const connectGame = (accessToken, playerId, socket) => {
  console.log('### Connecting to Game: ${gameId} as Player ${playerId}');
  fetch(`${apiPath}/api/v1/games/${gameId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((res) => res.json())
    .then(({auth}) => {
        playGame(auth, playerId, socket);
        socket.emit('game/connect', {
          "player_id": playerId,
          "game_id": gameId,
          "chat": false
        })
      }
    );
};

const createSocket = (accessToken) => {
  const socket = io(apiPath, {transports: ['websocket']});
  socket.on('connect', () => {
    console.log("### Connected to OGS ###")
  });
  socket.on('disconnect', () => {
    console.log("### Disconnected ###")
  });
  return socket;
};

fetch(`${apiPath}/oauth2/token/`, {
  method: 'POST',
  body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=password&username=${username}&password=${password}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
  .then((res) => res.json())
  .then(({access_token: accessToken, refresh_token: refreshToken}) =>
    fetch(`${apiPath}/api/v1/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => res.json())
      .then(({id: playerId}) => playerId)
      .then((playerId) => {
        const socket = createSocket(accessToken);
        connectGame(accessToken, playerId, socket);
      }));


