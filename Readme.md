# See this app in action:
 [https://training-tracker-gndec.vercel.app/home](https://training-tracker-gndec.vercel.app/home)

# Steps to push for production

1. change VITE_ENV from development to production in client/.env.production
2. in root direcotry `docker compose up`
 
# TODO

1. add clickable breadcrumbs for navigation (easy)
2. setup ci/cd
3. better state management
 
```
git clone https://github.com/whogurdevil/training-tracker-gndec
cd training-tracker-gndec

cd backend
npm i
nodemon index.js
cd ../client
npm i
npm start
```
