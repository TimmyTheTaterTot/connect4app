TAG="${1:-latest}"

printf "\n----> Building frontend with Vite\n"
npm install
npm run build

printf "\n----> Building and pushing docker container image\n"
podman build -f dockerfile -t git.darlingdigital.net/zack/connect4app:$TAG .
podman push git.darlingdigital.net/zack/connect4app:$TAG

printf "\n----> Triggering container rebuild to fetch new image\n"
ssh zack@192.168.1.81 << ENDSSH
cd /srv/connect4app/
podman compose up --pull always -d
ENDSSH

printf "\n----> Cleaning up\n"
rm -r dist