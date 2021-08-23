# Temperature Tool

With this tool, you can collect in batch thermometer records from one API endpoint(THERM001), upload it to the DB, and view it in Graph.

On the front end, the user can click on an "Upload" button, select the THERM001 file, and press a "Send" button. The batch will be uploaded to the backend.

The user can click on view charts to view the thermometer temperature history in a chart. Data will be fetched in an efficient way which initially will show the recent data and you can fetch more past data with a button click

Used NodeJS with express + MongoDB(mongoose)for the backend. React frontend
## Installation

Installation notes for macOS. You can follow the same steps for Linus and windows

## Usage

```bash
git clone foobar
```
```bash
cd ion
```
```bash
npm install
```
```bash
cd clients && npm install --force
```
Using --force, as some package needs to forcefully installed to override the dependencies

Check for the proxy settings in the package.json file
``
"proxy": "http://localhost:3001/"
``

## Install Mongo DB

Follow this link to install the MongoDB CE server, https://docs.mongodb.com/manual/administration/install-community/

Start the mongoDB server

```bash
brew services start mongodb-community@5.0
```
Follow the above-mentioned MongoDB doc link for different OS

## Start the server

```bash
node index.js --ignore client
```

## Start the client
```bash
cd client && npm start
```
use node version 15, nvm use 15

client host: ``http://localhost:3000/``

server host: ``http://localhost:3001/``

## Usage
1. Download the sample file, [Download](https://drive.google.com/file/d/1JWmJCxX7E06Y5NTTPdQFu0mO_7ob4RVz/view?usp=sharing)
2. Start the DB, client, and server.
3. Go to [http://localhost:3000](http://localhost:3000)
4. You will see a button Upload, click that and upload your file. (Optionally you will see two more buttons to access the data if you have already uploaded the data)
5. Once uploaded, confirm the file name that you have uploaded and click on the Send button.
6. Once clicked on send button, the system will upload your data to MongoDB and it will take few minutes to upload the data.
7. You will see a click to view graph button once it is successfully uploaded. Click on the button and you will be able to view the chart data.
8. You will see the most recent data in the chart to view the historical data, you can click on load more button and view the previous datas.

## API Endpoints

1. GET /update?index=1

This API provides the first set of the data to be view in the graph, on clicking load more you can increase the index to get the next set of data, it works like pagination and on every set of data you will also get the next index, so now worry on which set you are in.

It has a projection of data implemented, no matter what data you have, you will get only time and val as the response.

2. POST /update formData

This API allows you to upload a JSON file with temperature data to the database. 

Before updating in the database, it extracts(ts), transforms(time), and Loads(all) the data to the database (ETL)

3. DELETE /update

This API allows you to delete the entire data in the collection.

