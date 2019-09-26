# judgIt
A little chrome extension to tag/comment sites with colors.

## Setup server
The backend is a node server with a postgresql db , the following instruction and file manipulation will happen in the `judgit_server` folder.

1. Execute the `schema_export_create.sql` script into a postgresql server, this script directly create the database with the `judgeit` name.

2. Remove `.example` extension of the `config.js.extension` file and change the content of the file accordingly to the postgresql server configuration.

3.You can now run `npm install`


4.For test purpose ,you can change to default port `defaultPort` property,by default it's `3000`.

5.Yan can now run `npm run` wich will start the server at port 3000.

## Setup extension 

1. In google chrome , go to `chrome://extensions/` and check `developper mode` in the upper right corner.

2. Under the blue bar ,click on `load unpacked extension` and chose the `judgit_extension` folder.Now the extension icon should appear in the chrome bar.

## Use it !

1. Go to a website you want to comment on ,click on the extension icon , give a little comment and tell its emotion by chosing the color and click on `+1`.

2. Now search the page you just commented on Google for example , if you hover the link of the same page , you will see a little color telling the overall feeling people have on this page.


