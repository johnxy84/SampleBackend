# Use the predefined node base image for this module.
FROM node:6.0.0

# create the log directory
RUN mkdir -p /var/log/applications/sampleBackend

# Tell npm to use our registry
RUN npm set registry https://registry.npmjs.org/

# Specific installations required to keep local server running - hence not included in npm install above.
RUN npm install nodemon -g

RUN mkdir /src

ADD . /src
WORKDIR /src

COPY package.json /src
# Install node dependencies
RUN npm install

# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/sampleBackend"]

# Expose web service and nodejs debug port
EXPOSE 9999