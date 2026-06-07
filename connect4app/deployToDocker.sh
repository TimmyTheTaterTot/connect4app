#!/bin/bash

TAG="${1:-latest}"
KEYS_DIR="$(cd "$(dirname "$0")/../keys" && pwd)"
REGISTRY_USER_FILE="$KEYS_DIR/CONTAINER_REG_USER"
REGISTRY_PASS_FILE="$KEYS_DIR/CONTAINER_REG_PASS"

if ! podman login --get-login "git.darlingdigital.net" >/dev/null 2>&1; then
	if [[ ! -f "$REGISTRY_USER_FILE" || ! -f "$REGISTRY_PASS_FILE" ]]; then
		echo "Missing registry credentials in $KEYS_DIR"
		echo "Expected files: container_registry_user and container_registry_password"
		exit 1
	fi

	REGISTRY_USER="$(<"$REGISTRY_USER_FILE")"
	REGISTRY_PASS="$(<"$REGISTRY_PASS_FILE")"

	if [[ -z "$REGISTRY_USER" || -z "$REGISTRY_PASS" ]]; then
		echo "Registry credentials files are empty"
		exit 1
	fi

	echo "Logging in to git.darlingdigital.net"
	podman login "git.darlingdigital.net" -u "$REGISTRY_USER" -p "$REGISTRY_PASS"
fi

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