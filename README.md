# Tik-tac-toe

## Getting Started with react frontend
```
npm install
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local
npm run start
```

## Getting Started with flask backend
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main` 

## Issues
- ~~Restarting the game would lead a broken state across all clients~~
    - Since I store a record of moves on the server per game, clients would log back in without receiving any moves upon restarting
    - Knowing this, when the move list is empty and we change our state to end the game I update the state within the board component
- ~~New spectators joining mid-game would be missing earlier moves~~
    - I stored all moves in a list on the server, then would broadcast that list to everyone loggin into a game
    - The clients would the pop the moves in order, using the appropriate board marker
    - I also clear this list of moves upon game completion

## Nice-to-haves
- I would have liked to work on creating a new socket for individual games sessions, this is my guess on how deperate rooms should work
- I would have liked to use a css framework to flex some more front-end muscle
