# HOW TO RUN THIS APP

1. Create .env file following .env.example file to configure your database
2. Make sure you are using `node v21.6.1` and `npm v10.2.4`
3. Run `npm install`
4. Run `npx prisma db push` to update your database
5. Seeding if needed with this command `npx prisma db seed`
6. Want to run test? `npm run test:coverage` or only test `npm run test`
7. Run the app `npm run start`

## Some tips

You can use vscode extenstion called `Rest Client` to be able run the api via `rest` folder
