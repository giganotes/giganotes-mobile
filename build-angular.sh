cd angular
npm install
ng build --prod
cd ..
mkdir -p app/src/main/assets
cp -R angular/dist/giganotes-mobile/* app/src/main/assets