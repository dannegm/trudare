# Truth o Dare.

### How to run.

1. Clone the repo

```bash
$ git clone git@github.com:dannegm/trudare.git
```

2. Copy and setup the env files

```bash
$ cp .env.example .env && $EDITOR .env
```

3. Run the server

```bash
$ npm run serve
```

### How to prod.

1. Copy and setup the env files

```bash
$ cp .env.example .env.prod && $EDITOR .env.prod
```

3. Compile the app

```bash
$ npm run build
```

4. Deploy on firebase

```bash
$ firebase deploy
```
