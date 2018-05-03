
How to start server:
start the server via the startServer() function from the server.js file.  This will allow us to connect to our mongodb (process.env.MONGODB_URI).  Mongoose acts as the middleware that connects us from our computer to the mongodb. 

how to make requests to each endpoint:

dinosaurRouter.post() is how we send new data to mongodb.  If there is no database available to receive the new data we've attempted to send, the server will display a 400 error and error message will read 'Responding with a 400 error code.'   If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'POST - responding with a 200 status code'.

dinosaurRouter.get() is how we send retrieve data from mongodb.  If there is no database available to receive the new data we've attempted to send, the server will display a 404 error and error message will read 'GET - responding with a 404 status code'.  If the new data is retrieved successfully from mongodb the server will display a 200 message and the message will read 'GET - responding with a 200 status code'.

dinosaurRouter.delete() is how we delete data from mongodb.  If there is no database available to delete the data we've attempted to delete, the server will display a 404 error and error message will read 'DELETE - responding with a 404 status code.'  If there is no specific id available in the database to delete, the server will display a 400 error and error message will read 'DELETE - no id in the query responding with a 400 status code.'  If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'DELETE - responding with a 200 status code'.

dinosaurRouter.post() is how we send new data to mongodb.  If there is no database available to receive the new data we've attempted to send, the server will display a 400 error and error message will read 'Responding with a 400 error code.'   If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'POST - responding with a 200 status code'.

