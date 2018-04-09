#!/bin/bash

# This script will start a single "disposable" instance and connect you to it via bash.
# The instance will link to all infrastructure
# It's disposable, so exit bash and the containers are removed
IMAGE_NAME="sample_backend"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${SCRIPT_DIR}")"

echo " ----- Starting Up Infrastructure Containers -----"
 docker-compose -p sample_ up -d

# Start our disposable container and link in needed containers.
echo " ----- Starting Disposable Docker Containers -----"
echo " ----- Using .env File from [${ROOT}] -----"

docker run \
    -i \
    -t \
    -p 9999:9999 \
    -v ${ROOT}:/src \
    --env HOST_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1') \
    --env-file=${ROOT}/.env \
    --network=sample_network \
    ${IMAGE_NAME} \
    sh -c "npm install && bash"

# When bash is exited, remove the container
echo " ----- EXITED from disposable container -----"
echo " ----- Removing Containers -----"

# No point leaving our services running after exiting the container
docker ps -a | grep 'sample_backend' | grep -v mysql | grep -v test | awk '{print $1 }' | xargs -I {} docker rm -f {}