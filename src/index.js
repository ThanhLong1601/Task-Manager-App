const app = require('./app.js')

app.set('name', process.env.APP_NAME);
app.set('version', process.env.APP_VERSION);
app.set('port', process.env.APP_PORT);
app.set('env', process.env.APP_ENV);
app.set('host', process.env.APP_HOST);
app.set('db_name', process.env.DB_NAME);

app.listen(app.get('port'), () => {
    console.info(`
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
- Name: ${app.get('name')}
- Version: ${app.get('version')}
- Environment: ${app.get('env')}
- Host: ${app.get('host')}
- Database (MongoDB): ${app.get('db_name')}    
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$     
    `)
})