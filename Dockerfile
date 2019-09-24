
### STAGE 1: Build Angular app ###

# We label our stage as 'ngbuilder'
FROM node:12-alpine as ngbuilder

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod


### STAGE 2: Setup ###

FROM store/intersystems/iris-community:2019.3.0.302.0

# we need to use Root user to set up environment
USER root

## Copy our default nginx config
RUN mkdir /tmp/src
COPY cls /tmp/src

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
RUN mkdir /opt/app
COPY --from=ngbuilder /ng-app/dist/ /opt/app/web

# change permissions to IRIS user
RUN chown -R ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} /opt/app
RUN chown -R ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} /tmp/src

# add a redirect to index.html
RUN echo "RedirectMatch ^/$ /index.html" >/usr/irissys/httpd/conf/httpd-local.conf

# Change back to IRIS user
USER irisowner

# Compile the application code
RUN iris start iris && \
    printf 'zn "USER" \n \
    do $system.OBJ.Load("/tmp/src/util/AppInstaller.cls","c")\n \
    do ##class(util.AppInstaller).Run()\n \
    zn "%%SYS"\n \
    do ##class(SYS.Container).QuiesceForBundling()\n \
    h\n' | irissession IRIS \
&& iris stop iris quietly
