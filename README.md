# content-media-authencity-backend
Content Media Authencity backend 

# Instructions to run the project
<ol>
  <li>Clone the repository </li>
  <li>Run the command <code>npm i </code></li>
  <li>Create the <code>.env</code> file</li>
  <li>Install one global package <code>npm i -g nodemon</code></li>
  <li>Run the following code <code>nodemon app.js</code></li>
  <li>Check the port you have mentioned in the <code>.env</code> file and run it as <code>localhost:3000/</code></li>
  <li>To run the API test install one of the packages <code>npm i -g newman-reporter-htmlextra</code></li>
  <li>Run the following command to get the HTML report when the server is running <code>newman run postman/API_test/Content-Media-Authenticity-Backend\ API\ Test.postman_collection.json -e postman/environment/Local_Environment.postman_environment.json  -r htmlextra --reporter-htmlextra-export report.html </code></li>
  <li>For API documentation of swagger follow this URL <code>localhost:3000/api-docs/</code></li>
  <li>For the redis configuration download the redis setup and connect it with <code>REDIS_URL</code>.
</ol>

# Instructions for variables required in the .env file

<code>MONGODB_URI</code>=your_mongo_url<br>
<code>SESSION_SECRET</code>=yourSecretKey <br>
<code>JWT_SECRET</code> =your_jwt_secret_code <br>
<code>PORT</code>=your_running_port <br>
<code>EMAIL_USER</code>=email_for_sending_email_verfication_here <br>
<code>EMAIL_PASS</code>=password_of_above_email <br>
<code>GOOGLE_CLIENT_ID</code>=google_oauth_client_id <br>
<code>GOOGLE_CLIENT_SECRET</code>=google_oauth_client_secret <br>
<code>GOOGLE_CALLBACK_URL</code>=http://localhost:3000/api/auth/google/callback <br>
<code>AWS_REGION</code>=ap-southeast-2 <br>
<code>AWS_S3_BUCKET_NAME</code>=your_bucket_name <br>
<code>AWS_ACCESS_KEY_ID</code>=your_AWS_ACCESS_KEY_ID <br>
<code>AWS_SECRET_ACCESS_KEY</code>=your_AWS_SECRET_ACCESS_KEY <br>
<code>REDIS_URL</code>=redis://127.0.0.1:6379
<code>FRONTEND_URL</code>=http://localhost:3001
<code>METADATA_EXTRACTION_API_KEY=key_provided_by_AI_here

# Docker Redis configuration for the token expiry testing
As we are also using redis for the token validation of the JWT token. We need the redis-server to be running. 

Enter this command for downloading the redis server after the docker installation has been completed.  

``
  docker run -d 
    --name redis-server 
    -p 6379:6379 
    redis:latest
``    

This will create a running instance of redis-server and it is ready to accept the connection.

To check if the server is running or not run this command:  
``
docker ps
``