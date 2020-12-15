#!/bin/bash
cd App
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

