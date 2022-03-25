# Eerium

Eerium is a clone of the popular idea-sharing website, [Medium](www.medium.com).

Check out Eerium at the live site: [Eerium](https://eerium.herokuapp.com/).


## Getting Started
To view and use this application, you can either navigate to the [live hosted site](https://eerium.herokuapp.com/) and login as a new or demo user, or download the project locally:
1. Clone this repository ```git clone https://github.com/jinnie96/Eerium```

2. Open the file and install dependencies with ```npm install```

<!-- 3. ```cd``` into ```/react-app``` and install dependencies ```npm install``` -->

4.  Create a .env file based on the .env.example given

5.  Setup a PostgresSQL user + database:
    ```javascript
    psql -c "CREATE USER <username> PASSWORD '<password>' CREATEDB"
    psql -c "CREATE DATABASE <database name> WITH OWNER <username>"
    ```

6. Migrate and seed files with npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all

6. Start the app by running ```npm start```

7. Enjoy!

## Libraries Used
# Eerium is a full stack application that is built using a Pug frontend and an Express backend. PostgreSQL is utilized for data storage.
<img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height=40/><img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height=40/><img src="https://symbols.getvecta.com/stencil_92/57_pug.a23626476f.jpg" height=40/><img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height=40/><img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height=40/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height=40/><img  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height=40/>

## Features

### Splash Page
![image](https://i.ibb.co/XxYSkSr/Screen-Shot-2022-03-24-at-7-09-00-PM.png)

### Login
![image](https://i.ibb.co/bzWs9bt/Screen-Shot-2022-03-25-at-12-43-30-AM.png)

### Sign-Up
![image](https://i.ibb.co/hZjsMwg/Screen-Shot-2022-03-25-at-12-44-13-AM.png)

### Story Page
![image](https://i.ibb.co/85MpFjy/Screen-Shot-2022-03-25-at-12-46-40-AM.png)

### User Profile Page
![image](https://i.ibb.co/K7RHWv9/Screen-Shot-2022-03-25-at-12-47-34-AM.png)

## Functionality

### Stories (Create, Read, Update, Delete)
Users can implement full CRUD functionality on stories.

### Comments (Create, Read, Update, Delete)
Users can implement full CRUD functionality on comments.

### Likes (Read, Update)
Users can view the likes on any story. The amount of likes update as users like, or unlike a story.

### Follows/Feed (Read, Update)
Users can follow and unfollow others. Additionally, users can see the amount of users they follow, and users that follow them. The feed is updated to display followed user's stories.

## Future Features
- Categories
    - Users will be able to categorize stories, and search for stories based on category.
