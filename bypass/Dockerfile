FROM python:3.12

RUN pip install fastapi uvicorn

EXPOSE 8000

RUN apt-get update
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils xvfb chromium

#install python dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY ./app /app

# Set display port and dbus env to avoid hanging
ENV DISPLAY=:99
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

COPY run.sh .
CMD [ "/bin/bash", "run.sh" ]