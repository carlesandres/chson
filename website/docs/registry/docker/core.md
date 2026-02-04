# Docker Essentials

Version: 24.x
Published: 2026-01-16

Essential Docker commands for container management.

## Images

| Example | Description |
| --- | --- |
| <pre>docker pull nginx:latest</pre> | Download an image from a registry. |
| <pre>docker images</pre> | Show all local images. |
| <pre>docker build -t myapp:1.0 .</pre> | Build image from Dockerfile in current directory. |
| <pre>docker rmi nginx:latest</pre> | Delete a local image. |
| <pre>docker image prune -a</pre> | Remove all unused images. |

## Containers

| Example | Description |
| --- | --- |
| <pre>docker run -d -p 8080:80 nginx</pre> | Start a container in detached mode with port mapping. |
| <pre>docker ps</pre> | Show running containers. |
| <pre>docker ps -a</pre> | Show all containers including stopped. |
| <pre>docker stop my-container</pre> | Gracefully stop a running container. |
| <pre>docker rm my-container</pre> | Delete a stopped container. |
| <pre>docker logs -f my-container</pre> | Follow container logs in real-time. |

## Exec & Debug

| Example | Description |
| --- | --- |
| <pre>docker exec -it my-container /bin/sh</pre> | Open interactive shell in running container. |
| <pre>docker exec my-container cat /etc/hosts</pre> | Execute a command in a running container. |
| <pre>docker inspect my-container</pre> | View detailed container configuration as JSON. |
| <pre>docker stats</pre> | Live resource usage for all containers. |

## Volumes

| Example | Description |
| --- | --- |
| <pre>docker volume create mydata</pre> | Create a named volume for persistent data. |
| <pre>docker volume ls</pre> | Show all volumes. |
| <pre>docker run -v mydata:/app/data nginx</pre> | Attach a volume to a container. |
| <pre>docker run -v $(pwd):/app nginx</pre> | Mount host directory into container. |

## Networks

| Example | Description |
| --- | --- |
| <pre>docker network ls</pre> | Show all Docker networks. |
| <pre>docker network create mynet</pre> | Create a custom bridge network. |
| <pre>docker network connect mynet my-container</pre> | Add a container to a network. |

## Cleanup

| Example | Description |
| --- | --- |
| <pre>docker container prune</pre> | Delete all stopped containers. |
| <pre>docker system prune -a --volumes</pre> | Remove all unused data (images, containers, volumes). |
| <pre>docker system df</pre> | Show Docker disk usage summary. |
