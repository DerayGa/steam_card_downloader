
# Features
- **Download** Steam Trading Card save as jpg file
- Retrieve **game title** and **trading card name** if possible

# Step
- **You need node.js to run this downloader**
- git clone this repo
- cd to it's folder
- do

    ``````
    npm install
    ``````
- and

    ``````
    node app.js
    ``````
    you will get a runing server.
- open your browser with http://127.0.0.1:3000/
- copy steam game url, e.g. 

    ``````
    http://steamcommunity.com/id/deray/gamecards/730/    (Counter-Strike Global Offensive)
    ``````
    paste to text input
![1.use url](https://raw.githubusercontent.com/DerayGa/steam_card_downloader/master/demo/1.use%20url.png)
- submit
- in this case, you will get small size of steam trading card
![2.get small trading card](https://raw.githubusercontent.com/DerayGa/steam_card_downloader/master/demo/2.get%20small%20trading%20card.png)

## Want Full Size Large Trading Card?
- open your browser with steam game url, e.g. ttp://steamcommunity.com/id/deray/gamecards/730/ 
- you have to login your steam account to gain card access
- view webpage source code and copy paste to textarea
![3.use html](https://raw.githubusercontent.com/DerayGa/steam_card_downloader/master/demo/3.use%20html.png)
- submit
- in this case, you will get both small and large steam trading card
![4.get both size of trading card](https://raw.githubusercontent.com/DerayGa/steam_card_downloader/master/demo/4.get%20both%20size%20of%20trading%20card.png)

## Where is my card?
- Check your **"steam_card_downloader" folder**, it will automatic create sub folder use game's title.
- Enjoy!
