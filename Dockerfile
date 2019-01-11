FROM node:11.6.0-alpine

# Mainly content from https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# Installs latest Chromium (71) package and other dependencies.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge \
      nss@edge \
      harfbuzz@edge



# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Set env file telling the script we're running inside docker
ENV IS_DOCKER=true

# Create a temp folder for outputing temporary files
RUN mkdir temp

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /temp

# Install packages needed
COPY package.json package-lock.json ./
RUN npm ci

# Copy Run scripts to execute
COPY convert/ convert/

# Run everything after as non-privileged user.
USER pptruser

# Since we use require('fs').promises which is experimental, we turn off warnings
CMD ["node", "--no-warnings", "convert/convertSvg.js"]

