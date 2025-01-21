module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/ai_lingo.db'
    },
    useNullAsDefault: true, 
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  }
};