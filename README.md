# SabziCart --- Dockerized Node.js Application

SabziCart is a vegetable-shopping web application built with Node.js and
Express. This project demonstrates how to package a web application into
a Docker image and run it in a container.

> **Current scope:** This README documents the local Docker workflow
> shown in the project screenshot. It does not assume that the
> application has been published to Docker Hub or deployed to a public
> server.

## Table of contents

-   [Project structure](#project-structure)
-   [How the application works](#how-the-application-works)
-   [Requirements](#requirements)
-   [Build the Docker image](#build-the-docker-image)
-   [Run and access the application](#run-and-access-the-application)
-   [Access from another device](#access-from-another-device)
-   [Useful Docker commands](#useful-docker-commands)
-   [Update the application](#update-the-application)
-   [Troubleshooting](#troubleshooting)
-   [DevOps skills demonstrated](#devops-skills-demonstrated)
-   [Security notes](#security-notes)

## Project structure

``` text
App/
├── public/
│   ├── images/
│   │   ├── carrot.jpg
│   │   ├── cucumber.jpg
│   │   ├── onion.jpg
│   │   ├── potato.jpg
│   │   ├── tomato.jpg
│   │   └── vegetables.jpg
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .dockerignore
├── Dockerfile
├── package.json
└── server.js
```

### Main files and folders

-   **`server.js`** --- Creates the Express application, reads
    `process.env.PORT` (default `3000`), enables JSON request parsing,
    and serves static files from `public/`. The screenshot also shows a
    WhatsApp number setting; configure it correctly before relying on
    that feature.
-   **`package.json`** --- Defines project metadata, dependencies, and
    any npm scripts.
-   **`Dockerfile`** --- Instructions used to build the Docker image.
-   **`.dockerignore`** --- Lists files and folders that should not be
    sent as part of the Docker build context.
-   **`public/index.html`** --- The webpage structure.
-   **`public/style.css`** --- The webpage styling.
-   **`public/script.js`** --- Browser-side interactions.
-   **`public/images/`** --- Image assets used by the website.

## How the application works

1.  Docker reads the `Dockerfile` and builds an image from the project
    directory.
2.  A container is created from that image.
3.  The Node.js/Express server runs inside the container and listens on
    port `3000` by default.
4.  Docker publishes a host port and forwards requests to the container
    port.
5.  The browser sends requests to the host address, and Express returns
    the website files.

``` text
Browser
  |
  | http://localhost:3000
  v
Windows host port 3000
  |
  | Docker port mapping: 3000:3000
  v
Container port 3000
  |
  v
Node.js + Express
  |
  v
public/index.html, style.css, script.js, images
```

## Requirements

-   Docker Desktop on Windows, or Docker Engine on Linux.
-   The project source files.
-   A free host port for the published application (port `3000` in the
    examples below).

You do not need to install Node.js directly on the host just to run the
app in Docker, as long as the image contains the required Node.js
runtime and dependencies.

## Build the Docker image

Open PowerShell in the project root---the directory containing
`Dockerfile`, `package.json`, and `server.js`. For example:

``` powershell
cd "F:\DevOPS BOOTCAMP\App"
```

Build the image:

``` powershell
docker build -t sabzicart-dockerized .
```

What the command means:

-   `docker build` builds an image.
-   `-t sabzicart-dockerized` gives the image a local name/tag.
-   `.` uses the current directory as the Docker build context.

Confirm that the image exists:

``` powershell
docker images
```

If the build fails, read the error output and confirm that the
`Dockerfile` is in the current directory.

## Run and access the application

### Start the container

``` powershell
docker run -d --name sabzicart-container -p 3000:3000 sabzicart-dockerized
```

Explanation:

-   `-d` runs the container in the background.
-   `--name sabzicart-container` gives the container a name.
-   `-p 3000:3000` maps host port `3000` to container port `3000`.
-   `sabzicart-dockerized` is the image used to create the container.

The port mapping format is:

``` text
-p HOST_PORT:CONTAINER_PORT
```

The application must listen on the container port. In this project,
`server.js` defaults to `3000`.

### Open the app on the same computer

Open this URL in your browser:

**http://localhost:3000**

You can also test the HTTP response from PowerShell:

``` powershell
curl.exe http://127.0.0.1:3000
```

Check that the container is running:

``` powershell
docker ps
```

Check the application logs:

``` powershell
docker logs sabzicart-container
```

### Use another host port

If host port `3000` is already in use, publish a different host port,
such as `4000`:

``` powershell
docker run -d --name sabzicart-container -p 4000:3000 sabzicart-dockerized
```

Then visit **http://localhost:4000**. The first port is on your
computer; the second is inside the container.

If a container with the same name already exists, remove it before
creating a replacement:

``` powershell
docker rm -f sabzicart-container
```

Then run the desired `docker run` command again.

## Access from another device

`localhost` always refers to the device on which the browser is running.
Therefore, `http://localhost:3000` on another person's computer will not
point to your computer.

### Another device on the same local network

1.  Ensure the container is running and its port is published.

2.  Find the Windows computer's local IPv4 address using:

    ``` powershell
    ipconfig
    ```

3.  On a trusted local network, another device may access the app using:

    ``` text
    http://YOUR_WINDOWS_LAN_IP:3000
    ```

    Replace `YOUR_WINDOWS_LAN_IP` with the actual IPv4 address shown by
    `ipconfig`.

4.  If it does not connect, check Windows Firewall rules and network
    isolation. Only permit access on a trusted network and only as
    needed.

### Access over the internet

Publishing a Docker port does **not** automatically make the application
available to everyone on the internet. Internet access requires a
reachable host/server and appropriate network and firewall
configuration. A safer common approach is to deploy the app to a public
hosting service or server, configure a domain, and use HTTPS through a
reverse proxy or hosting platform.

Do not expose a development application or unnecessary ports publicly
without reviewing security.

## Share the project through GitHub

GitHub can host the source code and documentation, but it does not
automatically run this Node.js application as a live website.

1.  Push the project source code, `Dockerfile`, `.dockerignore`, and
    this `README.md` to a GitHub repository.
2.  Other developers can clone the repository.
3.  They can build the image and run the container using the commands in
    this README.

Example for another developer:

``` powershell
git clone https://github.com/YOUR_USERNAME/sabzicart-dockerized.git
cd sabzicart-dockerized
docker build -t sabzicart-dockerized .
docker run -d --name sabzicart-container -p 3000:3000 sabzicart-dockerized
```

Replace `YOUR_USERNAME` with the actual GitHub account name.

## Share the Docker image through Docker Hub

If you want other people to download the built image without building it
from source, publish it to a container registry such as Docker Hub.

1.  Create a Docker Hub repository and decide whether it should be
    public or private.

2.  Sign in from your terminal:

    ``` powershell
    docker login
    ```

3.  Tag the local image (replace `YOUR_DOCKERHUB_USERNAME`):

    ``` powershell
    docker tag sabzicart-dockerized YOUR_DOCKERHUB_USERNAME/sabzicart-dockerized:latest
    ```

4.  Push the image:

    ``` powershell
    docker push YOUR_DOCKERHUB_USERNAME/sabzicart-dockerized:latest
    ```

Other users can then download and run it:

``` powershell
docker pull YOUR_DOCKERHUB_USERNAME/sabzicart-dockerized:latest
docker run -d --name sabzicart-container -p 3000:3000 YOUR_DOCKERHUB_USERNAME/sabzicart-dockerized:latest
```

These registry commands work only after the repository has been created
and the image has been pushed successfully.

## Useful Docker commands

  --------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- --------------------------------------
  List running containers             `docker ps`

  List all containers                 `docker ps -a`

  List local images                   `docker images`

  View logs                           `docker logs sabzicart-container`

  Follow logs live                    `docker logs -f sabzicart-container`

  Stop the container                  `docker stop sabzicart-container`

  Start an existing stopped container `docker start sabzicart-container`

  Remove a container                  `docker rm sabzicart-container`

  Remove a local image                `docker rmi sabzicart-dockerized`
  --------------------------------------------------------------------------

Stop a container before removing it, or use
`docker rm -f sabzicart-container` if you intentionally want to
force-remove it.

## Update the application

When source code changes, rebuild the image and recreate the container
so the new image is used:

``` powershell
docker build --no-cache -t sabzicart-dockerized .
docker rm -f sabzicart-container
docker run -d --name sabzicart-container -p 3000:3000 sabzicart-dockerized
```

`--no-cache` is useful for troubleshooting but is not necessary for
every build. Docker normally invalidates affected build layers when
copied files change. If the old result remains, also inspect the
Dockerfile's `COPY` instructions, any mounted directories, application
behavior, and browser caching.

## Troubleshooting

### The page does not open

-   Run `docker ps` and confirm the container is running.
-   Run `docker logs sabzicart-container` and check for startup errors.
-   Confirm that the Node.js app listens on port `3000` inside the
    container.
-   Confirm that the port mapping is `3000:3000`, or use the host port
    you configured.
-   Try `curl.exe http://127.0.0.1:3000` from PowerShell.

### Docker reports that the port is already allocated

Choose another host port, for example:

``` powershell
docker run -d --name sabzicart-container -p 4000:3000 sabzicart-dockerized
```

Open `http://localhost:4000`.

### Docker reports that the container name is already in use

Inspect containers with `docker ps -a`. If the old container is no
longer needed, remove it:

``` powershell
docker rm -f sabzicart-container
```

Then run the container again.

### Changes do not appear

Rebuild the image, recreate the container, and hard-refresh the browser
with `Ctrl+F5`. Confirm that the edited files are inside the build
context and copied by the Dockerfile.

## DevOps skills demonstrated

This project can demonstrate:

-   Docker image building from a `Dockerfile`
-   Container lifecycle management
-   Port publishing and basic networking
-   Build-context control using `.dockerignore`
-   Container logs and troubleshooting
-   Reproducible application packaging
-   Source-code documentation and sharing

Potential future enhancements include Docker Compose, non-root container
execution, health checks, image scanning, automated CI/CD with GitHub
Actions, and deployment behind HTTPS. Add these to the project
description only after implementing and testing them.

## Security notes

-   Do not commit `.env` files, passwords, API keys, or other secrets.
-   Review any hard-coded contact details in `server.js` before
    publishing the repository.
-   Do not assume a public GitHub repository is a running website.
-   Do not expose ports to the public internet unless you understand the
    firewall, authentication, and HTTPS implications.
-   Use only test or appropriately protected data in demonstrations.
